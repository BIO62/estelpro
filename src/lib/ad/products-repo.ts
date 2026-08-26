import { listLocalProducts, listLocalTaxons } from '@/lib/ad/products-local';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';

export type DbProduct = {
  id: string;
  code: string;
  sku: string | null;
  name: string;
  slug: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  is_tax: boolean;
  brand: string | null;
  taxon: string | null;
  taxons?: string[] | null;
  image_url: string | null;
  gallery: string[] | null;
  short_description: string | null;
  description: string | null;
  enabled: boolean;
};

export async function listProducts(opts?: {
  q?: string;
  taxon?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: DbProduct[]; total: number; source: 'supabase' | 'local' | 'empty' }> {
  if (isSupabaseConfigured()) {
    const db = supabaseAdmin();
    if (db) {
      const limit = opts?.limit ?? 100;
      const offset = opts?.offset ?? 0;
      const q = opts?.q?.trim();

      let query = db
        .from('products')
        .select(
          'id, code, sku, name, slug, price, original_price, stock, is_tax, brand, taxon, taxons, image_url, gallery, short_description, description, enabled',
          { count: 'exact' },
        )
        .eq('enabled', true)
        .order('name')
        .range(offset, offset + limit - 1);

      if (q) {
        const cleanQ = q.replace(/[,()]/g, ' ').trim();
        if (cleanQ) {
          query = query.or(`name.ilike.%${cleanQ}%,sku.ilike.%${cleanQ}%,code.ilike.%${cleanQ}%`);
        }
      }
      if (opts?.taxon && opts.taxon !== 'ALL') {
        query = query.or(`taxon.eq.${opts.taxon},taxons.cs.["${opts.taxon}"]`);
      }

      const { data, error, count } = await query;
      if (!error && data && data.length > 0) {
        return {
          items: data as DbProduct[],
          total: count ?? data.length,
          source: 'supabase',
        };
      }

      if (!error && (count ?? 0) === 0) {
        // table exists but empty → fall through to local cache
      } else if (error && !/schema cache|does not exist|Could not find/i.test(error.message)) {
        const fallback = await db
          .from('products')
          .select(
            'id, code, sku, name, slug, price, original_price, stock, is_tax, brand, taxon, image_url, gallery, short_description, description, enabled',
            { count: 'exact' },
          )
          .eq('enabled', true)
          .order('name')
          .range(offset, offset + limit - 1);
        if (!fallback.error && fallback.data && fallback.data.length > 0) {
          return {
            items: fallback.data as DbProduct[],
            total: fallback.count ?? 0,
            source: 'supabase',
          };
        }
      }
    }
  }

  const local = listLocalProducts(opts);
  if (local) return local;
  return { items: [], total: 0, source: 'empty' };
}

export async function listTaxons(): Promise<string[]> {
  if (isSupabaseConfigured()) {
    const db = supabaseAdmin();
    if (db) {
      const { data, error } = await db
        .from('products')
        .select('taxon')
        .eq('enabled', true)
        .not('taxon', 'is', null);
      if (!error && data && data.length) {
        const set = new Set<string>();
        for (const row of data) {
          if (row.taxon) set.add(row.taxon);
        }
        return [...set].sort();
      }
    }
  }
  return listLocalTaxons();
}
