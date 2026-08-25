import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByPhone, saveUser, toPublicUser } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { deleteUnverifiedAppUser, findAppUserByEmail } from '@/lib/users/repo';

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

  const existingLocal = findUserByEmail(email);
  if (existingLocal?.verified) {
    return fail(
      'email',
      'Энэ имэйл аль хэдийн бүртгэлтэй. Нэвтрэх хэсэг рүү орно уу.',
      409,
      { alreadyRegistered: true },
    );
  }

  const phoneOwner = findUserByPhone(phone);
  if (phoneOwner && phoneOwner.email.toLowerCase() !== email && phoneOwner.verified) {
    return fail('phone', 'Энэ дугаар өөр бүртгэлд холбогдсон байна.', 409);
  }

  try {
    const existingApp = await findAppUserByEmail(email);
    if (existingApp?.emailVerified && existingApp.status === 'active') {
      return fail(
        'email',
        'Энэ имэйл аль хэдийн бүртгэлтэй. Нэвтрэх хэсэг рүү орно уу.',
        409,
        { alreadyRegistered: true },
      );
    }
    if (existingApp && !existingApp.emailVerified) {
      await deleteUnverifiedAppUser(email);
    }
  } catch {
    /* optional */
  }

  const passwordHash = hashPassword(password);
  const id = existingLocal ? existingLocal.id : crypto.randomUUID();

  // Save as directly verified consumer user
  const user = saveUser({
    id,
    email,
    name,
    lastName,
    phone,
    kind: 'consumer',
    role: 'consumer',
    passwordHash,
    verified: true,
    createdAt: new Date().toISOString(),
  });

  // Automatically create session and log the user in immediately
  await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({
    ok: true,
    user: toPublicUser(user),
    redirect: '/',
  });
}
