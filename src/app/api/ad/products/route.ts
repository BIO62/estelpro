import { NextResponse } from 'next/server';

import { listProducts, listTaxons } from '@/lib/ad/products-repo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const taxon = searchParams.get('taxon') || undefined;
  const limit = Number(searchParams.get('limit') || 200);
  const offset = Number(searchParams.get('offset') || 0);
  const withTaxons = searchParams.get('taxons') === '1';

  const [{ items, total, source }, taxons] = await Promise.all([
    listProducts({ q, taxon, limit, offset }),
    withTaxons ? listTaxons() : Promise.resolve([] as string[]),
  ]);

  return NextResponse.json({
    source,
    total,
    taxons,
    results: items.map((row) => ({
      id: row.id,
      code: row.code,
      sku: row.sku || row.code,
      name: row.name,
      price: Number(row.price) || 0,
      originalPrice: row.original_price != null ? Number(row.original_price) : null,
      stock: row.stock ?? 0,
      inStock: (row.stock ?? 0) > 0,
      category: row.taxon || '—',
      brand: row.brand || '',
      image: row.image_url || '',
      taxons: row.taxons || [],
      isTax: row.is_tax !== false,
    })),
  });
}
