import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, homeForRole } from '@/lib/auth/session';
import { findSalonByIdentifier } from '@/lib/salons/repo';
import { findAppUserByEmail, findAppUserByPhone } from '@/lib/users/repo';
import type { AccountKind } from '@/lib/auth/types';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    salonCode?: string;
    password?: string;
    kind?: AccountKind;
  };
  const identifier = (body.salonCode || body.email || '').trim();
  const password = body.password || '';
  const kind = body.kind || 'consumer';

  if (!identifier) {
    return NextResponse.json({ error: 'Нэвтрэх нэр, код эсвэл дугаараа оруулна уу.' }, { status: 400 });
  }

  // 1. Salon Login: Supports Salon Code, Phone, or Email + Password
  if (kind === 'salon') {
    const salon = await findSalonByIdentifier(identifier);
    if (!salon) {
      return NextResponse.json({ error: 'Салоны код эсвэл бүртгэл олдсонгүй.' }, { status: 404 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Нууц үгээ оруулна уу.' }, { status: 400 });
    }

    await createSession({
      id: salon.id,
      email: salon.email,
      role: 'salon',
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: salon.id,
        email: salon.email,
        name: salon.contactName || salon.salonName,
        phone: salon.phone,
        salonName: salon.salonName,
        salonCode: salon.salonCode,
        kind: 'salon',
        role: 'salon',
        verified: true,
        createdAt: new Date().toISOString(),
      },
      redirect: '/dresser',
    });
  }

  // 2. Consumer & Staff Login: Email or Phone + Password
  const lowerId = identifier.toLowerCase();

  const user = lowerId.includes('@')
    ? await findAppUserByEmail(lowerId)
    : await findAppUserByPhone(identifier);
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Имэйл/дугаар эсвэл нууц үг буруу.' }, { status: 401 });
  }

  if (kind === 'staff' && user.kind !== 'staff') {
    return NextResponse.json({ error: 'Энэ хэсэг зөвхөн ажилтанд зориулагдсан.' }, { status: 403 });
  }

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
    redirect: user.role === 'manager' || user.role === 'operator' ? '/ad' : homeForRole(user.role),
  });
}
