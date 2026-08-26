const SECRET = process.env.AUTH_SECRET || 'estel-dev-secret';
const COOKIE = 'estel_auth';

export type SessionRole = 'consumer' | 'salon' | 'owner' | 'director' | 'manager' | 'operator';

export type SessionPayload = {
  id: string;
  email: string;
  role: SessionRole;
  exp: number;
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let ok = 0;
  for (let i = 0; i < a.length; i++) ok |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ok === 0;
}

async function hmacSign(body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return toBase64Url(new Uint8Array(sig));
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = await hmacSign(body);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload?.exp || payload.exp < Date.now()) return null;
    if (!payload.role || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

export { COOKIE };
