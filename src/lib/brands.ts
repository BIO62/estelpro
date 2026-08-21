export const MENU_BRANDS = [
  { slug: 'couture-luxury', name: 'Couture Luxury', img: 'images/brands/500x500px logo 1.jpg', aliases: ['couture', 'luxury'] },
  { slug: 'otium', name: 'Otium', img: 'images/brands/500x500px logo 2.jpg', aliases: ['otium'] },
  { slug: 'obnimi', name: 'Обними', img: 'images/brands/500x500px logo 3.jpg', aliases: ['обними', 'obnimi', 'obnimi'] },
  { slug: 'prima-blonde', name: 'Prima Blonde', img: 'images/brands/500x500px logo 4.jpg', aliases: ['prima', 'blonde'] },
  { slug: 'estel-18', name: 'Estel 18+', img: 'images/brands/500x500px logo 5.jpg', aliases: ['18+', '18 plus', 'estel plus'] },
  { slug: 'keratin-plus', name: 'Keratin+', img: 'images/brands/500x500px logo 6.jpg', aliases: ['keratin'] },
  { slug: 'q3-comfort', name: 'Q3 Comfort', img: 'images/brands/500x500px logo 7.jpg', aliases: ['q3'] },
  { slug: 'lissage', name: 'Lissage', img: 'images/brands/500x500px logo 8.jpg', aliases: ['lissage'] },
  { slug: 'rehair', name: 'reHair', img: 'images/brands/500x500px logo 9.jpg', aliases: ['rehair'] },
  { slug: 'alpha', name: 'Alpha', img: 'images/brands/500x500px logo 10.jpg', aliases: ['alpha'] },
  { slug: 'little-me', name: 'Little ME', img: 'images/brands/500x500px logo 11.jpg', aliases: ['little me', 'littleme'] },
  { slug: 'airex', name: 'Airex', img: 'images/brands/500x500px logo 12.jpg', aliases: ['airex'] },
] as const;

export type MenuBrand = (typeof MENU_BRANDS)[number];

function normalizeBrandKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ё/g, 'е')
    .replace(/[^a-z0-9а-яөү]+/gi, '');
}

export function getMenuBrand(slug?: string) {
  if (!slug) return undefined;
  return MENU_BRANDS.find((brand) => brand.slug === slug);
}

export function productMatchesBrand(
  product: { brand?: { code?: string; name?: string }; name?: string },
  slug: string
) {
  const brand = getMenuBrand(slug);
  if (!brand) return false;
  const needles = [brand.slug, brand.name, ...brand.aliases].map(normalizeBrandKey).filter(Boolean);
  const fields = [product.brand?.code, product.brand?.name].map((value) => normalizeBrandKey(value || '')).filter(Boolean);
  if (fields.some((field) => needles.some((needle) => field === needle || field.includes(needle) || needle.includes(field)))) {
    return true;
  }
  const productName = normalizeBrandKey(product.name || '');
  if (!productName) return false;
  return needles.some((needle) => needle.length >= 4 && productName.includes(needle));
}
