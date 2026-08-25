import fs from 'fs';
import path from 'path';

import type { DbProduct } from '@/lib/ad/products-repo';

const CACHE_PATH = path.join(process.cwd(), 'data', 'products.json');

type CacheFile = {
  generated_at?: string;
  products: Array<Partial<DbProduct> & { code: string; name: string }>;
};

let memo: CacheFile | null = null;

function readCache(): CacheFile | null {
  if (memo) return memo;
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;
    const raw = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) as CacheFile;
    if (!Array.isArray(raw.products)) return null;
    memo = raw;
    return raw;
  } catch {
    return null;
  }
}

function toDb(p: CacheFile['products'][number]): DbProduct {
  return {
    id: p.id || p.code,
    code: p.code,
    sku: p.sku || p.code,
    name: p.name,
    slug: p.slug || p.code,
    price: Number(p.price) || 0,
    original_price: p.original_price != null ? Number(p.original_price) : null,
    stock: Number(p.stock) || 0,
    is_tax: p.is_tax !== false,
    brand: p.brand || null,
    taxon: p.taxon || null,
    taxons: Array.isArray(p.taxons) ? p.taxons : [],
    image_url: p.image_url || null,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    short_description: p.short_description || null,
    description: p.description || null,
    enabled: p.enabled !== false,
  };
}

export function listLocalProducts(opts?: {
  q?: string;
  taxon?: string;
  limit?: number;
  offset?: number;
}): { items: DbProduct[]; total: number; source: 'local' } | null {
  const cache = readCache();
  if (!cache) return null;

  let items = cache.products.filter((p) => p.enabled !== false).map(toDb);
  const q = opts?.q?.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q),
    );
  }
  if (opts?.taxon && opts.taxon !== 'ALL') {
    const t = opts.taxon;
    items = items.filter(
      (p) => p.taxon === t || (Array.isArray(p.taxons) && p.taxons.includes(t)),
    );
  }

  items.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  const total = items.length;
  const offset = opts?.offset ?? 0;
  const limit = opts?.limit ?? 100;
  return { items: items.slice(offset, offset + limit), total, source: 'local' };
}

export function listLocalTaxons(): string[] {
  const cache = readCache();
  if (!cache) return [];
  const set = new Set<string>();
  for (const p of cache.products) {
    if (p.enabled === false) continue;
    if (p.taxon) set.add(p.taxon);
    if (Array.isArray(p.taxons)) for (const t of p.taxons) if (t) set.add(t);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'mn'));
}
