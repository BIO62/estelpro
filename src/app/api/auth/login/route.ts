import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByPhone, findUserBySalonCode, toPublicUser } from '@/lib/auth/store';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, homeForRole } from '@/lib/auth/session';
import { findSalonByIdentifier } from '@/lib/salons/repo';
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

    const localUser = findUserBySalonCode(salon.salonCode) || findUserByEmail(salon.email);
    if (localUser && localUser.passwordHash) {
      if (!password || !verifyPassword(password, localUser.passwordHash)) {
        return NextResponse.json({ error: 'Салоны нууц үг буруу байна.' }, { status: 401 });
      }
    } else {
      if (!password || password.length < 1) {
        return NextResponse.json({ error: 'Нууц үгээ оруулна уу.' }, { status: 400 });
      }
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

  // Also check if entered identifier is a salon attempting to log in on consumer tab
  const possibleSalon = await findSalonByIdentifier(identifier);
  if (possibleSalon) {
    await createSession({
      id: possibleSalon.id,
      email: possibleSalon.email,
      role: 'salon',
    });
    return NextResponse.json({
      ok: true,
      user: {
        id: possibleSalon.id,
        email: possibleSalon.email,
        name: possibleSalon.contactName || possibleSalon.salonName,
        phone: possibleSalon.phone,
        salonName: possibleSalon.salonName,
        salonCode: possibleSalon.salonCode,
        kind: 'salon',
        role: 'salon',
        verified: true,
        createdAt: new Date().toISOString(),
      },
      redirect: '/dresser',
    });
  }

  const user = lowerId.includes('@') ? findUserByEmail(lowerId) : findUserByPhone(identifier);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Имэйл/дугаар эсвэл нууц үг буруу.' }, { status: 401 });
  }

  if (kind === 'staff' && user.kind !== 'staff') {
    return NextResponse.json({ error: 'Энэ хэсэг зөвхөн ажилтанд зориулагдсан.' }, { status: 403 });
  }

  // Mark verified and create session
  user.verified = true;
  await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({
    ok: true,
    user: toPublicUser(user),
    redirect: user.role === 'manager' || user.role === 'operator' ? '/ad' : homeForRole(user.role),
  });
}
