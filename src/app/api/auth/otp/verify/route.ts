import { NextResponse } from 'next/server';
import { findSalonByCode, takeSalonOtp } from '@/lib/salons/repo';
import { createSession, homeForRole } from '@/lib/auth/session';
import { writeAudit } from '@/lib/audit/log';
import {
  createAppUser,
  deleteUnverifiedAppUser,
  findAppUserByEmail,
} from '@/lib/users/repo';
import {
  clearPendingRegistration,
  verifyPendingRegistration,
} from '@/lib/auth/pending-registration';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    salonCode?: string;
    code?: string;
    purpose?: 'register' | 'login';
  };
  const code = body.code?.trim() || '';
  const salonCode = body.salonCode?.trim();

  if (!code) return NextResponse.json({ error: 'Код оруулна уу.' }, { status: 400 });

  if (salonCode) {
    const salon = await findSalonByCode(salonCode);
    if (!salon) return NextResponse.json({ error: 'Салоны код олдсонгүй.' }, { status: 404 });
    if (!(await takeSalonOtp(salon, code))) {
      return NextResponse.json({ error: 'OTP буруу эсвэл хугацаа дууссан.' }, { status: 400 });
    }
    await createSession({ id: salon.id, email: salon.email, role: 'salon' });
    await writeAudit({
      actorId: salon.id,
      actorEmail: salon.email,
      actorRole: 'salon',
      action: 'login_otp',
      entityType: 'salon',
      entityId: salon.id,
      summary: `Салон OTP-аар нэвтэрсэн: ${salon.salonName}`,
    });
    return NextResponse.json({ ok: true, redirect: homeForRole('salon') });
  }

  const email = body.email?.trim().toLowerCase() || '';
  const pending = await verifyPendingRegistration(email, code);
  if (!pending) {
    return NextResponse.json(
      { error: 'OTP буруу эсвэл 5 минутын хугацаа дууссан.' },
      { status: 400 },
    );
  }

  const existing = await findAppUserByEmail(email);
  if (existing?.emailVerified && existing.status === 'active') {
    await clearPendingRegistration();
    return NextResponse.json(
      { error: 'Энэ имэйл аль хэдийн бүртгэлтэй.' },
      { status: 409 },
    );
  }
  if (existing) await deleteUnverifiedAppUser(email);

  const user = await createAppUser({
    id: pending.id,
    email: pending.email,
    name: pending.name,
    lastName: pending.lastName,
    phone: pending.phone,
    passwordHash: pending.passwordHash,
    kind: 'consumer',
    role: 'consumer',
    status: 'active',
    emailVerified: true,
  });
  if (!user) {
    return NextResponse.json({ error: 'Бүртгэлийн сан холбогдсонгүй.' }, { status: 503 });
  }

  await clearPendingRegistration();
  await createSession({ id: user.id, email: user.email, role: user.role });
  await writeAudit({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'register_verified',
    entityType: 'app_user',
    entityId: user.id,
    summary: `OTP баталгаажуулж бүртгэл үүсгэсэн: ${user.email}`,
  });
  return NextResponse.json({ ok: true, redirect: homeForRole(user.role) });
}
