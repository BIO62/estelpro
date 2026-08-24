import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { findUserByEmail, saveUser, toPublicUser } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';
import type { StaffRole } from '@/lib/auth/types';

export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер ажилтан бүртгэнэ.' }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string; name?: string; role?: StaffRole };
  const email = body.email?.trim().toLowerCase() || '';
  const name = body.name?.trim() || 'Ажилтан';
  const role: StaffRole = body.role === 'operator' ? 'operator' : 'manager';
  if (!email) return NextResponse.json({ error: 'Имэйл шаардлагатай.' }, { status: 400 });
  if (findUserByEmail(email)) return NextResponse.json({ error: 'Энэ имэйл бүртгэлтэй.' }, { status: 409 });
  const temp = `Estel${Math.floor(1000 + Math.random() * 9000)}`;
  const user = saveUser({
    id: crypto.randomUUID(),
    email,
    name,
    kind: 'staff',
    role,
    passwordHash: hashPassword(temp),
    verified: true,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, user: toPublicUser(user), tempPassword: temp });
}
