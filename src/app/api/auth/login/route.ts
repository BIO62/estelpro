import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, homeForRole } from '@/lib/auth/session';
import { findSalonByIdentifier } from '@/lib/salons/repo';
import { findAppUserByEmail, findAppUserByPhone } from '@/lib/users/repo';
import type { AccountKind } from '@/lib/auth/types';
import { isStaffRole, resolveStaffRole } from '@/lib/auth/roles';

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

  if (kind === 'staff') {
    if (user.kind !== 'staff' || !isStaffRole(user.role)) {
      return NextResponse.json({ error: 'Энэ хэсэг зөвхөн Portal хэрэглэгчид зориулагдсан.' }, { status: 403 });
    }
  } else if (user.kind === 'staff') {
    return NextResponse.json({ error: 'Portal /login/staff хэсгээр нэвтэрнэ үү.' }, { status: 403 });
  }
  if (user.status !== 'active') {
    return NextResponse.json({ error: 'Энэ бүртгэл идэвхгүй байна.' }, { status: 403 });
  }

  const sessionRole = user.kind === 'staff' ? resolveStaffRole(user.email, user.role) : user.role;

  await createSession({
    id: user.id,
    email: user.email,
    role: sessionRole,
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
      role: sessionRole,
      position: user.position || undefined,
      verified: user.emailVerified,
      createdAt: user.createdAt,
    },
    redirect: homeForRole(sessionRole),
  });
}
