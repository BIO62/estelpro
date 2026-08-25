import { NextResponse } from 'next/server';
import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { createAppUser, findAppUserByEmail } from '@/lib/users/repo';
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
  if (await findAppUserByEmail(email)) return NextResponse.json({ error: 'Энэ имэйл бүртгэлтэй.' }, { status: 409 });
  const temp = `Estel${Math.floor(1000 + Math.random() * 9000)}`;
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(temp);
  const user = await createAppUser({
    id,
    email,
    name,
    kind: 'staff',
    role,
    passwordHash,
    status: 'active',
    emailVerified: true,
  });
  if (!user) return NextResponse.json({ error: 'Бүртгэлийн сан холбогдсонгүй.' }, { status: 503 });
  await writeAudit({
    actorId: me.id,
    actorEmail: me.email,
    actorRole: me.role,
    action: 'staff_invite',
    entityType: 'app_user',
    entityId: id,
    summary: `${me.name} ажилтан бүртгэсэн: ${name} (${email}) · ${role}`,
  });
  return NextResponse.json({ ok: true, user, tempPassword: temp });
}
