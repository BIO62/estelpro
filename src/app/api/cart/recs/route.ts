import { cookies } from 'next/headers';

import { DRESSER_COOKIE } from '@/lib/catalog-audience';
import { getSalonContractPercent } from '@/lib/auth/session';
import { getStorefrontProducts, toStorefrontProduct } from '@/lib/storefront-products';

export const dynamic = 'force-dynamic';

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exclude = new Set(
    (searchParams.get('exclude') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
  const cats = new Set(
    (searchParams.get('cats') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
  const dresser = (await cookies()).get(DRESSER_COOKIE)?.value === '1';
  const [{ items }, contractPercent] = await Promise.all([
    getStorefrontProducts({ audience: dresser ? 'dresser' : 'consumer' }),
    getSalonContractPercent(),
  ]);

  const products = items
    .filter((product) => !exclude.has(product.code) && !exclude.has(product.id) && product.price > 100)
    .map((product) => toStorefrontProduct(product, { contractPercent }))
    .sort((a, b) => {
      const aCat = cats.has(a.category) ? 1 : 0;
      const bCat = cats.has(b.category) ? 1 : 0;
      if (aCat !== bCat) return bCat - aCat;
      const aSale = a.discount ? 1 : 0;
      const bSale = b.discount ? 1 : 0;
      if (aSale !== bSale) return bSale - aSale;
      return hash(a.id) - hash(b.id);
    })
    .slice(0, 12);

  return Response.json({ products });
}
