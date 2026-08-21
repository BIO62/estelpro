import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductDetailView from './ProductDetailView';
import {
  getSyliusProductByCode,
  getSyliusProducts,
  toCatalogProduct,
} from '@/lib/api/sylius';
import { DRESSER_COOKIE, isDresserProduct } from '@/lib/catalog-audience';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSyliusProductByCode(decodeURIComponent(id));
  if (!product) notFound();

  const dresserSession = (await cookies()).get(DRESSER_COOKIE)?.value === '1';
  if (isDresserProduct(product) && !dresserSession) notFound();

  const audience = isDresserProduct(product) ? 'dresser' : 'consumer';
  const relatedRaw = await getSyliusProducts({
    taxonCode: product.mainTaxon?.code,
    itemsPerPage: 8,
    sort: 'newest',
    audience,
  });
  const related = relatedRaw
    .filter((item) => item.code !== product.code)
    .slice(0, 4)
    .map((item) => toCatalogProduct(item));

  return (
    <ProductDetailView
      product={toCatalogProduct(product)}
      related={related}
      description={product.description || product.shortDescription}
      inStock={product.variants?.[0]?.onHand}
    />
  );
}
