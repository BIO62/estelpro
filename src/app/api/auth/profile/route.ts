import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth/session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { findAppUserByEmail, updateAppUser } from '@/lib/users/repo';
import { findSalonByEmail, updateSalon } from '@/lib/salons/repo';
import { matchesSalonPhonePassword } from '@/lib/auth/salon-discount';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү.' }, { status: 401 });
  }

  if (session.role === 'salon') {
    const salon = await findSalonByEmail(session.email);
    if (!salon) return NextResponse.json({ error: 'Салон олдсонгүй.' }, { status: 404 });
    return NextResponse.json({
      user: {
        id: salon.id,
        email: salon.email,
        name: salon.salonName,
        phone: salon.phone,
        address: salon.address,
        city: salon.city,
        district: salon.district || '',
        salonCode: salon.salonCode,
        discountPercent: salon.discountPercent,
        kind: 'salon',
        role: 'salon',
      },
    });
  }

  if (session.role !== 'consumer') {
    return NextResponse.json({ error: 'Нэвтэрнэ үү.' }, { status: 401 });
  }

  const appUser = await findAppUserByEmail(session.email);
  if (!appUser) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });

  return NextResponse.json({
    user: {
      id: session.id,
      email: session.email,
      name: appUser.name,
      lastName: appUser.lastName || '',
      phone: appUser.phone || '',
      address: appUser.address || '',
      city: appUser.city || '',
      district: appUser.district || '',
      kind: 'consumer',
      role: 'consumer',
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү.' }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  if (session.role === 'salon') {
    const salon = await findSalonByEmail(session.email);
    if (!salon) return NextResponse.json({ error: 'Салон олдсонгүй.' }, { status: 404 });

    if (body.newPassword) {
      const currentOk = salon.passwordHash
        ? !!body.currentPassword && verifyPassword(body.currentPassword, salon.passwordHash)
        : !!body.currentPassword && matchesSalonPhonePassword(body.currentPassword, salon.phone);
      if (!currentOk) {
        return NextResponse.json({ error: 'Одоогийн нууц үг буруу.' }, { status: 400 });
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json({ error: 'Шинэ нууц үг 6+ тэмдэгт.' }, { status: 400 });
      }
      await updateSalon(salon.id, { passwordHash: hashPassword(body.newPassword) });
    }

    return NextResponse.json({ ok: true });
  }

  if (session.role !== 'consumer') {
    return NextResponse.json({ error: 'Нэвтэрнэ үү.' }, { status: 401 });
  }

  const appUser = await findAppUserByEmail(session.email);
  if (!appUser) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });

  if (body.newPassword) {
    if (!body.currentPassword || !appUser.passwordHash || !verifyPassword(body.currentPassword, appUser.passwordHash)) {
      return NextResponse.json({ error: 'Одоогийн нууц үг буруу.' }, { status: 400 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'Шинэ нууц үг 8+ тэмдэгт.' }, { status: 400 });
    }
  }

  await updateAppUser(appUser.id, {
    name: body.name?.trim() ?? appUser.name,
    lastName: body.lastName !== undefined ? body.lastName.trim() || null : appUser.lastName,
    phone: body.phone !== undefined ? body.phone.trim() || null : appUser.phone,
    address: body.address !== undefined ? body.address.trim() || null : appUser.address,
    city: body.city !== undefined ? body.city.trim() || null : appUser.city,
    district: body.district !== undefined ? body.district.trim() || null : appUser.district,
    passwordHash: body.newPassword ? hashPassword(body.newPassword) : appUser.passwordHash || undefined,
  });

  return NextResponse.json({ ok: true });
}
