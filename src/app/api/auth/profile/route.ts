import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth/session';
import { findUserByEmail, saveUser } from '@/lib/auth/store';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { findAppUserByEmail, updateAppUser } from '@/lib/users/repo';

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== 'consumer') {
    return NextResponse.json({ error: 'Нэвтэрнэ үү.' }, { status: 401 });
  }

  const local = findUserByEmail(session.email);
  let appUser = null;
  try {
    appUser = await findAppUserByEmail(session.email);
  } catch {
    /* optional */
  }

  return NextResponse.json({
    user: {
      id: session.id,
      email: session.email,
      name: appUser?.name || local?.name || session.name,
      lastName: appUser?.lastName || local?.lastName || '',
      phone: appUser?.phone || local?.phone || session.phone || '',
      address: appUser?.address || local?.address || '',
      city: appUser?.city || local?.city || '',
      district: appUser?.district || local?.district || '',
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== 'consumer') {
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

  const local = findUserByEmail(session.email);
  if (!local) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });

  if (body.newPassword) {
    if (!body.currentPassword || !verifyPassword(body.currentPassword, local.passwordHash)) {
      return NextResponse.json({ error: 'Одоогийн нууц үг буруу.' }, { status: 400 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'Шинэ нууц үг 8+ тэмдэгт.' }, { status: 400 });
    }
    local.passwordHash = hashPassword(body.newPassword);
  }

  if (body.name !== undefined) local.name = body.name.trim();
  if (body.lastName !== undefined) local.lastName = body.lastName.trim();
  if (body.phone !== undefined) local.phone = body.phone.trim();
  if (body.address !== undefined) local.address = body.address.trim();
  if (body.city !== undefined) local.city = body.city.trim();
  if (body.district !== undefined) local.district = body.district.trim();
  saveUser(local);

  try {
    const appUser = await findAppUserByEmail(session.email);
    if (appUser) {
      await updateAppUser(appUser.id, {
        name: local.name,
        lastName: local.lastName || null,
        phone: local.phone || null,
        address: local.address || null,
        city: local.city || null,
        district: local.district || null,
      });
    }
  } catch {
    /* optional */
  }

  return NextResponse.json({ ok: true });
}
