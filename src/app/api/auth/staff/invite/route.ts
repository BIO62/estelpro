import { NextResponse } from 'next/server';
import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { createAppUser, findAppUserByEmail } from '@/lib/users/repo';
import type { StaffRole } from '@/lib/auth/types';
import { canManageStaff, parseInviteRole } from '@/lib/auth/roles';

export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me || !canManageStaff(me.role)) {
    return NextResponse.json({ error: 'Зөвхөн захирал ажилтан бүртгэнэ.' }, { status: 403 });
  }
  const body = (await request.json()) as {
    email?: string;
    name?: string;
    role?: StaffRole;
    position?: string;
    password?: string;
  };
  const email = body.email?.trim().toLowerCase() || '';
  const name = body.name?.trim() || 'Ажилтан';
  const role = parseInviteRole(body.role, me.role);
  const position = body.position?.trim() || '';
  if (!email) return NextResponse.json({ error: 'Имэйл шаардлагатай.' }, { status: 400 });
  if (await findAppUserByEmail(email)) return NextResponse.json({ error: 'Энэ имэйл бүртгэлтэй.' }, { status: 409 });
  const temp = body.password?.trim() || `Estel${Math.floor(1000 + Math.random() * 9000)}`;
  if (temp.length < 6) return NextResponse.json({ error: 'Нууц үг хамгийн багадаа 6 тэмдэгт.' }, { status: 400 });
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(temp);
  const user = await createAppUser({
    id,
    email,
    name,
    kind: 'staff',
    role,
    position,
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
    summary: `${me.name} ажилтан бүртгэсэн: ${name} (${email}) · ${role} · ${position || '-'}`,
  });
  return NextResponse.json({ ok: true, user, tempPassword: temp });
}
