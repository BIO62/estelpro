import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth/session';
import { isStaffRole } from '@/lib/auth/roles';
import { formatOrderDate, type AdOrder, type AdOrderTimeline, type OrderStatus } from '@/lib/ad/orders';
import { appendTimeline, applyOrderStatus, getOrder, getOrderByInvoice, patchOrder } from '@/lib/ad/orders-repo';

export const dynamic = 'force-dynamic';

async function staffOk() {
  const session = await getSessionUser();
  return session && isStaffRole(session.role);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await staffOk())) return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  const { id } = await params;
  const invoice = new URL(req.url).searchParams.get('invoice') === '1';
  try {
    const order = invoice ? await getOrderByInvoice(id) : await getOrder(id);
    if (!order) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Алдаа' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await staffOk())) return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 403 });
  const { id } = await params;
  try {
    const body = (await req.json()) as {
      patch?: Partial<AdOrder>;
      status?: OrderStatus;
      trash?: boolean;
      restore?: boolean;
      timeline?: {
        text: string;
        actor: string;
        extra?: { image?: string; onSheet?: boolean; kind?: AdOrderTimeline['kind']; ip?: string };
      };
    };
    let order = await getOrder(id);
    if (!order) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 });

    if (body.trash) {
      order = await patchOrder(id, { deletedAt: formatOrderDate() });
    } else if (body.restore) {
      order = await patchOrder(id, { deletedAt: null });
    } else if (body.status) {
      order = await applyOrderStatus(id, body.status);
    } else if (body.patch) {
      order = await patchOrder(id, body.patch);
    }

    if (body.timeline?.text) {
      order = await appendTimeline(id, body.timeline.text, body.timeline.actor, body.timeline.extra);
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Алдаа' }, { status: 500 });
  }
}
