import { NextResponse } from 'next/server';

import { listProducts } from '@/lib/ad/products-repo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  const { items, source } = await listProducts({
    q: q || undefined,
    limit: q ? 24 : 12,
  });

  return NextResponse.json({
    source,
    results: items.map((row) => ({
      id: row.code,
      sku: row.sku || row.code,
      title: row.name,
      price: Number(row.price) || 0,
      isTax: row.is_tax !== false,
      stock: row.stock ?? 0,
      image: row.image_url || undefined,
    })),
  });
}
