import { FALLBACK_PRODUCT_IMAGE } from '@/lib/constants';
import type { CatalogProduct, ProductSize } from '@/lib/products';
import { CONSUMER_ROOT_TAXONS, isDresserProduct, isDresserTaxonCode } from '@/lib/catalog-audience';

export const SYLIUS_BASE_URL = process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn';

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'onsale';

export interface SyliusImage {
  id: number;
  type?: string;
  originalImagePath?: string;
  medium?: string;
  thumbnail?: string;
}

export interface SyliusVariant {
  id: number;
  code: string;
  name?: string | null;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  onHand?: number;
  promotionPercentage?: number;
}

export interface SyliusTaxon {
  id: number;
  code: string;
  name: string;
  slug?: string;
  enabled?: boolean;
  enabledChildren?: SyliusTaxon[];
}

export interface MenuTaxon {
  code: string;
  name: string;
  children: { code: string; name: string }[];
}

export interface SyliusProduct {
  id: number;
  code: string;
  name: string;
  slug: string;
  createdAt?: string;
  featured?: boolean;
  shortDescription?: string;
  description?: string;
  images: SyliusImage[];
  variants: SyliusVariant[];
  brand?: {
    id: number;
    code: string;
    name: string;
  };
  mainTaxon?: {
    id: number;
    code: string;
    name: string;
  };
  productTaxons?: Array<{
    taxon?: {
      code?: string;
      name?: string;
    };
  }>;
}

export interface SyliusProductCollection {
  items: SyliusProduct[];
  total: number;
}

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record['hydra:member'])) return record['hydra:member'] as T[];
    if (Array.isArray(record.member)) return record.member as T[];
  }
  return [];
}

function unwrapTotal(data: unknown, fallback: number): number {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const total = record['hydra:totalItems'] ?? record.totalItems;
    if (typeof total === 'number') return total;
  }
  return fallback;
}

function fetchOpts(revalidate = 120): RequestInit {
  return {
    cache: 'force-cache',
    next: { revalidate },
    headers: { Accept: 'application/json' },
  };
}

export function syliusAmount(priceInCents: number): number {
  return priceInCents > 1_000_000 ? Math.round(priceInCents / 100) : priceInCents;
}

export function formatSyliusPrice(priceInCents: number): string {
  return new Intl.NumberFormat('mn-MN').format(syliusAmount(priceInCents)) + '₮';
}

export function syliusImageUrl(image?: SyliusImage): string {
  return image?.medium || image?.originalImagePath || image?.thumbnail || '';
}

export function toMenuTaxons(
  taxons: SyliusTaxon[],
  audience: 'consumer' | 'dresser' = 'consumer'
): MenuTaxon[] {
  return taxons
    .filter((taxon) => taxon.enabled !== false && taxon.code !== 'category')
    .filter((taxon) => (audience === 'dresser' ? isDresserTaxonCode(taxon.code) : !isDresserTaxonCode(taxon.code)))
    .map((taxon) => ({
      code: taxon.code,
      name: taxon.name,
      children: (taxon.enabledChildren || [])
        .filter((child) => child.enabled !== false)
        .map((child) => ({ code: child.code, name: child.name })),
    }));
}

function variantLabel(variant: SyliusVariant): string {
  const source = [variant?.name, variant?.code].find((value) => typeof value === 'string' && value.trim()) || '';
  if (!source) return variant?.id ? String(variant.id) : '';
  const match = source.match(/(\d+(?:[.,]\d+)?\s*(?:мл|ml|л|l))/i);
  return match ? match[1].replace(/\s+/g, '') : source;
}

function isRecentlyCreated(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt.replace(' ', 'T')).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 90 * 24 * 60 * 60 * 1000;
}

export function toCatalogProduct(product: SyliusProduct, opts?: { forceNew?: boolean }): CatalogProduct {
  const variants = (product.variants || []).filter(Boolean);
  const first = variants[0];
  const price = first ? formatSyliusPrice(first.price) : '0₮';
  const original =
    first && first.originalPrice && first.originalPrice > first.price
      ? formatSyliusPrice(first.originalPrice)
      : undefined;
  const pct = first?.promotionPercentage || 0;
  const images = (product.images || []).map(syliusImageUrl).filter(Boolean);
  const sizes: ProductSize[] = variants
    .map((variant) => ({
      label: variantLabel(variant),
      price: formatSyliusPrice(variant.price ?? 0),
      originalPrice:
        variant.originalPrice && variant.originalPrice > variant.price
          ? formatSyliusPrice(variant.originalPrice)
          : undefined,
    }))
    .filter((size) => size.label);

  return {
    id: product.code,
    name: product.name,
    category: product.mainTaxon?.name || 'ESTEL',
    brand: product.brand?.name || 'ESTEL',
    price,
    originalPrice: original,
    discount: pct > 0 ? `-${Math.round(pct)}%` : undefined,
    hit: Boolean(product.featured),
    isNew: Boolean(opts?.forceNew) || isRecentlyCreated(product.createdAt),
    image: images[0] || FALLBACK_PRODUCT_IMAGE,
    gallery: images.length ? images : [FALLBACK_PRODUCT_IMAGE],
    sizes: sizes.length ? sizes : undefined,
  };
}

