import { unstable_cache } from 'next/cache';
import { FALLBACK_PRODUCT_IMAGE } from '@/lib/constants';
import type { CatalogProduct, ProductSize } from '@/lib/products';
import { CONSUMER_ROOT_TAXONS, isDresserProduct, isDresserTaxonCode } from '@/lib/catalog-audience';
import { applySalonDiscount } from '@/lib/auth/salon-discount';

const DATA_REVALIDATE = 300;

export const SYLIUS_BASE_URL = process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn';

export type ProductSort = 'random' | 'newest' | 'price-asc' | 'price-desc' | 'onsale';

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
  optionValues?: Array<string | { '@id'?: string; code?: string; value?: string }>;
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

function fetchOpts(): RequestInit {
  return {
    headers: { Accept: 'application/json' },
  };
}

export function syliusAmount(priceInCents: number): number {
  const n = Number(priceInCents);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n > 1_000_000 ? Math.round(n / 100) : n;
}

export function formatSyliusPrice(priceInCents: number): string {
  const amount = syliusAmount(priceInCents);
  if (!amount) return '0₮';
  return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
}

export function syliusImageUrl(image?: SyliusImage): string {
  return image?.medium || image?.originalImagePath || image?.thumbnail || '';
}

function flattenTaxons(taxons: SyliusTaxon[]): SyliusTaxon[] {
  const roots: SyliusTaxon[] = [];
  for (const taxon of taxons) {
    if (taxon.enabled === false) continue;
    if (taxon.code === 'category' || taxon.code === 'all_products') {
      for (const child of taxon.enabledChildren || []) {
        if (child.enabled !== false) roots.push(child);
      }
      continue;
    }
    roots.push(taxon);
  }
  return roots;
}

export function indexTaxons(taxons: SyliusTaxon[]): Map<string, MenuTaxon> {
  const byCode = new Map<string, MenuTaxon>();
  const visit = (nodes: SyliusTaxon[]) => {
    for (const taxon of nodes) {
      if (!taxon?.code) continue;
      byCode.set(taxon.code, {
        code: taxon.code,
        name: taxon.name,
        children: (taxon.enabledChildren || [])
          .filter((child) => child.enabled !== false)
          .map((child) => ({ code: child.code, name: child.name })),
      });
      visit(taxon.enabledChildren || []);
    }
  };
  visit(taxons);
  return byCode;
}

export function toMenuTaxons(
  taxons: SyliusTaxon[],
  audience: 'consumer' | 'dresser' = 'consumer'
): MenuTaxon[] {
  return flattenTaxons(taxons)
    .filter((taxon) => (audience === 'dresser' ? isDresserTaxonCode(taxon.code) : !isDresserTaxonCode(taxon.code)))
    .map((taxon) => ({
      code: taxon.code,
      name: taxon.name,
      children: (taxon.enabledChildren || [])
        .filter((child) => child.enabled !== false)
        .map((child) => ({ code: child.code, name: child.name })),
    }));
}

const VOLUME_RE = /(\d+(?:[.,]\d+)?)\s*(мл|ml|л|l|г|g)(?![a-zа-яё])/i;

function formatVolume(amount: string, unit: string) {
  const normalized = unit.toLowerCase();
  const mapped = normalized === 'ml' ? 'мл' : normalized === 'l' ? 'л' : normalized === 'g' ? 'г' : unit;
  return `${amount}${mapped}`;
}

function volumeFromText(text?: string | null) {
  const match = String(text || '').match(VOLUME_RE);
  return match ? formatVolume(match[1], match[2]) : '';
}

function volumeFromOption(variant: SyliusVariant) {
  const refs = (variant.optionValues || []).map(optionValueRef).join(' ');
  const fromText = volumeFromText(refs);
  if (fromText) return fromText;
  const dash = refs.match(/[-_/](\d{2,4})(?:ml|мл)?$/i);
  if (!dash) return '';
  const amount = Number(dash[1]);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  if (amount >= 1000 && amount % 1000 === 0) return `${amount / 1000}л`;
  return `${amount}мл`;
}

