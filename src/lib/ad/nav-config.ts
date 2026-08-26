import {
  ClipboardList,
  CloudDownload,
  DollarSign,
  Gauge,
  Lightbulb,
  Package,
  Phone,
  Receipt,
  ShoppingBag,
  Truck,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/lib/auth/types';

export type NavSubItem = {
  title: string;
  url: string;
  roles?: UserRole[];
};

export type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  roles?: UserRole[];
  items?: NavSubItem[];
};

export const primaryNav: NavItem[] = [
  { title: 'Dashboard', url: '/ad', icon: Gauge },
  {
    title: 'Захиалгууд',
    icon: ShoppingBag,
    items: [
      { title: 'Бүх захиалга', url: '/ad/orders' },
      { title: 'Шинэ захиалга (POS)', url: '/ad/create-order' },
    ],
  },
  {
    title: 'Тайлан',
    icon: Lightbulb,
    items: [
      { title: 'Захиалгын тайлан', url: '/ad/orders?section=order-report' },
      { title: 'Ажилтны тайлан', url: '/ad/orders?section=staff-report' },
    ],
  },
  {
    title: 'Бүтээгдэхүүн',
    icon: Package,
    items: [
      { title: 'Бүх бараа', url: '/ad/products' },
      { title: 'Үлдэгдэл хяналт', url: '/ad/products?section=stock' },
    ],
  },
  {
    title: 'Хэрэглэгчид',
    icon: Users,
    items: [
      { title: 'Бүх харилцагч', url: '/ad/customers' },
      { title: 'Салоны код өгөх', url: '/ad/salons', roles: ['owner', 'director'] },
    ],
  },
  { title: 'Ажилчид', url: '/ad/staff', icon: UserCog, roles: ['owner', 'director'] },
  { title: 'Түүх', url: '/ad/activity', icon: ClipboardList },
];

export const secondaryNav: NavItem[] = [
  { title: 'Дансны хуулга (Хаан)', url: '/ad/orders?section=bank', icon: DollarSign },
  { title: 'И-Баримт', url: '/ad/orders?section=receipt', icon: Receipt },
  { title: 'Call24', url: '/ad/orders?section=call24', icon: Phone },
  { title: 'Захиалга экспорт', url: '/ad/orders?section=export', icon: CloudDownload },
  {
    title: 'Хүргэлт',
    icon: Truck,
    items: [
      { title: 'Хянах', url: '/ad/orders?section=delivery' },
      { title: 'Тайлан', url: '/ad/orders?section=delivery-report' },
    ],
  },
];

export const allNavItems: NavItem[] = [...primaryNav, ...secondaryNav];

export function filterNavItems(items: NavItem[], role?: UserRole): NavItem[] {
  return items.flatMap((item) => {
    if (item.roles && (!role || !item.roles.includes(role))) return [];
    const children = item.items?.filter((child) => !child.roles || (role && child.roles.includes(role)));
    if (item.items && !children?.length && !item.url) return [];
    return [{ ...item, items: children }];
  });
}
