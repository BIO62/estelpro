import type { UserRole } from '@/lib/auth/types';

export type NavSubItem = {
  title: string;
  url: string;
  icon?: string;
  roles?: UserRole[];
};

export type NavItem = {
  title: string;
  url?: string;
  icon?: string;
  roles?: UserRole[];
  items?: NavSubItem[];
};

export const primaryNav: NavItem[] = [
  { title: 'Dashboard', url: '/ad', icon: 'icon-speedometer' },
  {
    title: 'Захиалгууд',
    icon: 'icon-bag',
    items: [
      { title: 'Захиалгууд', url: '/ad/orders', icon: 'icon-bag' },
      { title: 'Устгагдсан', url: '/ad/orders?trashed=1', icon: 'icon-trash' },
    ],
  },
  {
    title: 'Тайлан',
    icon: 'icon-bulb',
    roles: ['owner', 'director', 'manager'],
    items: [
      { title: 'Захиалгын тайлан', url: '/ad/orders?section=order-report' },
      { title: 'Ажилтны тайлан', url: '/ad/orders?section=staff-report' },
    ],
  },
  {
    title: 'Бүтээгдэхүүн',
    icon: 'icon-bag',
    items: [
      { title: 'Бүх бараа', url: '/ad/products' },
      { title: 'Үлдэгдэл хяналт', url: '/ad/products?section=stock' },
    ],
  },
  { title: 'Захиалга экспорт', url: '/ad/order-tools', icon: 'icon-cloud-download' },
  { title: 'Хэрэглэгчид', url: '/ad/customers', icon: 'fa fa-users' },
  { title: 'Ажилчид', url: '/ad/staff', icon: 'icon-user', roles: ['owner', 'director'] },
  { title: 'Түүх', url: '/ad/activity', icon: 'icon-list', roles: ['owner', 'director', 'manager'] },
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
