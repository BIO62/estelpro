import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findUserByEmail, findUserByPhone, saveOtp, saveUser, toPublicUser } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';
import { sendOtpEmail } from '@/lib/auth/mail';

type Field = 'lastName' | 'name' | 'phone' | 'email' | 'password';

function fail(field: Field, error: string, status = 400) {
  return NextResponse.json({ error, field }, { status });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };
  const email = body.email?.trim().toLowerCase() || '';
  const lastName = body.lastName?.trim() || '';
  const name = body.name?.trim() || '';
  const password = body.password || '';
  const phoneDigits = (body.phone || '').replace(/\D/g, '').replace(/^976/, '');
  const phone = `+976${phoneDigits}`;

  if (!lastName) return fail('lastName', 'Овгоо оруулна уу.');
  if (!name) return fail('name', 'Нэрээ оруулна уу.');
  if (!/^[6-9]\d{7}$/.test(phoneDigits)) return fail('phone', 'Утасны дугаараа 8 оронтой байхаар оруулна уу.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('email', 'Имэйл хаягаа зөв оруулна уу.');
  if (password.length < 8) return fail('password', 'Нууц үг хамгийн багадаа 8 тэмдэгт байна.');
  if (findUserByEmail(email)) return fail('email', 'Энэ имэйл бүртгэлтэй байна.', 409);
  if (findUserByPhone(phone)) return fail('phone', 'Энэ дугаар бүртгэлтэй байна.', 409);

  const user = saveUser({
    id: crypto.randomUUID(),
    email,
    name,
    lastName,
    phone,
    kind: 'consumer',
    role: 'consumer',
    passwordHash: hashPassword(password),
    verified: false,
    createdAt: new Date().toISOString(),
  });
  const code = String(randomInt(100000, 999999));
  saveOtp({ email, code, purpose: 'register', expiresAt: Date.now() + 10 * 60 * 1000 });
  await sendOtpEmail(email, code);
  return NextResponse.json({ ok: true, user: toPublicUser(user) });
}
