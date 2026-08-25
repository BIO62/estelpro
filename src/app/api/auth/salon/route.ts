import { NextResponse } from 'next/server';

import { writeAudit } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { createSalon, listSalons } from '@/lib/salons/repo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(100, Number(searchParams.get('limit') || '50'));
  const offset = (page - 1) * limit;

  try {
    const { salons, total } = await listSalons({ limit, offset, search });
    return NextResponse.json({ salons, users: salons, total, page, limit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Алдаа';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер салон код үүсгэнэ.' }, { status: 403 });
  }

  const body = (await request.json()) as {
    email?: string;
    name?: string;
    salonName?: string;
    salonCode?: string;
    phone?: string;
    city?: string;
    district?: string;
    address?: string;
  };

  const salonCode = body.salonCode?.trim() || '';
  const salonName = body.salonName?.trim() || '';
  const contactName = body.name?.trim() || '';
  const email = body.email?.trim().toLowerCase() || '';

  if (!salonCode) return NextResponse.json({ error: 'Салоны код шаардлагатай.' }, { status: 400 });
  if (!salonName) return NextResponse.json({ error: 'Салоны нэр шаардлагатай.' }, { status: 400 });
  if (!contactName) return NextResponse.json({ error: 'Холбоо барих нэр шаардлагатай.' }, { status: 400 });
  if (!email) return NextResponse.json({ error: 'Имэйл шаардлагатай.' }, { status: 400 });

  try {
    const salon = await createSalon({
      salonCode,
      salonName,
      contactName,
      email,
      phone: body.phone,
      city: body.city,
      district: body.district,
      address: body.address,
    });
    await writeAudit({
      actorId: me.id,
      actorEmail: me.email,
      actorRole: me.role,
      action: 'salon_create',
      entityType: 'salon',
      entityId: salon.id,
      summary: `${me.name} салон код үүсгэсэн: ${salon.salonCode} · ${salon.salonName}`,
    });
    return NextResponse.json({
      ok: true,
      salon,
      user: {
        id: salon.id,
        email: salon.email,
        name: salon.contactName,
        salonName: salon.salonName,
        salonCode: salon.salonCode,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Алдаа';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
