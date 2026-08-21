export const ASSET_BASE = 'https://alphalabs.mn/nextstore-html/estel';

export const FALLBACK_PRODUCT_IMAGE = 'images/demo/product6.jpg';

export function assetUrl(path: string): string {
  if (!path) return `${ASSET_BASE}/${FALLBACK_PRODUCT_IMAGE}`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE}/${path.replace(/^\//, '')}`;
}

export const SITE_NAME = 'ESTEL';
export const SITE_DESCRIPTION = 'ESTEL Professional Mongolia - Мэргэжлийн үс арчилгааны бүтээгдэхүүн';

export const BRANCHES = [
  {
    name: 'Баянзүрх дүүрэг',
    address: 'Соманг плаза, 3давхарт 308тоот',
    hours: 'Даваа - Ням: 09:00 - 18:00 цаг',
    image: 'images/demo/branch1.jpg',
  },
  {
    name: 'Сүхбаатар дүүрэг',
    address: 'Чингисийн И-март 2-давхарт',
    hours: 'Даваа - Ням: 09:00 - 20:00 цаг',
    image: 'images/demo/branch2.jpg',
  },
  {
    name: 'ЭРДЭНЭТ ОРХОН МОЛЛ',
    address: 'Орхон молл худалдааны төвийн 1 давхарт',
    hours: 'Даваа - Ням: 10:00 - 20:00 цаг',
    image: 'images/demo/branch3.jpg',
  },
  {
    name: 'ЭРДЭНЭТ АВТОЦЕНТР',
    address: '5-р микро Автоцентрийн 2 давхарт',
    hours: 'Даваа - Бямба: 09:00 - 18:00 цаг',
    image: 'images/demo/branch4.jpg',
  },
];

export const FOOTER_LINKS = {
  help: [
    { label: 'Бидний тухай', href: '/about' },
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
