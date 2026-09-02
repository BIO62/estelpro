import { NextResponse } from 'next/server';

import { getSalonContractPercent } from '@/lib/auth/session';
import { getStorefrontProducts, toStorefrontProduct } from '@/lib/storefront-products';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || '';
  if (q.length < 1) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const contractPercent = await getSalonContractPercent();
  const { items } = await getStorefrontProducts({
    q,
    audience: 'consumer',
    limit: 48,
  });
  const hits = items.slice(0, 12).map((row) => {
    const product = toStorefrontProduct(row, { contractPercent });
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      brand: product.brand || null,
    };
  });

  return NextResponse.json({ items: hits, total: items.length });
}
