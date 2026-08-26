import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { OTP_TTL_MS, PENDING_REGISTRATION_TTL_SECONDS } from '@/lib/auth/otp';

const COOKIE = 'estel_pending_registration';
const SECRET = process.env.AUTH_SECRET || 'estel-dev-secret';

export type PendingRegistration = {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

type PendingToken = PendingRegistration & {
  codeDigest: string;
  exp: number;
  codeExp: number;
};

function hmac(value: string) {
  return createHmac('sha256', SECRET).update(value).digest('base64url');
}

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function encode(payload: PendingToken) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

function decode(token?: string): PendingToken | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || !equal(signature, hmac(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as PendingToken;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export async function setPendingRegistration(registration: PendingRegistration, code: string) {
  const now = Date.now();
  const payload: PendingToken = {
    ...registration,
    codeDigest: hmac(`${registration.email}:${code}`),
    exp: now + PENDING_REGISTRATION_TTL_SECONDS * 1000,
    codeExp: now + OTP_TTL_MS,
  };
  (await cookies()).set(COOKIE, encode(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PENDING_REGISTRATION_TTL_SECONDS,
  });
}

export async function readPendingRegistration(email: string) {
  const payload = decode((await cookies()).get(COOKIE)?.value);
  if (!payload || payload.email !== email.trim().toLowerCase()) return null;
  const { codeDigest: _codeDigest, exp: _exp, codeExp: _codeExp, ...registration } = payload;
  return registration;
}

export async function verifyPendingRegistration(email: string, code: string) {
  const payload = decode((await cookies()).get(COOKIE)?.value);
  if (!payload || payload.email !== email.trim().toLowerCase()) return null;
  if ((payload.codeExp || payload.exp) <= Date.now()) return null;
  if (!equal(payload.codeDigest, hmac(`${payload.email}:${code}`))) return null;
  const { codeDigest: _codeDigest, exp: _exp, codeExp: _codeExp, ...registration } = payload;
  return registration;
}

export async function clearPendingRegistration() {
  (await cookies()).set(COOKIE, '', { path: '/', maxAge: 0 });
}
