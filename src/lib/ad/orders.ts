export type OrderPaymentStatus = 'paid' | 'unpaid';
export type OrderStatus =
  | 'pending_payment'
  | 'preparing'
  | 'ready_for_delivery'
  | 'driver_accepted'
  | 'delivering'
  | 'success'
  | 'cancelled'
  | 'fake'
  | 'returned'
  | 'delivery_failed';

export type OrderSource =
  | 'web'
  | 'manual'
  | 'api'
  | 'mobile'
  | 'web_form'
  | 'lend'
  | 'call_center'
  | 'chatbot';

export type AdOrderItem = {
  id?: string;
  sku: string;
  name: string;
  price: number;
  qty: number;
  discountPercent?: number;
};

export type AdOrderPayment = {
  id: string;
  method: string;
  date: string;
  amount: number;
};

export type AdOrderTimeline = {
  text: string;
  meta: string;
  kind?: 'note' | 'system';
  image?: string;
  onSheet?: boolean;
};

export type AdOrder = {
  id: string;
  customerName: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  phone: string;
  extraPhone?: string;
  source: OrderSource;
  paymentMethod: string;
  manager?: string;
  address?: string;
  deliveryFee?: number;
  deliveryType?: string;
  vatType?: string;
  invoiceId?: string;
  total: number;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  date: string;
  note?: string;
  items?: AdOrderItem[];
  payments?: AdOrderPayment[];
  timeline?: AdOrderTimeline[];
  deletedAt?: string | null;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Төлбөр хүлээгдэж байгаа',
  preparing: 'Бэлтгэж байгаа',
  ready_for_delivery: 'Хүргэлтэнд бэлэн',
  driver_accepted: 'Хүргэлтийн ажилтан хүлээж авсан',
  delivering: 'Хүргэлт хийгдэж байгаа',
  success: 'Амжилттай',
  cancelled: 'Цуцлагдсан',
  fake: 'Хуурамч',
  returned: 'Буцаалт хийсэн',
  delivery_failed: 'Хүргэлт амжилтгүй',
};

export const ORDER_SOURCE_LABELS: Record<OrderSource, string> = {
  web: 'Вэб захиалгаас',
  manual: 'Гараар нэмсэн',
  api: 'API -с',
  mobile: 'Мобайл аппаас',
  web_form: 'Вэб формоос',
  lend: 'Lend.mn',
  call_center: 'Call center аппаас',
  chatbot: 'Чат ботоос',
};

export const PAYMENT_METHODS = [
  { value: '', label: 'Бүгд' },
  { value: '1', label: 'Дансаар шилжүүлэх' },
  { value: '2', label: 'Бэлэн мөнгөөр' },
  { value: '3', label: 'Голомт онлайн мерчантаар' },
  { value: '4', label: 'Хаан онлайн мерчантаар' },
  { value: '5', label: 'ХХБ онлайн мерчантаар' },
  { value: '6', label: 'Qpay мерчантаар' },
  { value: '7', label: 'Lend.mn мерчантаар' },
  { value: '8', label: 'Зээлээр' },
  { value: '11', label: 'Pocket pay wallet' },
  { value: '12', label: 'StorePay' },
  { value: '14', label: 'Мобиком дугаар дээрээ' },
];

export const DATE_RANGE_OPTIONS = [
  { value: '', label: 'Бүгд' },
  { value: '1', label: 'Өнөөдөр' },
  { value: '2', label: 'Өчигдөр' },
  { value: '3', label: 'Энэ 7 хоног' },
  { value: '4', label: 'Өмнөх 7 хоногт' },
  { value: '5', label: 'Энэ сар' },
  { value: '6', label: 'Сүүлийн сар' },
];

export const MANAGERS = [
  { value: '', label: 'Сонгох' },
  { value: '3820', label: 'Өлзийхутаг Намсрайжав' },
  { value: '4065', label: 'Нямдорж Жавхлан' },
  { value: '4564', label: 'Г. Нандин-Эрдэнэ' },
  { value: '4928', label: 'Хулан Батхүү' },
  { value: '5661', label: 'Дуламсүрэн Чинбат' },
  { value: '5759', label: 'Номинзаяа Б' },
  { value: '6215', label: 'Энхмөнх Баатар' },
  { value: '6216', label: 'Дүүриймаа Барбаатар' },
  { value: '6741', label: 'Болорчимэг Даваасүрэн' },
  { value: '1977', label: 'Б.Мөнхцэцэг' },
  { value: '7001', label: 'Уранчимэг Б' },
  { value: '7151', label: 'Алтжин О' },
  { value: '7152', label: 'Аззаяа Б' },
  { value: '5379', label: 'Munkhbayr Daramjav' },
  { value: '7999', label: 'Бямбацогт Бямбацогт' },
];

