import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'estel_pending_registration';
const SECRET = process.env.AUTH_SECRET || 'estel-dev-secret';
const TTL_SECONDS = 5 * 60;

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
  const payload: PendingToken = {
    ...registration,
    codeDigest: hmac(`${registration.email}:${code}`),
    exp: Date.now() + TTL_SECONDS * 1000,
  };
  (await cookies()).set(COOKIE, encode(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SECONDS,
  });
}

export async function readPendingRegistration(email: string) {
  const payload = decode((await cookies()).get(COOKIE)?.value);
  if (!payload || payload.email !== email.trim().toLowerCase()) return null;
  const { codeDigest: _codeDigest, exp: _exp, ...registration } = payload;
  return registration;
}

export async function verifyPendingRegistration(email: string, code: string) {
  const payload = decode((await cookies()).get(COOKIE)?.value);
  if (!payload || payload.email !== email.trim().toLowerCase()) return null;
  if (!equal(payload.codeDigest, hmac(`${payload.email}:${code}`))) return null;
  const { codeDigest: _codeDigest, exp: _exp, ...registration } = payload;
  return registration;
}

export async function clearPendingRegistration() {
  (await cookies()).set(COOKIE, '', { path: '/', maxAge: 0 });
}
