export type ProductSize = {
  label: string;
  price: string;
  originalPrice?: string;
};

export type ProductShade = {
  id: string;
  name: string;
  hex: string;
  image?: string;
  price?: string;
  originalPrice?: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  hit?: boolean;
  isNew?: boolean;
  image: string;
  gallery?: string[];
  sizes?: ProductSize[];
  shades?: ProductShade[];
  shortDescription?: string;
};

export const catalog: CatalogProduct[] = [
  {
    id: '1',
    name: 'De Luxe Үсний будаг 60мл',
    category: 'Үсний будаг',
    price: '18,000₮',
    originalPrice: '22,000₮',
    discount: '18%',
    hit: true,
    image: 'images/demo/product1.jpg',
    gallery: ['images/demo/product1.jpg', 'images/demo/product2.jpg', 'images/demo/product3.jpg'],
    sizes: [
      { label: '60', price: '18,000₮', originalPrice: '22,000₮' },
      { label: '120', price: '32,000₮', originalPrice: '38,000₮' },
    ],
    shades: [
      { id: '1', name: '7/0, Blonde', hex: '#d4b896' },
      { id: '2', name: '6/7, Chocolate', hex: '#6b3b2a' },
      { id: '3', name: '5/4, Copper', hex: '#a8522d' },
      { id: '4', name: '4/0, Brown', hex: '#3d2317' },
    ],
  },
  {
    id: '2',
    name: 'Curex Balance шампунь',
    category: 'Шампунь',
    price: '24,500₮',
    image: 'images/demo/product2.jpg',
    gallery: ['images/demo/product2.jpg', 'images/demo/product1.jpg', 'images/demo/product4.jpg'],
    sizes: [
      { label: '250', price: '24,500₮' },
      { label: '400', price: '32,000₮' },
    ],
  },
  {
    id: '3',
    name: 'Biolage кондиционер',
    category: 'Кондиционер',
    price: '32,000₮',
    originalPrice: '35,500₮',
    discount: '10%',
    image: 'images/demo/product3.jpg',
    gallery: ['images/demo/product3.jpg', 'images/demo/product6.jpg', 'images/demo/product2.jpg'],
    sizes: [
      { label: '200', price: '32,000₮', originalPrice: '35,500₮' },
      { label: '400', price: '48,000₮' },
    ],
  },
  {
    id: '4',
    name: 'Serie Expert маск 250мл',
    category: 'Маск',
    price: '45,000₮',
    hit: true,
    image: 'images/demo/product4.jpg',
    gallery: ['images/demo/product4.jpg', 'images/demo/product3.jpg', 'images/demo/product1.jpg'],
  },
  {
    id: '5',
    name: 'Koleston Perfect будаг',
    category: 'Үсний будаг',
    price: '19,500₮',
    originalPrice: '25,000₮',
    discount: '22%',
    image: 'images/demo/product6.jpg',
    gallery: ['images/demo/product6.jpg', 'images/demo/product1.jpg', 'images/demo/product5.jpg'],
    sizes: [{ label: '60', price: '19,500₮', originalPrice: '25,000₮' }],
    shades: [
      { id: '1', name: '01, Ivory', hex: '#e8d5c4' },
      { id: '2', name: '07, Sand', hex: '#c4a574' },
      { id: '3', name: '12, Espresso', hex: '#4a2c1a' },
    ],
  },
  {
    id: '6',
    name: 'Honey Infused Hair Perfume',
    category: 'Үсний үнэртэн',
    price: '17,000₮',
    originalPrice: '25,000₮',
    discount: '25%',
    hit: true,
    image: 'images/demo/product6.jpg',
    gallery: ['images/demo/product6.jpg', 'images/demo/product4.jpg', 'images/demo/product2.jpg'],
    sizes: [
      { label: '50', price: '17,000₮', originalPrice: '25,000₮' },
      { label: '90', price: '24,000₮', originalPrice: '32,000₮' },
    ],
  },
  {
    id: '7',
    name: 'Nutritive Bain Satin шампунь',
    category: 'Шампунь',
    price: '38,000₮',
    isNew: true,
    image: 'images/demo/product1.jpg',
    gallery: ['images/demo/product1.jpg', 'images/demo/product2.jpg', 'images/demo/product3.jpg'],
    sizes: [
      { label: '250', price: '38,000₮' },
      { label: '500', price: '58,000₮' },
    ],
  },
  {
    id: '8',
    name: 'Otium Aqua маск 300мл',
    category: 'Маск',
    price: '29,000₮',
    originalPrice: '34,000₮',
    discount: '15%',
    image: 'images/demo/product2.jpg',
    gallery: ['images/demo/product2.jpg', 'images/demo/product4.jpg', 'images/demo/product6.jpg'],
  },
  {
    id: '9',
    name: 'Total Results сэрум 150мл',
    category: 'Сэрум',
    price: '27,000₮',
    hit: true,
    image: 'images/demo/product3.jpg',
    gallery: ['images/demo/product3.jpg', 'images/demo/product1.jpg', 'images/demo/product5.jpg'],
  },
  {
    id: '10',
    name: 'Absolut Repair шампунь',
    category: 'Шампунь',
    price: '36,000₮',
    originalPrice: '42,000₮',
    discount: '14%',
    image: 'images/demo/product4.jpg',
    gallery: ['images/demo/product4.jpg', 'images/demo/product2.jpg', 'images/demo/product1.jpg'],
    sizes: [
      { label: '300', price: '36,000₮', originalPrice: '42,000₮' },
      { label: '500', price: '49,000₮' },
    ],
  },
  {
    id: '11',
    name: 'SP Luxe Oil кондиционер 200мл',
    category: 'Кондиционер',
    price: '41,000₮',
    isNew: true,
    image: 'images/demo/product6.jpg',
    gallery: ['images/demo/product6.jpg', 'images/demo/product3.jpg', 'images/demo/product4.jpg'],
  },
  {
    id: '12',
    name: 'Mohito стайлинг мус 200мл',
    category: 'Стайлинг',
    price: '15,000₮',
    image: 'images/demo/product6.jpg',
    gallery: ['images/demo/product6.jpg', 'images/demo/product1.jpg', 'images/demo/product2.jpg'],
  },
];

export const relatedProducts = catalog.slice(1, 6);
export const wishlistProducts = catalog.slice(0, 6);
export const saleProducts = [catalog[5], catalog[0], catalog[4], catalog[7], catalog[2]];

export function getProduct(id: string) {
  return catalog.find((item) => item.id === id);
}
