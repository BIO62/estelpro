import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findSalonByCode, saveSalonOtp } from '@/lib/salons/repo';
import { maskEmail, sendOtpEmail } from '@/lib/auth/mail';
import {
  readPendingRegistration,
  setPendingRegistration,
} from '@/lib/auth/pending-registration';

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
    let salon;
    try {
      salon = await findSalonByCode(salonCode);
    } catch (error) {
      console.error('otp salon db', error instanceof Error ? error.message : error);
      return NextResponse.json({ error: 'Өгөгдлийн санд холбогдож чадсангүй.' }, { status: 503 });
    }
    if (!salon) return NextResponse.json({ error: 'Салоны код олдсонгүй.' }, { status: 404 });
    const code = String(randomInt(100000, 999999));
    await saveSalonOtp(salon, code, 'email');
    try {
      await sendOtpEmail(salon.email, code);
    } catch (error) {
      console.error('otp email', error instanceof Error ? error.message : error);
      return NextResponse.json(
        { error: 'OTP илгээх удааширлаа эсвэл имэйл сервер ажиллахгүй байна.' },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      emailHint: maskEmail(salon.email),
      phoneHint: salon.phone ? maskPhone(salon.phone) : null,
      channel: 'email',
      salonName: salon.salonName,
    });
  }

  const email = body.email?.trim().toLowerCase() || '';
  const pending = await readPendingRegistration(email);
  if (!pending) {
    return NextResponse.json(
      { error: 'Бүртгэлийн хүсэлт олдсонгүй эсвэл хугацаа дууссан.' },
      { status: 404 },
    );
  }
  const code = String(randomInt(100000, 1000000));
  try {
    await sendOtpEmail(email, code);
  } catch (error) {
    console.error('otp email', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'OTP илгээх удааширлаа эсвэл имэйл сервер ажиллахгүй байна.' },
      { status: 502 },
    );
  }
  await setPendingRegistration(pending, code);
  return NextResponse.json({ ok: true, emailHint: maskEmail(email), channel: 'email' });
}
