import { NextResponse } from 'next/server';
import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { findUserByEmail, saveUser, toPublicUser } from '@/lib/auth/store';
import { hashPassword } from '@/lib/auth/password';
import { createAppUser } from '@/lib/users/repo';
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
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(temp);
  const user = saveUser({
    id,
    email,
    name,
    kind: 'staff',
    role,
    passwordHash,
    verified: true,
    createdAt: new Date().toISOString(),
  });
  try {
    await createAppUser({
      id,
      email,
      name,
      passwordHash,
      kind: 'staff',
      role,
      status: 'active',
      emailVerified: true,
    });
  } catch {
    /* table optional until SQL run */
  }
  await writeAudit({
    actorId: me.id,
    actorEmail: me.email,
    actorRole: me.role,
    action: 'staff_invite',
    entityType: 'app_user',
    entityId: id,
    summary: `${me.name} ажилтан бүртгэсэн: ${name} (${email}) · ${role}`,
  });
  return NextResponse.json({ ok: true, user: toPublicUser(user), tempPassword: temp });
}
