import { NextResponse } from 'next/server';
import { findUserByEmail, saveUser, takeOtp } from '@/lib/auth/store';
import { findSalonByCode, takeSalonOtp } from '@/lib/salons/repo';
import { createSession, homeForRole } from '@/lib/auth/session';
import { createAppUser, findAppUserByEmail, updateAppUser } from '@/lib/users/repo';
import { writeAudit } from '@/lib/audit/log';
import type { OtpRecord } from '@/lib/auth/types';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    salonCode?: string;
    code?: string;
    purpose?: OtpRecord['purpose'];
  };
  const purpose: OtpRecord['purpose'] = body.purpose === 'login' ? 'login' : 'register';
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
  const user = findUserByEmail(email);
  if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });
  if (!takeOtp(user.email, purpose, code)) {
    return NextResponse.json({ error: 'OTP буруу эсвэл хугацаа дууссан.' }, { status: 400 });
  }
  user.verified = true;
  saveUser(user);

  try {
    const existingAppUser = await findAppUserByEmail(user.email);
    if (existingAppUser) {
      await updateAppUser(existingAppUser.id, {
        name: user.name,
        lastName: user.lastName || null,
        phone: user.phone || null,
        status: 'active',
        emailVerified: true,
        role: 'consumer',
      });
    } else {
      await createAppUser({
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        passwordHash: user.passwordHash,
        kind: 'consumer',
        role: 'consumer',
        status: 'active',
        emailVerified: true,
      });
    }
    await writeAudit({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: 'register_verified',
      entityType: 'app_user',
      entityId: user.id,
      summary: `OTP баталгаажуулж бүртгэл үүсгэсэн: ${user.email}`,
    });
  } catch (e) {
    console.error('create verified app_user', e);
  }

  await createSession(user);
  return NextResponse.json({ ok: true, redirect: homeForRole(user.role) });
}
