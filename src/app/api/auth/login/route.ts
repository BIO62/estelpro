import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByPhone, toPublicUser } from '@/lib/auth/store';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, homeForRole } from '@/lib/auth/session';
import type { AccountKind } from '@/lib/auth/types';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string; kind?: AccountKind };
  const identifier = body.email?.trim().toLowerCase() || '';
  const password = body.password || '';
  const kind = body.kind || 'consumer';
  if (kind === 'salon') {
    return NextResponse.json({ error: 'Салон хэрэглэгчийн кодоор OTP авна.' }, { status: 400 });
  }
  const user = identifier.includes('@') ? findUserByEmail(identifier) : findUserByPhone(identifier);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Имэйл/дугаар эсвэл нууц үг буруу.' }, { status: 401 });
  }
  if (kind === 'staff' && user.kind !== 'staff') {
    return NextResponse.json({ error: 'Энэ хэсэг зөвхөн ажилтанд зориулагдсан.' }, { status: 403 });
  }
  if (kind === 'consumer' && user.role !== 'consumer') {
    return NextResponse.json({ error: 'Хувь хэрэглэгчийн бүртгэл биш байна.' }, { status: 403 });
  }
  if (!user.verified) {
    return NextResponse.json({ error: 'Имэйл OTP баталгаажуулаагүй.', needsOtp: true }, { status: 403 });
  }
  await createSession(user);
  return NextResponse.json({ ok: true, user: toPublicUser(user), redirect: homeForRole(user.role) });
}