function variantLabel(variant: SyliusVariant): string {
  return (
    volumeFromText(variant?.name) ||
    volumeFromOption(variant) ||
    volumeFromText(variant?.code) ||
    ''
  );
}

function optionValueRef(value: string | { '@id'?: string; code?: string; value?: string } | undefined) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.code || value.value || value['@id'] || '';
}

function isEmbeddedVariant(value: unknown): value is SyliusVariant {
  if (!value || typeof value !== 'object') return false;
  const variant = value as SyliusVariant;
  return Boolean(variant.code) && typeof variant.price === 'number';
}

function isShadeVariant(variant: SyliusVariant): boolean {
  const refs = (variant.optionValues || []).map(optionValueRef).join(' ');
  if (/hair_color|colour|color|shade|өнгө/i.test(refs)) return true;
  const name = String(variant.name || '').trim();
  return /^\d{1,2}\s*[/.]\s*\d/.test(name);
}

function isSizeVariant(variant: SyliusVariant): boolean {
  return Boolean(variantLabel(variant));
}

const HAIR_LEVEL_HEX = [
  '#1a1a1a',
  '#1c1410',
  '#2a1b12',
  '#3d2317',
  '#5a3218',
  '#7a4a22',
  '#8f5d32',
  '#c4a06a',
  '#d4b896',
  '#e6d0ae',
  '#f0e2c4',
  '#f5ecd6',
  '#faf6ea',
];

export function shadeHexFromName(name: string): string {
  const match = String(name || '').match(/(\d{1,2})\s*[/.]\s*\d+/);
  if (match) {
    const level = Math.min(HAIR_LEVEL_HEX.length - 1, Number(match[1]));
    return HAIR_LEVEL_HEX[level] || HAIR_LEVEL_HEX[6];
  }
  let hash = 2166136261;
  for (let i = 0; i < name.length; i += 1) hash = Math.imul(hash ^ name.charCodeAt(i), 16777619);
  return HAIR_LEVEL_HEX[(hash >>> 0) % HAIR_LEVEL_HEX.length];
}

