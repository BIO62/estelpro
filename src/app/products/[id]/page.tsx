import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductDetailView from './ProductDetailView';
import {
  getStorefrontProduct,
  getStorefrontProducts,
  isDresserStorefrontProduct,
  toStorefrontProduct,
} from '@/lib/storefront-products';
import { DRESSER_COOKIE } from '@/lib/catalog-audience';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getStorefrontProduct(decodeURIComponent(id));
  if (!product) notFound();

  const dresserSession = (await cookies()).get(DRESSER_COOKIE)?.value === '1';
  if (isDresserStorefrontProduct(product) && !dresserSession) notFound();

  const audience = isDresserStorefrontProduct(product) ? 'dresser' : 'consumer';
  const { items: relatedRaw } = await getStorefrontProducts({
    taxon: product.taxon || undefined,
    audience,
  });
  const related = relatedRaw
    .filter((item) => item.code !== product.code)
    .slice(0, 4)
    .map((item) => toStorefrontProduct(item));

  return (
    <ProductDetailView
      product={toStorefrontProduct(product)}
      related={related}
      description={product.description || product.short_description || undefined}
      inStock={product.stock}
    />
  );
}
