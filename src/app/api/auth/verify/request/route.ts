import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findUserByEmail, saveOtp } from '@/lib/auth/store';
import { sendOtpEmail } from '@/lib/auth/mail';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase() || '';
  if (!email) return NextResponse.json({ error: 'Имэйл оруулна уу.' }, { status: 400 });

  const user = findUserByEmail(email);
  if (!user) return NextResponse.json({ error: 'Бүртгэл олдсонгүй.' }, { status: 404 });
  if (user.verified) {
    return NextResponse.json(
      { error: 'Энэ имэйл аль хэдийн баталгаажсан. Нэвтрэх хэсэг рүү орно уу.', alreadyRegistered: true },
      { status: 409 },
    );
  }

  const code = String(randomInt(100000, 999999));
  saveOtp({ email: user.email, code, purpose: 'register', expiresAt: Date.now() + 5 * 60 * 1000 });
  await sendOtpEmail(user.email, code);

  return NextResponse.json({ ok: true });
}