export async function getSyliusVariantsForProduct(code: string): Promise<SyliusVariant[]> {
  const items: SyliusVariant[] = [];
  let page = 1;
  while (page <= 20) {
    const params = new URLSearchParams();
    params.set('product', `/api/v2/shop/products/${code}`);
    params.set('itemsPerPage', '100');
    params.set('page', String(page));
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/product-variants?${params.toString()}`, {
      headers: { Accept: 'application/ld+json, application/json' },
    });
    if (!res.ok) break;
    const data = await res.json();
    const batch = unwrapList<SyliusVariant>(data).filter(isEmbeddedVariant);
    items.push(...batch);
    const total = unwrapTotal(data, items.length);
    if (batch.length === 0 || items.length >= total) break;
    page += 1;
  }
  return items;
}

export async function expandSyliusProduct(product: SyliusProduct): Promise<SyliusProduct> {
  const embedded = (product.variants || []).filter(isEmbeddedVariant);
  if (embedded.length > 0) return { ...product, variants: embedded };
  if (!product.code) return product;
  const variants = await getSyliusVariantsForProduct(product.code);
  return { ...product, variants };
}

function productTime(product: SyliusProduct): number {
  if (product.createdAt) {
    const created = new Date(product.createdAt.replace(' ', 'T')).getTime();
    if (!Number.isNaN(created)) return created;
  }
  return product.id || 0;
}

export function isRecentlyCreated(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt.replace(' ', 'T')).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 90 * 24 * 60 * 60 * 1000;
}

export function filterNewProducts(products: SyliusProduct[]): SyliusProduct[] {
  return [...products].sort((a, b) => productTime(b) - productTime(a));
}

export function sortSyliusProducts(products: SyliusProduct[], sort: ProductSort, seed = ''): SyliusProduct[] {
  const copy = [...products];
  if (sort === 'price-asc' || sort === 'price-desc') {
    copy.sort((a, b) => {
      const pa = a.variants?.[0]?.price ?? 0;
      const pb = b.variants?.[0]?.price ?? 0;
      return sort === 'price-asc' ? pa - pb : pb - pa;
    });
    return copy;
  }
  if (sort === 'onsale') {
    return copy.filter(isOnSale).sort((a, b) => productTime(b) - productTime(a));
  }
  if (sort === 'newest') {
    return copy.sort((a, b) => productTime(b) - productTime(a));
  }
  return seededShuffle(copy, seed || `${new Date().toISOString().slice(0, 10)}:${copy.length}`);
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const copy = [...items];
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  let t = hash >>> 0;
  const rand = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function richTextToHtml(value?: string | null) {
  const raw = String(value || '')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    .trim();
  if (!raw) return '';
  const jsonStart = raw.search(/[\[{]/);
  const looksLikeBlocks = jsonStart >= 0 && /monsieurbiz\.text|"content"\s*:/.test(raw);
  if (looksLikeBlocks || raw.startsWith('[') || raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(jsonStart > 0 ? raw.slice(jsonStart) : raw) as
        | Array<{ data?: { content?: string }; content?: string }>
        | { data?: { content?: string }; content?: string };
      const blocks = Array.isArray(parsed) ? parsed : [parsed];
      const html = blocks
        .map((block) => String(block?.data?.content ?? block?.content ?? '').trim())
        .filter(Boolean)
        .join('');
      if (html) {
        if (/<[a-z][\s\S]*>/i.test(html)) return html;
        return html
          .split(/\n{2,}/)
          .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`)
          .join('');
      }
    } catch {
      const nested = raw.match(/"content"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (nested) {
        try {
          return JSON.parse(`"${nested[1]}"`);
        } catch {
          return nested[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        }
      }
    }
  }
  return raw;
}

function stripHtml(value?: string) {
  return richTextToHtml(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toCatalogProduct(
  product: SyliusProduct,
  opts?: { forceNew?: boolean; contractPercent?: number },
): CatalogProduct {
  const variants = (product.variants || []).filter(Boolean);
  const embedded = variants.filter(isEmbeddedVariant);
  const first = embedded[0];
  const percent = opts?.contractPercent || 0;
  const saleAmount = (amount: number) => (percent ? applySalonDiscount(amount, percent) : amount);
  const price = first ? formatSyliusPrice(saleAmount(first.price)) : '0₮';
  const original = first
    ? percent
      ? formatSyliusPrice(first.price)
      : first.originalPrice && first.originalPrice > first.price
        ? formatSyliusPrice(first.originalPrice)
        : undefined
    : undefined;
  const pct = first?.promotionPercentage || 0;
  const images = (product.images || []).map(syliusImageUrl).filter(Boolean);
  const shadeVariants = embedded.filter(isShadeVariant);
  const sizeVariants = embedded.filter((variant) => !isShadeVariant(variant) && (isSizeVariant(variant) || shadeVariants.length === 0));
  const sizes: ProductSize[] = (shadeVariants.length ? sizeVariants : embedded)
    .filter((variant) => !isShadeVariant(variant) || shadeVariants.length === 0)
    .map((variant) => ({
      label: variantLabel(variant),
      price: formatSyliusPrice(saleAmount(variant.price ?? 0)),
      originalPrice: percent
        ? formatSyliusPrice(variant.price ?? 0)
        : variant.originalPrice && variant.originalPrice > variant.price
          ? formatSyliusPrice(variant.originalPrice)
          : undefined,
    }))
    .filter((size) => size.label);
  const uniqueSizes = sizes.filter((size, index, list) => list.findIndex((entry) => entry.label === size.label) === index);
  const shades = shadeVariants
    .map((variant) => {
      const name = String(variant.name || variant.code || '').trim();
      const shadePrice = formatSyliusPrice(saleAmount(variant.price ?? 0));
      return {
        id: variant.code,
        name,
        hex: shadeHexFromName(name),
        price: shadePrice,
        originalPrice: percent
          ? formatSyliusPrice(variant.price ?? 0)
          : variant.originalPrice && variant.originalPrice > variant.price
            ? formatSyliusPrice(variant.originalPrice)
            : undefined,
      };
    })
    .filter((shade) => shade.name)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));

  return {
    id: product.code,
    name: product.name,
    category: product.mainTaxon?.name || 'ESTEL',
    brand: product.brand?.name || 'ESTEL',
    price,
    originalPrice: original,
    discount: percent ? `-${percent}%` : pct > 0 ? `-${Math.round(pct)}%` : undefined,
    hit: Boolean(product.featured),
    isNew: Boolean(opts?.forceNew) || isRecentlyCreated(product.createdAt),
    image: images[0] || FALLBACK_PRODUCT_IMAGE,
    gallery: images.length ? images : [FALLBACK_PRODUCT_IMAGE],
    sizes: shadeVariants.length ? (uniqueSizes.length > 1 ? uniqueSizes : undefined) : uniqueSizes.length ? uniqueSizes : undefined,
    shades: shades.length ? shades : undefined,
    shortDescription: stripHtml(product.shortDescription || product.description),
  };
}

