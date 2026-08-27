import {
  ClipboardList,
  Gauge,
  Lightbulb,
  Package,
  UserCog,
  Users,
  ShoppingBag,
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
  { title: 'Хэрэглэгчид', url: '/ad/customers', icon: Users },
  { title: 'Ажилчид', url: '/ad/staff', icon: UserCog, roles: ['owner', 'director'] },
  { title: 'Түүх', url: '/ad/activity', icon: ClipboardList },
];

export const secondaryNav: NavItem[] = [];

export const allNavItems: NavItem[] = [...primaryNav];

export function filterNavItems(items: NavItem[], role?: UserRole): NavItem[] {
  return items.flatMap((item) => {
    if (item.roles && (!role || !item.roles.includes(role))) return [];
    const children = item.items?.filter((child) => !child.roles || (role && child.roles.includes(role)));
    if (item.items && !children?.length && !item.url) return [];
    return [{ ...item, items: children }];
  });
}
