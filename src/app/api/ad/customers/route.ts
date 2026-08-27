import { NextResponse } from 'next/server';

import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { listSalons, updateSalon } from '@/lib/salons/repo';
import { listAppUsers, updateAppUser } from '@/lib/users/repo';
import { isStaffRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

function staffOnly(session: Awaited<ReturnType<typeof getSessionUser>>) {
  return session && isStaffRole(session.role);
}

export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!staffOnly(session)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const kind = searchParams.get('kind') || 'salon';

  try {
    const salonsRes = await listSalons({ search: q, limit: q ? 25 : 12 });
    const salons = (salonsRes.salons || []).map((s) => ({
      id: `salon-${s.id}`,
      rawId: s.id,
      type: 'salon' as const,
      code: s.salonCode,
      name: s.salonName,
      contactName: s.contactName,
      salonName: s.salonName,
      company: s.salonName,
      phone: s.phone || '',
      email: s.email || '',
      city: s.city || '',
      district: s.district || '',
      address: s.address || '',
      discountPercent: s.discountPercent ?? 15,
      discountTier: s.discountTier,
    }));

    if (kind !== 'all') {
      return NextResponse.json({ customers: salons, total: salonsRes.total || 0 });
    }

    const usersRes = await listAppUsers({ q, limit: q ? 25 : 12, kind: 'consumer' });
    const consumers = (usersRes.items || []).map((u) => ({
      id: `user-${u.id}`,
      rawId: u.id,
      type: 'consumer' as const,
      code: '',
      name: `${u.lastName ? u.lastName + ' ' : ''}${u.name}`.trim(),
      firstname: u.name,
      lastname: u.lastName || '',
      company: '',
      phone: u.phone || '',
      email: u.email || '',
      city: u.city || '',
      district: u.district || '',
      address: u.address || '',
      discountPercent: 0,
    }));

    return NextResponse.json({
      customers: [...salons, ...consumers],
      total: (salonsRes.total || 0) + (usersRes.total || 0),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Алдаа';
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    discountTier?: string;
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
        discountTier: body.discountTier,
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
