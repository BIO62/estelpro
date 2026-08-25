import { DEMO_PRODUCTS } from '@/lib/constants';
import { DEMO_ORDERS } from '@/lib/ad/orders';

export type CatalogProduct = {
  id: string;
  sku: string;
  title: string;
  price: number;
  isTax: boolean;
  stock?: number;
};

export type DemoMember = {
  id: string;
  firstname: string;
  lastname: string;
  company: string;
  phone: string;
  email: string;
  address_1: string;
};

/** Local catalog — no live Sylius call on create-order */
export const ORDER_CATALOG: CatalogProduct[] = [
  ...DEMO_PRODUCTS.map((p) => ({
    id: p.id,
    sku: `SKU-${p.id}`,
    title: p.name,
    price: p.price,
    isTax: true,
    stock: 24,
  })),
  ...DEMO_ORDERS.flatMap(
    (o) =>
      o.items?.map((item) => ({
        id: item.sku,
        sku: item.sku,
        title: item.name,
        price: item.price,
        isTax: true,
        stock: 12,
      })) ?? [],
  ),
].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

export const DEMO_MEMBERS: DemoMember[] = [
  {
    id: '900769',
    firstname: 'Бамбаараа',
    lastname: 'Бадмаараа',
    company: 'Бамбаараа Увс',
    phone: '88199947',
    email: '',
    address_1: 'Увс аймаг, 4-р баг, 12-32 тоот',
  },
  {
    id: '20279',
    firstname: 'Уранчимэг',
    lastname: 'Б',
    company: 'Сондор салон СБД',
    phone: '80080053',
    email: '',
    address_1: '10-р хороолол My town 112-р байр',
  },
  {
    id: '20532',
    firstname: 'Тогтохжаргал',
    lastname: 'Ц',
    company: '',
    phone: '99853083',
    email: '',
    address_1: 'Ховд Жаргалант 1-р баг',
  },
  {
    id: '19845',
    firstname: 'Болормаа',
    lastname: 'Д',
    company: '',
    phone: '99112233',
    email: 'bolormaa@mail.mn',
    address_1: 'Улаанбаатар, СБД 5-р хороо',
  },
];

export function searchMembers(q: string): DemoMember[] {
  const term = q.trim().toLowerCase();
  if (term.length < 3) return [];
  return DEMO_MEMBERS.filter(
    (m) =>
      m.phone.includes(term) ||
      m.firstname.toLowerCase().includes(term) ||
      m.lastname.toLowerCase().includes(term) ||
      m.company.toLowerCase().includes(term) ||
      m.id.includes(term),
  );
}

export function searchCatalog(q: string): CatalogProduct[] {
  const term = q.trim().toLowerCase();
  if (!term) return ORDER_CATALOG.slice(0, 8);
  return ORDER_CATALOG.filter(
    (p) => p.title.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term) || p.id.includes(term),
  ).slice(0, 12);
}

export const CREATE_ORDER_PAYMENTS = [
  { value: '1', label: 'Дансаар шилжүүлэх' },
  { value: '2', label: 'Бэлэн мөнгөөр' },
  { value: '3', label: 'Голомт онлайн мерчантаар' },
  { value: '4', label: 'Хаан онлайн мерчантаар' },
  { value: '5', label: 'ХХБ онлайн мерчантаар' },
  { value: '6', label: 'QPay ээр хялбар төлөх' },
  { value: '7', label: 'Lend.mn мерчантаар' },
];

export const CREATE_ORDER_CURRENCIES = [
  { value: '1', label: 'Төгрөг' },
  { value: '2', label: 'Ам.доллар' },
  { value: '3', label: 'Euro' },
  { value: '4', label: 'Cn.Yuan' },
  { value: '5', label: 'Рубль' },
];