export const SOURCE_OPTIONS = [
  { value: '', label: 'Бүгд' },
  { value: '0', label: 'Вэб захиалгаас' },
  { value: '1', label: 'Гараар нэмсэн' },
  { value: '2', label: 'API -с' },
  { value: '3', label: 'Мобайл аппаас' },
  { value: '4', label: 'Вэб формоос' },
  { value: '5', label: 'Lend.mn' },
  { value: '6', label: 'Call center аппаас' },
  { value: '7', label: 'Чат ботоос' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Бүгд' },
  { value: '0', label: 'Төлбөр хүлээгдэж байгаа' },
  { value: '2', label: 'Амжилттай' },
  { value: '-8', label: 'Буцаалт хийсэн' },
];

export const ORDER_STATUS_CHANGE_OPTIONS = STATUS_FILTER_OPTIONS.filter((opt) => opt.value !== '');

export const STATUS_TO_VALUE: Record<OrderStatus, string> = {
  pending_payment: '0',
  delivering: '1',
  success: '2',
  preparing: '3',
  ready_for_delivery: '4',
  driver_accepted: '5',
  cancelled: '-1',
  fake: '-2',
  returned: '-8',
  delivery_failed: '-10',
};

export const VALUE_TO_STATUS: Record<string, OrderStatus> = {
  '0': 'pending_payment',
  '1': 'delivering',
  '2': 'success',
  '3': 'preparing',
  '4': 'ready_for_delivery',
  '5': 'driver_accepted',
  '-1': 'cancelled',
  '-2': 'fake',
  '-8': 'returned',
  '-10': 'delivery_failed',
};

export const ORDER_PROGRESS_STEPS = [
  'Захиалга үүссэн',
  'Төлбөр төлсөн',
  'Бэлтгэж байгаа',
  'Хүргэлтэнд бэлэн',
  'Хүргэлтийн ажилтан хүлээж авсан',
  'Хүргэлт хийгдэж байгаа',
  'Амжилттай',
];

export function getProgressCount(order: AdOrder): number {
  switch (order.status) {
    case 'success':
      return 7;
    case 'delivering':
      return 6;
    case 'driver_accepted':
      return 5;
    case 'ready_for_delivery':
      return 4;
    case 'preparing':
      return 3;
    case 'pending_payment':
      return order.paymentStatus === 'paid' ? 2 : 1;
    default:
      return 1;
  }
}

export function lineTotal(item: AdOrderItem): number {
  const raw = item.price * item.qty;
  if (!item.discountPercent) return raw;
  return Math.round(raw * (1 - item.discountPercent / 100));
}

const ORDERS_KEY = 'estel-ad-orders';
const SEQ_KEY = 'estel-ad-order-seq';
const ORDER_SEQ_START = 1000;

export function formatOrderDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function listStoredOrders(): AdOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: AdOrder[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function nextOrderNumber(): string {
  const existing = listStoredOrders()
    .map((o) => Number(o.id))
    .filter((n) => Number.isFinite(n) && n > 0);
  const storedSeq = Number(localStorage.getItem(SEQ_KEY) || ORDER_SEQ_START);
  const next = Math.max(ORDER_SEQ_START, storedSeq, ...existing) + 1;
  localStorage.setItem(SEQ_KEY, String(next));
  return String(next);
}

export function saveStoredOrder(order: AdOrder) {
  const orders = listStoredOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i >= 0) orders[i] = order;
  else orders.unshift(order);
  writeOrders(orders);
}

export function patchStoredOrder(id: string, patch: Partial<AdOrder>) {
  const orders = listStoredOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  writeOrders(orders);
  return orders.find((o) => o.id === id);
}

export function trashStoredOrder(id: string) {
  return patchStoredOrder(id, { deletedAt: formatOrderDate() });
}

export function restoreStoredOrder(id: string) {
  return patchStoredOrder(id, { deletedAt: null });
}

export function getOrderById(id: string): AdOrder | undefined {
  return listStoredOrders().find((order) => order.id === id);
}

export function getOrderByInvoiceId(invoiceId: string): AdOrder | undefined {
  return listStoredOrders().find((order) => order.invoiceId === invoiceId);
}

export function staffDisplayName(user?: { name?: string; lastName?: string } | null) {
  if (!user) return 'Ажилтан';
  return [user.lastName, user.name].filter(Boolean).join(' ').trim() || user.name || 'Ажилтан';
}

export function appendOrderTimeline(
  id: string,
  text: string,
  actor: string,
  extra?: { image?: string; onSheet?: boolean; kind?: AdOrderTimeline['kind']; ip?: string },
) {
  const order = getOrderById(id);
  if (!order) return;
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
  return patchStoredOrder(id, patch);
}

export function listOrdersByCustomer(order: AdOrder): AdOrder[] {
  const phone = (order.phone || '').replace(/\D/g, '');
  const email = (order.email || '').trim().toLowerCase();
  return listStoredOrders()
    .filter((o) => !o.deletedAt)
    .filter((o) => {
      const p = (o.phone || '').replace(/\D/g, '');
      if (phone && p && (p.includes(phone) || phone.includes(p))) return true;
      if (email && (o.email || '').trim().toLowerCase() === email) return true;
      return false;
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export const INVOICE_MAIL_OPTIONS = [
  { value: '1', label: 'Шинэ нэхэмжлэл үүссэн тухай' },
  { value: '2', label: 'Нэхэмжлэл төлөх сануулга' },
  { value: '3', label: 'Төлбөр хүлээн авсан тухай' },
  { value: '4', label: 'Нэхэмжлэл цуцлагдсан' },
];

export const INVOICE_PAYMENT_METHODS = [
  { value: '1', label: 'Дансаар шилжүүлэх' },
  { value: '2', label: 'Бэлэн мөнгөөр' },
  { value: '3', label: 'Голомт онлайн мерчантаар' },
  { value: '4', label: 'Хаан онлайн мерчантаар' },
  { value: '5', label: 'ХХБ онлайн мерчантаар' },
  { value: '6', label: 'Qpay мерчантаар' },
  { value: '7', label: 'Lend.mn мерчантаар' },
  { value: '8', label: 'Зээлээр' },
  { value: '9', label: 'Most money' },
  { value: '11', label: 'Pocket pay' },
  { value: '12', label: 'Store pay' },
  { value: '17', label: 'Sono pay' },
  { value: '20', label: 'DigiPay' },
];

export type InvoiceStatus = 'paid' | 'unpaid' | 'cancelled';

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: 'Төлөгдсөн',
  unpaid: 'Төлөгдөөгүй',
  cancelled: 'Цуцлагдсан',
};

export const DEMO_ORDERS: AdOrder[] = []; /*
  {
    id: '1333300',
    customerName: 'Б.Бадмаараа Silver member 20107 Бамбаараа Увс',
    lastName: 'Бадмаараа',
    firstName: 'Бамбаараа',
    email: '',
    phone: '88199947 96802122',
    source: 'manual',
    paymentMethod: 'Дансаар шилжүүлэх',
    manager: 'Хулан Батхүү',
    address: 'Увс аймаг, 4-р баг, 12-32 тоот ✌steller blond өгнө',
    deliveryFee: 0,
    vatType: 'хувь хүн',
    invoiceId: '1331458',
    total: 243450,
    paymentStatus: 'paid',
    status: 'success',
    date: '2026-08-25 11:56:54',
    items: [
      {
        sku: '231129',
        name: '7 0 PRINCE 100мл Туяа өнгө 100% буурал үс дарна (4606453062662)',
        price: 19500,
        qty: 3,
        discountPercent: 10,
      },
      {
        sku: '231136',
        name: '6 0 PRINCE 100мл Туяа өнгө 100% буурал үс дарна (4606453062730)',
        price: 19500,
        qty: 3,
        discountPercent: 10,
      },
      {
        sku: '231855',
        name: 'PRIMA BLONDE шампунь цайруулалттай 250 мл (4606453034157)',
        price: 28500,
        qty: 1,
        discountPercent: 10,
      },
      {
        sku: '298674',
        name: 'Remount набор 500мл (4606453077413)',
        price: 125000,
        qty: 1,
        discountPercent: 10,
      },
    ],
    payments: [
      { id: '1060020', method: 'Дансаар шилжүүлэх', date: '2026-08-25 12:01:32', amount: 243450 },
    ],
    timeline: [
      {
        text: '(#Бямбацогт Бямбацогт) хэрэглэгч (#1333300) дугаартай захиалгын төлөвийг " Амжилттай" болгож өөрчиллөө.',
        meta: 'Бямбацогт / 202.126.89.14 / 2026-08-25 12:08:28',
      },
      {
        text: '(#Хулан  Батхүү) хэрэглэгч (#1333300) дугаартай захиалгын 243,450₮ төлбөрийг бүртгэв.',
        meta: 'Хулан  / 202.126.89.14 / 2026-08-25 12:01:37',
      },
      {
        text: '#4928 дугаартай Хулан  Батхүү хэрэглэгч #1333300 захиалга үүсгэлээ.',
        meta: 'Хулан  / 202.126.89.14 / 2026-08-25 11:56:54',
      },
      {
        text: 'захиалга үүсгэх явцдаа харилцагчийн мэдээлэл шинэчлэгдлээ.',
        meta: 'Хулан  / 202.126.89.14 / 2026-08-25 11:56:54',
      },
    ],
  },
  {
    id: '1333312',
    customerName: 'Б.Уранчимэг 20279 Сондор салон СБД',
    lastName: 'Уранчимэг',
    firstName: 'Б',
    email: '',
    phone: '80080053',
    source: 'manual',
    paymentMethod: 'Дансаар шилжүүлэх',
    manager: '',
    address: '10-р хороолол My town 112-р байр',
    deliveryFee: 0,
    total: 134425,
    paymentStatus: 'unpaid',
    status: 'pending_payment',
    date: '2026-08-25 10:42:15',
  },
  {
    id: '1332379',
    customerName: 'Б.Уранчимэг 20279 Сондор салон СБД',
    email: '',
    phone: '80080053',
    source: 'manual',
    paymentMethod: 'Дансаар шилжүүлэх',
    manager: '',
    total: 231700,
    paymentStatus: 'paid',
    status: 'success',
    date: '2026-08-23 11:15:38',
  },
  {
    id: '1332358',
    customerName: 'Ц.Тогтохжаргал Silver member 20532 Ховд',
    email: '',
    phone: '99853083',
    source: 'manual',
    paymentMethod: 'Дансаар шилжүүлэх',
    manager: '',
    address: 'Ховд Жаргалант 1-р баг',
    total: 374400,
    paymentStatus: 'paid',
    status: 'success',
    date: '2026-08-23 10:58:22',
  },
  {
    id: '1332332',
    customerName: 'Д.Болормаа 19845',
    email: 'bolormaa@mail.mn',
    phone: '99112233',
    source: 'web',
    paymentMethod: 'Qpay мерчантаар',
    manager: 'Нямдорж Жавхлан',
    address: 'БЗД, 12-р хороолол, 23-р байр',
    total: 89500,
    paymentStatus: 'paid',
    status: 'preparing',
    date: '2026-08-23 09:30:11',
  },
  {
    id: '1332328',
    customerName: 'Г. Бат-Ирээдүй (Салон "Beauty Lab")',
    email: 'bat@beautylab.mn',
    phone: '88005566',
    source: 'call_center',
    paymentMethod: 'Дансаар шилжүүлэх',
    manager: 'Г. Нандин-Эрдэнэ',
    address: 'СБД, 5-р хороо, Сөүлийн гудамж',
    total: 480000,
    paymentStatus: 'paid',
    status: 'delivering',
    date: '2026-08-23 08:45:00',
  },
  {
    id: '1332317',
    customerName: 'Т. Ариунболд',
    email: '',
    phone: '95123344',
    source: 'mobile',
    paymentMethod: 'StorePay',
    manager: '',
    address: 'ХУД, 15-р хороо, Рапид харш',
    total: 58000,
    paymentStatus: 'unpaid',
    status: 'pending_payment',
*/

export type OrderFilters = {
  orderId: string;
  orderPhone: string;
  isPaid: string;
  paymentId: string;
  orderDate: string;
  tripStart: string;
  nameQuery: string;
  extraPhone: string;
  managerId: string;
  backup: string;
  deliveryId: string;
  source: string;
  orderStatus: string;
};

export const EMPTY_FILTERS: OrderFilters = {
  orderId: '',
  orderPhone: '',
  isPaid: '',
  paymentId: '',
  orderDate: '',
  tripStart: '',
  nameQuery: '',
  extraPhone: '',
  managerId: '',
  backup: '',
  deliveryId: '',
  source: '',
  orderStatus: '',
};

export function filterOrders(orders: AdOrder[], filters: OrderFilters): AdOrder[] {
  return orders.filter((order) => {
    if (filters.orderId && !order.id.includes(filters.orderId.replace('#', ''))) return false;
    if (filters.orderPhone && !order.phone.includes(filters.orderPhone)) return false;
    if (filters.nameQuery && !order.customerName.toLowerCase().includes(filters.nameQuery.toLowerCase())) return false;
    if (filters.extraPhone && order.extraPhone && !order.extraPhone.includes(filters.extraPhone)) return false;
    if (filters.isPaid === '1' && order.paymentStatus !== 'paid') return false;
    if (filters.isPaid === '-1' && order.paymentStatus !== 'unpaid') return false;
    if (filters.source) {
      const sourceMap: Record<string, OrderSource> = {
        '0': 'web',
        '1': 'manual',
        '2': 'api',
        '3': 'mobile',
        '4': 'web_form',
        '5': 'lend',
        '6': 'call_center',
        '7': 'chatbot',
      };
      if (order.source !== sourceMap[filters.source]) return false;
    }
    if (filters.orderStatus) {
      const statusMap: Record<string, OrderStatus> = {
        '0': 'pending_payment',
        '1': 'delivering',
        '2': 'success',
        '3': 'preparing',
        '4': 'ready_for_delivery',
        '5': 'driver_accepted',
        '-1': 'cancelled',
        '-2': 'fake',
        '-8': 'returned',
        '-10': 'delivery_failed',
      };
      if (order.status !== statusMap[filters.orderStatus]) return false;
    }
    return true;
  });
}
