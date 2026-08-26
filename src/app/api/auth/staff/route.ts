import { NextResponse } from 'next/server';
import { writeAudit } from '@/lib/audit/log';
import { getSessionUser, clearSession } from '@/lib/auth/session';
import { deleteAppUser, findAppUserById, listAppUsers, updateAppUser } from '@/lib/users/repo';
import { canDeleteStaffTarget, canManageStaff, resolveStaffRole } from '@/lib/auth/roles';

export async function GET() {
  const me = await getSessionUser();
  if (!me || !canManageStaff(me.role)) {
    return NextResponse.json({ error: 'Зөвхөн захирал.' }, { status: 403 });
  }
  const { items } = await listAppUsers({ kind: 'staff', limit: 100 });
  return NextResponse.json({
    users: items.map(({ passwordHash: _passwordHash, ...user }) => ({
      ...user,
      role: resolveStaffRole(user.email, user.role),
    })),
  });
}

export async function PATCH(request: Request) {
  const me = await getSessionUser();
  if (!me || !canManageStaff(me.role)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  }
  const body = (await request.json()) as { id?: string; position?: string };
  const id = body.id || me.id;
  if (id !== me.id && me.role !== 'owner') {
    return NextResponse.json({ error: 'Зөвхөн өөрийн албан тушаалыг засна.' }, { status: 403 });
  }
  const position = (body.position || '').trim() || null;
  const updated = await updateAppUser(id, { position });
  if (!updated) return NextResponse.json({ error: 'Хадгалж чадсангүй.' }, { status: 503 });
  return NextResponse.json({ ok: true, user: { ...updated, passwordHash: undefined } });
}

export async function DELETE(request: Request) {
  const me = await getSessionUser();
  if (!me || !canManageStaff(me.role)) {
    return NextResponse.json({ error: 'Зөвхөн захирал ажилтан устгана.' }, { status: 403 });
  }
  const body = (await request.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Ажилтны ID шаардлагатай.' }, { status: 400 });

  const target = await findAppUserById(body.id);
  if (!target || target.kind !== 'staff') {
    return NextResponse.json({ error: 'Ажилтан олдсонгүй.' }, { status: 404 });
  }
  const { items } = await listAppUsers({ kind: 'staff', limit: 200 });
  const ownerCount = items.filter((user) => resolveStaffRole(user.email, user.role) === 'owner').length;
  const targetRole = resolveStaffRole(target.email, target.role);
  if (!canDeleteStaffTarget(me, { id: target.id, role: targetRole }, ownerCount)) {
    if (body.id === me.id && me.role === 'owner' && ownerCount <= 1) {
      return NextResponse.json({ error: 'Сүүлчийн ерөнхий захирлыг устгах боломжгүй.' }, { status: 400 });
    }
    if (targetRole === 'director' || targetRole === 'owner') {
      return NextResponse.json({ error: 'Захирлын бүртгэлийг зөвхөн ерөнхий захирал устгана.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Устгах эрхгүй.' }, { status: 403 });
  }
  await deleteAppUser(target.id, 'staff');
  await writeAudit({
    actorId: me.id,
    actorEmail: me.email,
    actorRole: me.role,
    action: 'staff_delete',
    entityType: 'app_user',
    entityId: target.id,
    summary: `${me.name} ажилтан устгасан: ${target.name} (${target.email})`,
  });
  if (target.id === me.id) await clearSession();
  return NextResponse.json({ ok: true, self: target.id === me.id });
}
