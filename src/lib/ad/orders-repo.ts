import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';
import {
  formatOrderDate,
  paymentFromStatus,
  syncOrderPayment,
  type AdOrder,
  type AdOrderTimeline,
  type OrderStatus,
} from '@/lib/ad/orders';

type OrderRow = {
  id: string;
  customer_name: string;
  last_name: string | null;
  first_name: string | null;
  email: string | null;
  phone: string;
  extra_phone: string | null;
  source: AdOrder['source'];
  payment_method: string;
  manager: string | null;
  address: string | null;
  delivery_fee: number | string | null;
  delivery_type: string | null;
  vat_type: string | null;
  invoice_id: string | null;
  total: number | string;
  payment_status: AdOrder['paymentStatus'];
  status: OrderStatus;
  date: string;
  note: string | null;
  items: AdOrder['items'];
  payments: AdOrder['payments'];
  timeline: AdOrder['timeline'];
  deleted_at: string | null;
};

function db() {
  const client = supabaseAdmin();
  if (!client || !isSupabaseConfigured()) throw new Error('Supabase тохируулаагүй.');
  return client;
}

function fromRow(row: OrderRow): AdOrder {
  return syncOrderPayment({
    id: row.id,
    customerName: row.customer_name || '',
    lastName: row.last_name || undefined,
    firstName: row.first_name || undefined,
    email: row.email || undefined,
    phone: row.phone || '',
    extraPhone: row.extra_phone || undefined,
    source: row.source || 'manual',
    paymentMethod: row.payment_method || '',
    manager: row.manager || undefined,
    address: row.address || undefined,
    deliveryFee: Number(row.delivery_fee) || 0,
    deliveryType: row.delivery_type || undefined,
    vatType: row.vat_type || undefined,
    invoiceId: row.invoice_id || undefined,
    total: Number(row.total) || 0,
    paymentStatus: row.payment_status,
    status: row.status,
    date: row.date,
    note: row.note || undefined,
    items: Array.isArray(row.items) ? row.items : [],
    payments: Array.isArray(row.payments) ? row.payments : [],
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    deletedAt: row.deleted_at,
  });
}

function toRow(order: AdOrder): Omit<OrderRow, 'delivery_fee' | 'total'> & { delivery_fee: number; total: number } {
  const synced = syncOrderPayment(order);
  return {
    id: synced.id,
    customer_name: synced.customerName,
    last_name: synced.lastName || null,
    first_name: synced.firstName || null,
    email: synced.email || null,
    phone: synced.phone,
    extra_phone: synced.extraPhone || null,
    source: synced.source,
    payment_method: synced.paymentMethod,
    manager: synced.manager || null,
    address: synced.address || null,
    delivery_fee: synced.deliveryFee || 0,
    delivery_type: synced.deliveryType || null,
    vat_type: synced.vatType || null,
    invoice_id: synced.invoiceId || null,
    total: synced.total,
    payment_status: synced.paymentStatus,
    status: synced.status,
    date: synced.date,
    note: synced.note || null,
    items: synced.items || [],
    payments: synced.payments || [],
    timeline: synced.timeline || [],
    deleted_at: synced.deletedAt ?? null,
  };
}

export async function listOrders(): Promise<AdOrder[]> {
  const { data, error } = await db().from('orders').select('*').order('date', { ascending: false }).limit(3000);
  if (error) throw new Error(error.message);
  return (data as OrderRow[]).map(fromRow);
}

export async function getOrder(id: string): Promise<AdOrder | null> {
  const { data, error } = await db().from('orders').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as OrderRow) : null;
}

export async function getOrderByInvoice(invoiceId: string): Promise<AdOrder | null> {
  const { data, error } = await db().from('orders').select('*').eq('invoice_id', invoiceId).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return fromRow(data as OrderRow);
  return getOrder(invoiceId);
}

export async function nextOrderId(): Promise<string> {
  const { data, error } = await db().rpc('next_order_id');
  if (error) throw new Error(error.message);
  return String(data);
}

export async function upsertOrder(order: AdOrder): Promise<AdOrder> {
  const payload = { ...toRow(order), updated_at: new Date().toISOString() };
  const { data, error } = await db().from('orders').upsert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return fromRow(data as OrderRow);
}

export async function createOrder(input: Omit<AdOrder, 'id'> & { id?: string }): Promise<AdOrder> {
    const id = input.id?.trim() ? input.id.trim() : await nextOrderId();
  return upsertOrder({ ...input, id, invoiceId: input.invoiceId || id });
}

export async function patchOrder(id: string, patch: Partial<AdOrder>): Promise<AdOrder | null> {
  const current = await getOrder(id);
  if (!current) return null;
  return upsertOrder({ ...current, ...patch, id });
}

export async function applyOrderStatus(id: string, status: OrderStatus): Promise<AdOrder | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const paymentStatus = paymentFromStatus(status);
  const patch: Partial<AdOrder> = { status, paymentStatus };
  if (paymentStatus === 'paid') {
    const hasPay = (order.payments ?? []).some((p) => p.amount > 0);
    if (!hasPay) {
      patch.payments = [
        {
          id: `p-${id}`,
          method: order.paymentMethod || 'Дансаар шилжүүлэх',
          date: formatOrderDate(),
          amount: order.total,
        },
      ];
    }
  } else if (paymentStatus === 'unpaid') {
    patch.payments = [];
  }
  return patchOrder(id, patch);
}

export async function appendTimeline(
  id: string,
  text: string,
  actor: string,
  extra?: { image?: string; onSheet?: boolean; kind?: AdOrderTimeline['kind']; ip?: string },
): Promise<AdOrder | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const date = formatOrderDate();
  const shortName = actor.trim().split(/\s+/)[0] || actor;
  const ip = extra?.ip || 'local';
  const entry: AdOrderTimeline = {
    text,
    meta: `${shortName} / ${ip} / ${date}`,
    kind: extra?.kind || 'system',
    image: extra?.image,
    onSheet: extra?.onSheet,
  };
  const patch: Partial<AdOrder> = {
    timeline: [entry, ...(order.timeline ?? [])],
  };
  if (extra?.onSheet && extra.kind === 'note' && text.trim()) {
    patch.note = [order.note, text.trim()].filter(Boolean).join('\n');
  }
  return patchOrder(id, patch);
}

export async function importOrders(orders: AdOrder[]): Promise<number> {
  let count = 0;
  for (const order of orders) {
    if (!order?.id) continue;
    await upsertOrder(syncOrderPayment(order));
    count += 1;
  }
  return count;
}