export async function getSyliusProductsCollection(options?: {
  taxonCode?: string;
  brandCode?: string;
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
    if (options?.brandCode) {
      params.append('brand.code', options.brandCode);
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

async function loadAllSyliusProducts(taxonCode: string, audience: 'consumer' | 'dresser'): Promise<SyliusProduct[]> {
  try {
    const itemsPerPage = 100;
    const collected: SyliusProduct[] = [];

    const first = await fetchShopProductsPage({
      taxonCode: taxonCode || undefined,
      page: 1,
      itemsPerPage,
    });
    collected.push(...first.items);

    const totalPages = Math.min(15, Math.max(1, Math.ceil((first.total || first.items.length) / itemsPerPage)));
    if (totalPages > 1) {
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          fetchShopProductsPage({
            taxonCode: taxonCode || undefined,
            page: index + 2,
            itemsPerPage,
          })
        )
      );
      for (const page of rest) collected.push(...page.items);
    }

    const seen = new Set<string>();
    return collected.filter((product) => {
      if (!product?.code || seen.has(product.code)) return false;
      seen.add(product.code);
      return audience === 'dresser' ? isDresserProduct(product) : !isDresserProduct(product);
    });
  } catch (error) {
    console.error('loadAllSyliusProducts error:', error);
    return [];
  }
}

export async function getAllSyliusProducts(options?: {
  taxonCode?: string;
  audience?: 'consumer' | 'dresser';
}): Promise<SyliusProduct[]> {
  const taxonCode = options?.taxonCode || '';
  const audience = options?.audience || 'consumer';
  return unstable_cache(
    () => loadAllSyliusProducts(taxonCode, audience),
    ['sylius-catalog', taxonCode, audience],
    { revalidate: DATA_REVALIDATE }
  )();
}

async function fetchShopProductsPage(options: {
  taxonCode?: string;
  page: number;
  itemsPerPage: number;
}): Promise<SyliusProductCollection> {
  try {
    const params = new URLSearchParams();
    if (options.taxonCode) params.append('productTaxons.taxon.code', options.taxonCode);
    params.append('page', String(options.page));
    params.append('itemsPerPage', String(options.itemsPerPage));
    params.append('order[createdAt]', 'desc');
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/products?${params.toString()}`, fetchOpts());
    if (!res.ok) return { items: [], total: 0 };
    const data = await res.json();
    return { items: unwrapList<SyliusProduct>(data), total: unwrapTotal(data, 0) };
  } catch (error) {
    console.error('fetchShopProductsPage error:', error);
    return { items: [], total: 0 };
  }
}

export async function getSyliusProductByCode(code: string): Promise<SyliusProduct | null> {
  try {
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/products/${encodeURIComponent(code)}`, fetchOpts());
    if (!res.ok) return null;
    const product = (await res.json()) as SyliusProduct;
    return expandSyliusProduct(product);
  } catch (error) {
    console.error(`Error fetching Sylius product ${code}:`, error);
    return null;
  }
}

