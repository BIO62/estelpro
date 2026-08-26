import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { hashPassword } from '@/lib/auth/password';
import {
  deleteUnverifiedAppUser,
  findAppUserByEmail,
  findAppUserByPhone,
} from '@/lib/users/repo';
import { sendOtpEmail } from '@/lib/auth/mail';
import {
  clearPendingRegistration,
  setPendingRegistration,
} from '@/lib/auth/pending-registration';

type Field = 'lastName' | 'name' | 'phone' | 'email' | 'password';

function fail(field: Field, error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, field, ...extra }, { status });
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
  if (password.length < 6) return fail('password', 'Нууц үг хамгийн багадаа 6 тэмдэгт байна.');

  const existingApp = await findAppUserByEmail(email);
  if (existingApp?.emailVerified && existingApp.status === 'active') {
    return fail(
      'email',
      'Энэ имэйл аль хэдийн бүртгэлтэй. Нэвтрэх хэсэг рүү орно уу.',
      409,
      { alreadyRegistered: true },
    );
  }
  if (existingApp) await deleteUnverifiedAppUser(email);

  const phoneOwner = await findAppUserByPhone(phone);
  if (phoneOwner && phoneOwner.email.toLowerCase() !== email) {
    return fail('phone', 'Энэ дугаар өөр бүртгэлд холбогдсон байна.', 409);
  }

  const pending = {
    id: crypto.randomUUID(),
    email,
    name,
    lastName,
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  const code = String(randomInt(100000, 1000000));
  await setPendingRegistration(pending, code);
  try {
    await sendOtpEmail(email, code);
  } catch (error) {
    await clearPendingRegistration();
    console.error('registration OTP delivery failed', error);
    return fail('email', 'Баталгаажуулах код илгээж чадсангүй.', 502);
  }

  return NextResponse.json({
    ok: true,
    redirect: `/verify?email=${encodeURIComponent(email)}`,
  });
}
