import { NextResponse } from 'next/server';
import { findUserByEmail, saveUser, takeOtp } from '@/lib/auth/store';
import { findSalonByCode, takeSalonOtp } from '@/lib/salons/repo';
import { createSession, homeForRole } from '@/lib/auth/session';
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
    return NextResponse.json({ ok: true, redirect: homeForRole('salon') });
  }

  const user = findUserByEmail(body.email?.trim().toLowerCase() || '');
  if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });
  if (!takeOtp(user.email, purpose, code)) {
    return NextResponse.json({ error: 'OTP буруу эсвэл хугацаа дууссан.' }, { status: 400 });
  }
  user.verified = true;
  saveUser(user);
  await createSession(user);
  return NextResponse.json({ ok: true, redirect: homeForRole(user.role) });
}
