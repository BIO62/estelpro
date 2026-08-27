import { FALLBACK_PRODUCT_IMAGE } from '@/lib/constants';
import { DRESSER_TAXON_CODES } from '@/lib/catalog-audience';
import { listProducts, type DbProduct } from '@/lib/ad/products-repo';
import { MENU_BRANDS, productMatchesBrand } from '@/lib/brands';
import { getSyliusTaxons, toMenuTaxons, type MenuTaxon, type ProductSort } from '@/lib/api/sylius';
import type { CatalogProduct } from '@/lib/products';
import { applySalonDiscount } from '@/lib/auth/salon-discount';

const TAXON_LABELS: Record<string, string> = {
  hair_care: 'Үс арчилгаа',
  skin_body: 'Арьс & бие арчилгаа',
  Alpha: 'Alpha',
  kids_care: 'Хүүхдийн арчилгаа',
  styling: 'Хэлбэржүүлэлт',
  shaping: 'Хэлбэржүүлэлт',
  hair_coloring: 'Үсний будаг',
  hair_signature: 'Hair Signature',
  hair_love: 'Hair Love',
  all_products: 'Бүх бүтээгдэхүүн',
};

const CONSUMER_TAXONS: MenuTaxon[] = [
  { code: 'hair_care', name: TAXON_LABELS.hair_care, children: [] },
  { code: 'skin_body', name: TAXON_LABELS.skin_body, children: [] },
  { code: 'Alpha', name: TAXON_LABELS.Alpha, children: [] },
  { code: 'kids_care', name: TAXON_LABELS.kids_care, children: [] },
  { code: 'styling', name: TAXON_LABELS.styling, children: [] },
];

const DRESSER_TAXONS: MenuTaxon[] = [
  { code: 'hair_coloring', name: TAXON_LABELS.hair_coloring, children: [] },
  { code: 'hair_signature', name: TAXON_LABELS.hair_signature, children: [] },
  { code: 'hair_love', name: TAXON_LABELS.hair_love, children: [] },
];

function productTaxons(product: DbProduct) {
  return new Set([product.taxon, ...(product.taxons || [])].filter((value): value is string => Boolean(value)));
}

export function isDresserStorefrontProduct(product: DbProduct) {
  const taxons = productTaxons(product);
  return DRESSER_TAXON_CODES.some((code) => taxons.has(code));
}

export function storefrontMenuTaxons(audience: 'consumer' | 'dresser'): MenuTaxon[] {
  if (audience === 'dresser') return [...DRESSER_TAXONS, ...CONSUMER_TAXONS];
  return CONSUMER_TAXONS;
}

export async function getStorefrontMenuTaxons(audience: 'consumer' | 'dresser'): Promise<MenuTaxon[]> {
  const raw = await getSyliusTaxons();
  if (audience === 'dresser') {
    const dresser = toMenuTaxons(raw, 'dresser');
    const consumer = toMenuTaxons(raw, 'consumer').filter((item) => item.code !== 'all_products');
    return [
      ...(dresser.length ? dresser : DRESSER_TAXONS),
      ...(consumer.length ? consumer : CONSUMER_TAXONS),
    ];
  }
  const fetched = toMenuTaxons(raw, 'consumer');
  return fetched.length ? fetched : CONSUMER_TAXONS;
}

export function menuHasTaxon(menu: MenuTaxon[], code?: string) {
  if (!code) return false;
  return menu.some((item) => item.code === code || item.children.some((child) => child.code === code));
}

export async function getStorefrontProducts(options?: {
  taxon?: string;
  audience?: 'consumer' | 'dresser';
}) {
  const audience = options?.audience || 'consumer';
  const { items, source } = await listProducts({
    taxon: options?.taxon,
    limit: 2000,
  });
  return {
    source,
    items:
      audience === 'dresser'
        ? items
        : items.filter((product) => !isDresserStorefrontProduct(product)),
  };
}

export async function getStorefrontProduct(code: string) {
  const { items } = await listProducts({ q: code, limit: 50 });
  return items.find((product) => product.code === code || product.id === code) || null;
}

function money(value: number) {
  return `${new Intl.NumberFormat('mn-MN').format(Math.max(0, Math.round(value)))}₮`;
}

function productCategory(product: DbProduct) {
  const taxons = productTaxons(product);
  const known = Object.keys(TAXON_LABELS).find((code) => taxons.has(code));
  return known ? TAXON_LABELS[known] : '';
}

export function toStorefrontProduct(
  product: DbProduct,
  options?: { forceNew?: boolean; contractPercent?: number },
): CatalogProduct {
  const original = product.original_price && product.original_price > product.price ? product.original_price : null;
  const catalogDiscount = original ? Math.round(((original - product.price) / original) * 100) : 0;
  const gallery = [product.image_url, ...(product.gallery || [])].filter(
    (image, index, images): image is string => Boolean(image) && images.indexOf(image) === index,
  );
  const percent = options?.contractPercent || 0;
  const salePrice = percent ? applySalonDiscount(product.price, percent) : product.price;
  const listPrice = percent ? product.price : original;
  const discount = percent
    ? `-${percent}%`
    : catalogDiscount > 0
      ? `-${catalogDiscount}%`
      : undefined;

  return {
    id: product.code,
    name: product.name,
    category: productCategory(product),
    brand: product.brand || 'ESTEL',
    price: money(salePrice),
    originalPrice: listPrice ? money(listPrice) : undefined,
    discount,
    isNew: options?.forceNew,
    image: gallery[0] || FALLBACK_PRODUCT_IMAGE,
    gallery: gallery.length ? gallery : [FALLBACK_PRODUCT_IMAGE],
    shortDescription: product.short_description || undefined,
  };
}

export function storefrontProductMatchesBrand(product: DbProduct, slug: string) {
  return productMatchesBrand(
    {
      brand: product.brand ? { name: product.brand } : undefined,
      name: product.name,
    },
    slug,
  );
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

export function sortStorefrontProducts(products: DbProduct[], sort: ProductSort, seed = '') {
  const items = [...products];
  if (sort === 'price-asc') return items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return items.sort((a, b) => b.price - a.price);
  if (sort === 'onsale') {
    return items.filter((item) => (item.original_price || 0) > item.price);
  }
  if (sort === 'newest') return items.reverse();
  return items.sort((a, b) => hash(`${seed}:${a.code}`) - hash(`${seed}:${b.code}`));
}

export { MENU_BRANDS };
export type { DbProduct, ProductSort };
