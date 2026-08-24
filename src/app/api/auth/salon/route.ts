import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSessionUser } from '@/lib/auth/session';
import { findUserByEmail, findUserBySalonCode, listUsers, normalizeSalonCode, saveUser, toPublicUser } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';

export async function GET() {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер.' }, { status: 403 });
  }
  const salons = listUsers()
    .filter((user) => user.kind === 'salon')
    .map(toPublicUser);
  return NextResponse.json({ users: salons });
}

export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер салоны код үүсгэнэ.' }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string; name?: string; salonName?: string; salonCode?: string };
  const email = body.email?.trim().toLowerCase() || '';
  const name = body.name?.trim() || 'Салон';
  const salonName = body.salonName?.trim() || name;
  const salonCode = normalizeSalonCode(body.salonCode || '');
  if (!email || !salonCode) {
    return NextResponse.json({ error: 'Имэйл болон хэрэглэгчийн код шаардлагатай.' }, { status: 400 });
  }
  if (findUserByEmail(email) || findUserBySalonCode(salonCode)) {
    return NextResponse.json({ error: 'Имэйл эсвэл код бүртгэлтэй.' }, { status: 409 });
  }
  const user = saveUser({
    id: crypto.randomUUID(),
    email,
    name,
    salonName,
    salonCode,
    kind: 'salon',
    role: 'salon',
    passwordHash: hashPassword(randomBytes(12).toString('hex')),
    verified: true,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, user: toPublicUser(user) });
}
