import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findUserByEmail, saveOtp } from '@/lib/auth/store';
import { findSalonByCode, saveSalonOtp } from '@/lib/salons/repo';
import { maskEmail, sendOtpEmail } from '@/lib/auth/mail';
import type { OtpRecord } from '@/lib/auth/types';

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return `+976 ••••${digits.slice(-4)}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; salonCode?: string; purpose?: OtpRecord['purpose'] };
  const purpose: OtpRecord['purpose'] = body.purpose === 'login' ? 'login' : 'register';
  const salonCode = body.salonCode?.trim();

  // Salon channel: the code is the identity. SMS Pro is not live yet, so the
  // OTP goes to the salon's email while the phone is only shown as a hint.
  if (salonCode) {
    const salon = await findSalonByCode(salonCode);
    if (!salon) return NextResponse.json({ error: 'Салоны код олдсонгүй.' }, { status: 404 });
    const code = String(randomInt(100000, 999999));
    await saveSalonOtp(salon, code, 'email');
    await sendOtpEmail(salon.email, code);
    return NextResponse.json({
      ok: true,
      emailHint: maskEmail(salon.email),
      phoneHint: salon.phone ? maskPhone(salon.phone) : null,
      channel: 'email',
      salonName: salon.salonName,
    });
  }

  const user = findUserByEmail(body.email?.trim().toLowerCase() || '');
  if (!user) {
    return NextResponse.json({ error: 'Бүртгэл олдсонгүй.' }, { status: 404 });
  }
  if (purpose === 'register' && user.verified) {
    return NextResponse.json({ error: 'OTP илгээх боломжгүй.' }, { status: 400 });
  }

  const code = String(randomInt(100000, 999999));
  saveOtp({ email: user.email, code, purpose, expiresAt: Date.now() + 10 * 60 * 1000 });
  await sendOtpEmail(user.email, code);
  return NextResponse.json({ ok: true, emailHint: maskEmail(user.email), channel: 'email' });
}
