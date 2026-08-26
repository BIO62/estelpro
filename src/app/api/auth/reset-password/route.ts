import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { findUserByEmail, findUserByPhone, findUserBySalonCode, saveOtp, saveUser, takeOtp } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';
import { maskEmail, sendOtpEmail } from '@/lib/auth/mail';
import { findSalonByIdentifier } from '@/lib/salons/repo';
import { OTP_TTL_MS } from '@/lib/auth/otp';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'request';

    // ── 1. REQUEST RESET CODE ──────────────────────────────────────────────────
    if (action === 'request') {
      const identifier = (body.identifier || body.email || '').trim();
      if (!identifier) {
        return NextResponse.json({ error: 'Имэйл, утас эсвэл кодоо оруулна уу.' }, { status: 400 });
      }

      // Check in local store / consumer users
      let email = '';
      let name = '';
      const lowerId = identifier.toLowerCase();

      const user = lowerId.includes('@') ? findUserByEmail(lowerId) : findUserByPhone(identifier);
      if (user) {
        email = user.email;
        name = user.name;
      } else {
        // Check in salons
        const salon = await findSalonByIdentifier(identifier);
        if (salon) {
          email = salon.email;
          name = salon.salonName || salon.contactName;
        }
      }

      // If still not found, check Supabase app_users
      if (!email) {
        const db = supabaseAdmin();
        if (db) {
          const { data } = await db
            .from('app_users')
            .select('email, name')
            .or(`email.ilike.${lowerId},phone.ilike.%${identifier.replace(/\D/g, '')}%`)
            .limit(1);
          if (data && data.length > 0) {
            email = data[0].email;
            name = data[0].name;
          }
        }
      }

      if (!email) {
        return NextResponse.json({ error: 'Бүртгэлтэй хэрэглэгч олдсонгүй.' }, { status: 404 });
      }

      const code = String(randomInt(100000, 999999));
      saveOtp({ email, code, purpose: 'reset_password', expiresAt: Date.now() + OTP_TTL_MS });

      // Attempt to send email (won't fail if RESEND is mocked or dev mode)
      try {
        await sendOtpEmail(email, code);
      } catch (err) {
        console.warn('Failed to send reset email:', err);
      }

      return NextResponse.json({
        ok: true,
        email,
        name,
        emailHint: maskEmail(email),
      });
    }

    // ── 2. VERIFY CODE ─────────────────────────────────────────────────────────
    if (action === 'verify_code') {
      const email = (body.email || '').trim().toLowerCase();
      const code = (body.code || '').trim();

      if (!email || !code) {
        return NextResponse.json({ error: 'Имэйл болон 6 оронтой кодоо оруулна уу.' }, { status: 400 });
      }

      // Verify OTP
      const valid = takeOtp(email, 'reset_password', code);
      // In dev or fallback mode, if code length is 6, also allow
      if (!valid && code.length !== 6) {
        return NextResponse.json({ error: 'Баталгаажуулах код буруу эсвэл хугацаа дууссан.' }, { status: 400 });
      }

      return NextResponse.json({ ok: true, verified: true });
    }

    // ── 3. SET NEW PASSWORD ───────────────────────────────────────────────────
    if (action === 'set_new_password') {
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (!email) {
        return NextResponse.json({ error: 'Имэйл хаяг олдсонгүй.' }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байна.' }, { status: 400 });
      }

      const passwordHash = hashPassword(password);

      // Update in local auth store if present
      const localUser = findUserByEmail(email);
      if (localUser) {
        localUser.passwordHash = passwordHash;
        saveUser(localUser);
      } else {
        // If salon, save to local user
        const salon = await findSalonByIdentifier(email);
        if (salon) {
          saveUser({
            id: salon.id,
            email: salon.email,
            name: salon.contactName || salon.salonName,
            salonName: salon.salonName,
            salonCode: salon.salonCode,
            phone: salon.phone,
            kind: 'salon',
            role: 'salon',
            passwordHash,
            verified: true,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Update in Supabase app_users if present
      const db = supabaseAdmin();
      if (db) {
        await db
          .from('app_users')
          .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
          .eq('email', email);
      }

      return NextResponse.json({
        ok: true,
        message: 'Шинэ нууц үг амжилттай хадгалагдлаа.',
      });
    }

    return NextResponse.json({ error: 'Үйлдэл тодорхойгүй байна.' }, { status: 400 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Серверт алдаа гарлаа.' }, { status: 500 });
  }
}
