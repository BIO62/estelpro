import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth/session';
import { isStaffRole } from '@/lib/auth/roles';
import { createOrder, importOrders, listOrders } from '@/lib/ad/orders-repo';
import type { AdOrder } from '@/lib/ad/orders';

export const dynamic = 'force-dynamic';

async function staff() {
  const session = await getSessionUser();
  return session && isStaffRole(session.role) ? session : null;
}

export async function GET() {
  if (!(await staff())) return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Алдаа' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await staff())) return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  try {
    const body = (await req.json()) as { order?: AdOrder; orders?: AdOrder[] };
    if (Array.isArray(body.orders)) {
      const count = await importOrders(body.orders);
      return NextResponse.json({ imported: count });
    }
    if (!body.order) return NextResponse.json({ error: 'Захиалга дутуу.' }, { status: 400 });
    const order = await createOrder(body.order as AdOrder);
    return NextResponse.json({ order });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Алдаа' }, { status: 500 });
  }
}
