import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { DRESSER_COOKIE } from '@/lib/catalog-audience';
import { findAppUserByEmail } from '@/lib/users/repo';
import { resolveStaffRole } from './roles';
import { salonDiscountTier } from './salon-discount';
import type { PublicUser, UserRole } from './types';

const COOKIE = 'estel_auth';
const SECRET = process.env.AUTH_SECRET || 'estel-dev-secret';

type TokenPayload = {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
};

function sign(payload: TokenPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function readToken(token: string): TokenPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
  if (payload.exp < Date.now()) return null;
  return payload;
}

export async function createSession(user: { id: string; email: string; role: UserRole }) {
  const token = sign({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
  });
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14 });
  if (user.role === 'salon') {
    jar.set(DRESSER_COOKIE, '1', { path: '/', maxAge: 60 * 60 * 24 * 14, sameSite: 'lax' });
  } else {
    jar.set(DRESSER_COOKIE, '', { path: '/', maxAge: 0 });
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, '', { path: '/', maxAge: 0 });
  jar.set(DRESSER_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const payload = readToken(token);
  if (!payload) return null;
  if (payload.role === 'salon') {
    const { findSalonByEmail } = await import('@/lib/salons/repo');
    const salon = await findSalonByEmail(payload.email);
    if (!salon) return null;
    const tier = salonDiscountTier(salon.discountTier);
    return {
      id: salon.id,
      email: salon.email,
      name: salon.contactName,
      phone: salon.phone,
      salonName: salon.salonName,
      salonCode: salon.salonCode,
      address: salon.address,
      city: salon.city,
      district: salon.district || undefined,
      kind: 'salon',
      role: 'salon',
      discountPercent: salon.discountPercent,
      discountTier: salon.discountTier,
      discountLabel: tier?.label,
      verified: true,
      createdAt: new Date(0).toISOString(),
    };
  }
  const user = await findAppUserByEmail(payload.email);
  if (!user || user.status !== 'active') return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastName: user.lastName || undefined,
    phone: user.phone || undefined,
    address: user.address || undefined,
    city: user.city || undefined,
    district: user.district || undefined,
    position: user.position || undefined,
    kind: user.kind,
    role: user.kind === 'staff' ? resolveStaffRole(user.email, user.role) : user.role,
    verified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

export function salonContractPercent(session: PublicUser | null | undefined) {
  return session?.role === 'salon' ? session.discountPercent || 0 : 0;
}

export async function getSalonContractPercent() {
  return salonContractPercent(await getSessionUser());
}

export function homeForRole(role: UserRole) {
  if (role === 'salon') return '/dresser';
  if (role === 'owner' || role === 'director') return '/ad';
  if (role === 'manager') return '/ad';
  if (role === 'operator') return '/ad/orders';
  return '/list';
}