export async function getSyliusTaxons(): Promise<SyliusTaxon[]> {
  return unstable_cache(
    async () => {
      try {
        const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/taxons`, fetchOpts());
        if (!res.ok) return [];
        return unwrapList<SyliusTaxon>(await res.json());
      } catch (error) {
        console.error('Error fetching Sylius taxons:', error);
        return [];
      }
    },
    ['sylius-taxons'],
    { revalidate: DATA_REVALIDATE }
  )();
}

function isOnSale(product: SyliusProduct): boolean {
  return (product.variants || []).some(
    (variant) => (variant.promotionPercentage || 0) > 0 || (variant.originalPrice || 0) > variant.price
  );
}

function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

async function loadHomeProductPool(): Promise<SyliusProduct[]> {
  const packs = await Promise.all(
    CONSUMER_ROOT_TAXONS.map(async (taxonCode) => {
      const { items } = await getSyliusProductsCollection({
        taxonCode,
        itemsPerPage: 16,
        sort: 'newest',
        audience: 'consumer',
      });
      return items;
    })
  );

  const seen = new Set<string>();
  const pool: SyliusProduct[] = [];
  for (const items of packs) {
    for (const item of items) {
      if (!item?.code || seen.has(item.code)) continue;
      seen.add(item.code);
      pool.push(item);
    }
  }
  return pool;
}

async function getHomeProductPool(): Promise<SyliusProduct[]> {
  return unstable_cache(loadHomeProductPool, ['sylius-home-pool'], { revalidate: DATA_REVALIDATE })();
}

export async function getHomeCategoryPicks(): Promise<{
  newProducts: SyliusProduct[];
  saleProducts: SyliusProduct[];
}> {
  const pool = await getHomeProductPool();
  const newProducts = pickRandom(pool, 5);
  const used = new Set(newProducts.map((item) => item.code));
  const salePool = pool.filter((item) => !used.has(item.code));
  const discounted = salePool.filter(isOnSale);
  const saleProducts = pickRandom(discounted.length >= 8 ? discounted : salePool, 8);
  return { newProducts, saleProducts };
}

const BESTSELLER_CODES = ['18plus_spray', '18plus_shampoo'];
const BESTSELLER_COPY: Record<string, string> = {
  '18plus_spray': '18 төрлийн арчилгаа + дулааны хамгаалалт + UV хамгаалалт',
  '18plus_shampoo': '18 төрлийн арчилгаа + дулааны хамгаалалт + UV хамгаалалт',
};

export async function getBestsellerProducts(options?: { contractPercent?: number }): Promise<CatalogProduct[]> {
  const found = await Promise.all(BESTSELLER_CODES.map((code) => getSyliusProductByCode(code)));
  return found
    .filter((item): item is SyliusProduct => Boolean(item))
    .map((item) => {
      const product = toCatalogProduct(item, { contractPercent: options?.contractPercent || 0 });
      const fallbackPrice = BESTSELLER_COPY[item.code] ? '17,000₮' : product.price;
      return {
        ...product,
        shortDescription: product.shortDescription || BESTSELLER_COPY[item.code] || product.shortDescription,
        price: !product.price || product.price === '0₮' ? fallbackPrice : product.price,
      };
    });
}

export function toHomePicksPayload(
  picks: { newProducts: SyliusProduct[]; saleProducts: SyliusProduct[] },
  options?: { contractPercent?: number },
) {
  const contractPercent = options?.contractPercent || 0;
  return {
    newProducts: picks.newProducts.map((item) => toCatalogProduct(item, { forceNew: true, contractPercent })),
    saleProducts: picks.saleProducts
      .map((item) => toCatalogProduct(item, { contractPercent }))
      .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index),
  };
}
