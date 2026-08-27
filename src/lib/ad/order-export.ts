import {
  DEMO_ORDERS,
  ORDER_SOURCE_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  orderPaymentStatus,
  type AdOrder,
  type OrderStatus,
} from '@/lib/ad/orders';

export type ExportFieldKey =
  | 'id'
  | 'created_at'
  | 'member_firstname'
  | 'member_lastname'
  | 'member_email'
  | 'member_phone'
  | 'member_address'
  | 'price'
  | 'delivery_price'
  | 'order_status'
  | 'is_paid'
  | 'payment_id'
  | 'delivery_id'
  | 'currency_title'
  | 'taxonomy_order_data'
  | 'src'
  | 'created_by'
  | 'product_sku'
  | 'product_title'
  | 'product_quantity'
  | 'product_price';

export type ExportFieldDef = {
  key: ExportFieldKey;
  label: string;
  default?: boolean;
  product?: boolean;
};

export const EXPORT_FIELDS: ExportFieldDef[] = [
  { key: 'id', label: 'Захиалгын ID', default: true },
  { key: 'created_at', label: 'Огноо', default: true },
  { key: 'member_firstname', label: 'Нэр', default: true },
  { key: 'member_lastname', label: 'Овог', default: true },
  { key: 'member_email', label: 'Имэйл', default: true },
  { key: 'member_phone', label: 'Утас', default: true },
  { key: 'member_address', label: 'Хаяг' },
  { key: 'price', label: 'Нийт дүн', default: true },
  { key: 'delivery_price', label: 'Хүргэлтийн үнэ' },
  { key: 'order_status', label: 'Төлөв', default: true },
  { key: 'is_paid', label: 'Төлбөр', default: true },
  { key: 'payment_id', label: 'Төлбөрийн төрөл', default: true },
  { key: 'delivery_id', label: 'Хүргэлтийн төрөл' },
  { key: 'currency_title', label: 'Валют' },
  { key: 'taxonomy_order_data', label: 'Нэмэлт мэдээлэл' },
  { key: 'src', label: 'Захиалгын эх сурвалж' },
  { key: 'created_by', label: 'Хэн үүсгэсэн' },
  { key: 'product_sku', label: 'Бүтээгдэхүний SKU', product: true },
  { key: 'product_title', label: 'Бүтээгдэхүний гарчиг', product: true },
  { key: 'product_quantity', label: 'Тоо ширхэг', product: true },
  { key: 'product_price', label: 'Бүтээгдэхүний үнэ', product: true },
];

export const DEFAULT_EXPORT_FIELDS = EXPORT_FIELDS.filter((f) => f.default).map((f) => f.key);
export const PRODUCT_EXPORT_FIELDS = EXPORT_FIELDS.filter((f) => f.product).map((f) => f.key);
export const OTHER_EXPORT_FIELDS = EXPORT_FIELDS.filter((f) => !f.product);

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

export function todayIsoDate() {
  return toIsoDate(new Date());
}

export function daysAgoIsoDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toIsoDate(d);
}

function toIsoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dateRangeTooLong(start: string, end: string) {
  if (!start || !end) return false;
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return b.getTime() - a.getTime() > THREE_MONTHS_MS;
}

function csvCell(value: string | number | undefined | null) {
  const raw = value == null ? '' : String(value);
  if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

function orderDay(order: AdOrder) {
  return order.date.slice(0, 10);
}

function fieldValue(order: AdOrder, key: ExportFieldKey, itemIndex = 0): string | number {
  const item = order.items?.[itemIndex];
  switch (key) {
    case 'id':
      return order.id;
    case 'created_at':
      return order.date;
    case 'member_firstname':
      return order.firstName || order.customerName;
    case 'member_lastname':
      return order.lastName || '';
    case 'member_email':
      return order.email || '';
    case 'member_phone':
      return order.phone;
    case 'member_address':
      return order.address || '';
    case 'price':
      return order.total;
    case 'delivery_price':
      return order.deliveryFee ?? '';
    case 'order_status':
      return ORDER_STATUS_LABELS[order.status];
    case 'is_paid':
      return PAYMENT_STATUS_LABELS[orderPaymentStatus(order)];
    case 'payment_id':
      return order.paymentMethod;
    case 'delivery_id':
      return order.deliveryType || '';
    case 'currency_title':
      return 'MNT';
    case 'taxonomy_order_data':
      return order.vatType || '';
    case 'src':
      return ORDER_SOURCE_LABELS[order.source];
    case 'created_by':
      return order.manager || '';
    case 'product_sku':
      return item?.sku || '';
    case 'product_title':
      return item?.name || '';
    case 'product_quantity':
      return item ? item.qty.toFixed(2) : '';
    case 'product_price':
      return item ? item.price.toFixed(2) : '';
    default:
      return '';
  }
}

export type BuildExportInput = {
  startDate: string;
  endDate: string;
  status: string;
  paid: string;
  fields: ExportFieldKey[];
  expandProducts: boolean;
  orders?: AdOrder[];
};

export function filterExportOrders(input: BuildExportInput): AdOrder[] {
  const source = input.orders ?? DEMO_ORDERS;
  return source.filter((order) => {
    const day = orderDay(order);
    if (input.startDate && day < input.startDate) return false;
    if (input.endDate && day > input.endDate) return false;
    if (input.status && order.status !== (input.status as OrderStatus)) return false;
    if (input.paid === '1' && orderPaymentStatus(order) !== 'paid') return false;
    if (input.paid === '0' && orderPaymentStatus(order) !== 'unpaid') return false;
    return true;
  });
}

export function buildOrdersCsv(input: BuildExportInput) {
  const fields = input.fields.length ? input.fields : DEFAULT_EXPORT_FIELDS;
  const headers = fields.map((key) => EXPORT_FIELDS.find((f) => f.key === key)?.label || key);
  const rows: string[][] = [headers];
  const orders = filterExportOrders(input);
  const productKeys = fields.filter((key) => PRODUCT_EXPORT_FIELDS.includes(key));
  const orderKeys = fields.filter((key) => !PRODUCT_EXPORT_FIELDS.includes(key));

  for (const order of orders) {
    const items = order.items?.length ? order.items : [undefined];
    const lineCount = input.expandProducts ? items.length : 1;
    for (let i = 0; i < lineCount; i += 1) {
      rows.push(
        fields.map((key) => {
          const blankOrder = input.expandProducts && i > 0 && orderKeys.includes(key);
          if (blankOrder) return '';
          if (!input.expandProducts && productKeys.includes(key) && (order.items?.length || 0) > 1) {
            if (key === 'product_sku') return order.items?.map((it) => it.sku).join('; ') || '';
            if (key === 'product_title') return order.items?.map((it) => it.name).join('; ') || '';
            if (key === 'product_quantity') return order.items?.map((it) => it.qty).join('; ') || '';
            if (key === 'product_price') return order.items?.map((it) => it.price).join('; ') || '';
          }
          return String(fieldValue(order, key, i));
        }),
      );
    }
  }

  return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFilename() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `Orders-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}.csv`;
}