export async function getSyliusProductsCollection(options?: {
  taxonCode?: string;
  page?: number;
  itemsPerPage?: number;
  sort?: ProductSort;
  audience?: 'consumer' | 'dresser';
}): Promise<SyliusProductCollection> {
  try {
    const params = new URLSearchParams();
    if (options?.taxonCode) {
      params.append('productTaxons.taxon.code', options.taxonCode);
    }
    params.append('page', String(options?.page || 1));
    params.append('itemsPerPage', String(options?.itemsPerPage || 12));

    const sort = options?.sort || 'newest';
    if (sort === 'price-asc') params.append('order[variants.price]', 'asc');
    else if (sort === 'price-desc') params.append('order[variants.price]', 'desc');
    else params.append('order[createdAt]', 'desc');

    const url = `${SYLIUS_BASE_URL}/api/v2/shop/products?${params.toString()}`;
    const res = await fetch(url, fetchOpts());
    if (!res.ok) {
      console.error('Failed to fetch Sylius products:', res.statusText);
      return { items: [], total: 0 };
    }

    const data = await res.json();
    let items = unwrapList<SyliusProduct>(data);
    const audience = options?.audience || 'consumer';
    items = items.filter((product) =>
      audience === 'dresser' ? isDresserProduct(product) : !isDresserProduct(product)
    );
    if (sort === 'onsale') {
      const discounted = items.filter((product) =>
        (product.variants || []).some(
          (variant) => (variant.promotionPercentage || 0) > 0 || (variant.originalPrice || 0) > variant.price
        )
      );
      if (discounted.length) items = discounted;
    }
    return { items, total: unwrapTotal(data, 0) };
  } catch (error) {
    console.error('Error fetching Sylius products:', error);
    return { items: [], total: 0 };
  }
}

export async function getSyliusProducts(options?: {
  taxonCode?: string;
  page?: number;
  itemsPerPage?: number;
  sort?: ProductSort;
  audience?: 'consumer' | 'dresser';
}): Promise<SyliusProduct[]> {
  const { items } = await getSyliusProductsCollection(options);
  return items;
}

export async function getSyliusProductByCode(code: string): Promise<SyliusProduct | null> {
  try {
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/products/${encodeURIComponent(code)}`, fetchOpts());
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching Sylius product ${code}:`, error);
    return null;
  }
}

export async function getSyliusTaxons(): Promise<SyliusTaxon[]> {
  try {
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/taxons`, fetchOpts(300));
    if (!res.ok) return [];
    return unwrapList<SyliusTaxon>(await res.json());
  } catch (error) {
    console.error('Error fetching Sylius taxons:', error);
    return [];
  }
}

function isOnSale(product: SyliusProduct): boolean {
  return (product.variants || []).some(
    (variant) => (variant.promotionPercentage || 0) > 0 || (variant.originalPrice || 0) > variant.price
  );
}

export async function getHomeCategoryPicks(): Promise<{
  newProducts: SyliusProduct[];
  saleProducts: SyliusProduct[];
}> {
  const packs = await Promise.all(
    CONSUMER_ROOT_TAXONS.map(async (taxonCode) => {
      const { items } = await getSyliusProductsCollection({
        taxonCode,
        itemsPerPage: 4,
        sort: 'newest',
        audience: 'consumer',
      });
      return items;
    })
  );

  const newProducts = packs.map((items) => items[0]).filter(Boolean);
  const used = new Set(newProducts.map((item) => item.code));
  const saleProducts = packs
    .map((items) => {
      const sale = items.find((item) => !used.has(item.code) && isOnSale(item));
      const next = items.find((item) => !used.has(item.code));
      return sale || next || items[0];
    })
    .filter(Boolean);

  return { newProducts, saleProducts };
}
