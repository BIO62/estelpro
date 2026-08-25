import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findSalonByCode, saveSalonOtp } from '@/lib/salons/repo';
import { maskEmail, sendOtpEmail } from '@/lib/auth/mail';

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return `+976 ••••${digits.slice(-4)}`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; salonCode?: string; purpose?: string };
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

  return NextResponse.json(
    { error: 'Хэрэглэгчийн имэйл OTP энэ урсгалд ашиглагдахгүй.' },
    { status: 410 },
  );
}
