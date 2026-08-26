import { NextResponse } from 'next/server';

import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import {
  deleteAppUser,
  findAppUserById,
  listAppUsers,
  updateAppUser,
  type AppUserStatus,
} from '@/lib/users/repo';
import { canDeleteUsers, isStaffRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!session || !isStaffRole(session.role)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get('status') || 'ALL') as AppUserStatus | 'ALL';
  const q = searchParams.get('q') || undefined;
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(100, Number(searchParams.get('limit') || '40'));
  const offset = (page - 1) * limit;

  try {
    const { items, total } = await listAppUsers({
      kind: 'consumer',
      status,
      q,
      limit,
      offset,
    });
    return NextResponse.json({ users: items, total, page, limit });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Алдаа';
    return NextResponse.json(
      {
        error:
          /schema cache|does not exist|Could not find/i.test(msg)
            ? 'app_users table алга. supabase/users.sql ажиллуулна уу.'
            : msg,
        users: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session || !isStaffRole(session.role)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  }

  const body = (await req.json()) as {
    id?: string;
    name?: string;
    lastName?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
    notes?: string | null;
    status?: AppUserStatus;
  };

  if (!body.id) return NextResponse.json({ error: 'id шаардлагатай.' }, { status: 400 });

  try {
    const updated = await updateAppUser(body.id, {
      name: body.name,
      lastName: body.lastName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      district: body.district,
      notes: body.notes,
      status: body.status,
    });
    if (!updated) return NextResponse.json({ error: 'Олдсонгүй.' }, { status: 404 });

    await writeAudit({
      actorId: session.id,
      actorEmail: session.email,
      actorRole: session.role,
      action: body.status ? `user_${body.status}` : 'user_update',
      entityType: 'app_user',
      entityId: body.id,
      summary: `${session.name || session.email} хэрэглэгч зассан: ${updated.email}${
        body.status ? ` → ${body.status}` : ''
      }`,
      meta: body,
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Алдаа' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session || !canDeleteUsers(session.role)) {
    return NextResponse.json({ error: 'Зөвхөн захирал хэрэглэгч устгана.' }, { status: 403 });
  }
  const body = (await req.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'id шаардлагатай.' }, { status: 400 });
  const target = await findAppUserById(body.id);
  if (!target || target.kind !== 'consumer') {
    return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй.' }, { status: 404 });
  }
  await deleteAppUser(target.id, 'consumer');
  await writeAudit({
    actorId: session.id,
    actorEmail: session.email,
    actorRole: session.role,
    action: 'user_delete',
    entityType: 'app_user',
    entityId: target.id,
    summary: `${session.name} хэрэглэгч устгасан: ${target.email}`,
  });
  return NextResponse.json({ ok: true });
}
