import { NextResponse } from 'next/server';

import { writeAudit } from '@/lib/audit/log';
import { findUserByEmail, saveUser } from '@/lib/auth/store';
import { getSessionUser } from '@/lib/auth/session';
import { updateSalon } from '@/lib/salons/repo';
import { updateAppUser } from '@/lib/users/repo';

export const dynamic = 'force-dynamic';

function staffOnly(session: Awaited<ReturnType<typeof getSessionUser>>) {
  return session && (session.role === 'manager' || session.role === 'operator');
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!staffOnly(session)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  }

  const body = (await req.json()) as {
    type?: 'salon' | 'consumer';
    id?: string;
    salonName?: string;
    contactName?: string;
    name?: string;
    lastName?: string | null;
    phone?: string | null;
    email?: string | null;
    city?: string | null;
    district?: string | null;
    address?: string | null;
    notes?: string | null;
  };

  if (!body.id || !body.type) {
    return NextResponse.json({ error: 'type, id шаардлагатай.' }, { status: 400 });
  }

  try {
    if (body.type === 'salon') {
      const salon = await updateSalon(body.id, {
        salonName: body.salonName,
        contactName: body.contactName,
        phone: body.phone || undefined,
        email: body.email || undefined,
        city: body.city || undefined,
        district: body.district,
        address: body.address || undefined,
      });
      await writeAudit({
        actorId: session!.id,
        actorEmail: session!.email,
        actorRole: session!.role,
        action: 'salon_update',
        entityType: 'salon',
        entityId: body.id,
        summary: `${session!.name} салон зассан: ${salon.salonCode}`,
      });
      return NextResponse.json({ ok: true, salon });
    }

    const updated = await updateAppUser(body.id, {
      name: body.name,
      lastName: body.lastName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      district: body.district,
      notes: body.notes,
    });
    if (!updated) return NextResponse.json({ error: 'Олдсонгүй.' }, { status: 404 });

    const local = findUserByEmail(updated.email);
    if (local) {
      if (body.name !== undefined) local.name = body.name;
      if (body.lastName !== undefined) local.lastName = body.lastName || undefined;
      if (body.phone !== undefined) local.phone = body.phone || undefined;
      if (body.address !== undefined) local.address = body.address || undefined;
      if (body.city !== undefined) local.city = body.city || undefined;
      if (body.district !== undefined) local.district = body.district || undefined;
      saveUser(local);
    }

    await writeAudit({
      actorId: session!.id,
      actorEmail: session!.email,
      actorRole: session!.role,
      action: 'user_update',
      entityType: 'app_user',
      entityId: body.id,
      summary: `${session!.name} хэрэглэгч зассан: ${updated.email}`,
    });
    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Алдаа' }, { status: 500 });
  }
}
