export const FALLBACK_PRODUCT_IMAGE = 'images/demo/product6.jpg';

export function assetUrl(path: string): string {
  if (!path) return assetUrl(FALLBACK_PRODUCT_IMAGE);
  if (path.startsWith('/')) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `/${path.replace(/^\//, '')}`;
}

export const SITE_NAME = 'ESTEL';
export const SITE_DESCRIPTION = 'ESTEL Professional Mongolia - Мэргэжлийн үс арчилгааны бүтээгдэхүүн';

export { BRANCHES, listBranches, listUlaanbaatarBranches } from './branches';

export const FOOTER_LINKS = {
  help: [
    { label: 'Бидний тухай', href: '/about' },
    { label: 'Салбарууд', href: '/branches' },
    { label: 'Үйлчилгээний нөхцөл', href: '/terms' },
    { label: 'Хүргэлтийн нөхцөл', href: '/terms/delivery' },
    { label: 'Төлбөрийн нөхцөл', href: '/terms/payment' },
  ],
  contact: {
    address: 'Улаанбаатар хот, Баянзүрх дүүрэг, 1-р хороо, 12-р хороолол (13381), Токиогийн гудамж-23, Имарт Чингис',
    email: 'info@estelpro.mn',
    hours: '09:00 - 22:00',
    info: '86207202, 18 цаг хүртэл ажиллана.',
    phones: ['7707 2207', '8605 7202', '8603 7202'],
  },
};

export const DEMO_PRODUCTS = [
  {
    id: '1',
    name: 'Honey Infused Hair Perfume Limited Edition',
    price: 17000,
    originalPrice: 25000,
    discount: 25,
    image: 'images/demo/product6.jpg',
    variants: ['Honey Dewy - 18,000₮', 'Glazed Cherry - 18,000₮'],
  },
  {
    id: '2',
    name: 'Honey Infused Hair Oil',
    price: 17000,
    originalPrice: 25000,
    discount: 25,
    image: 'images/demo/product6.jpg',
  },
  {
    id: '3',
    name: 'Honey Infused Hair Treatment',
    price: 17000,
    originalPrice: 25000,
    discount: 25,
    image: 'images/demo/product6.jpg',
    variants: ['Honey Dewy - 18,000₮', 'Glazed Cherry - 18,000₮'],
  },
  {
    id: '4',
    name: 'Collagen Hair Mask',
    price: 17000,
    originalPrice: 25000,
    discount: 25,
    image: 'images/demo/product6.jpg',
  },
];
