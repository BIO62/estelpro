import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import {
  createAppUser,
  deleteUnverifiedAppUser,
  findAppUserByEmail,
  findAppUserByPhone,
} from '@/lib/users/repo';

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

  const user = await createAppUser({
    email,
    name,
    lastName,
    phone,
    passwordHash: hashPassword(password),
    status: 'active',
    emailVerified: true,
  });
  if (!user) return fail('email', 'Бүртгэлийн сан холбогдсонгүй.', 503);

  await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName || undefined,
      phone: user.phone || undefined,
      kind: user.kind,
      role: user.role,
      verified: user.emailVerified,
      createdAt: user.createdAt,
    },
    redirect: '/',
  });
}
