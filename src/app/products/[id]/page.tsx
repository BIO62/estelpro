import { notFound } from 'next/navigation';
import ProductDetailView from './ProductDetailView';
import {
  getStorefrontCatalogProduct,
  getStorefrontProduct,
  getStorefrontProducts,
  isDresserStorefrontProduct,
  toStorefrontProduct,
} from '@/lib/storefront-products';
import { getSalonContractPercent } from '@/lib/auth/session';
import { richTextToHtml } from '@/lib/api/sylius';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const code = decodeURIComponent(id);
  const row = await getStorefrontProduct(code);
  const contractPercent = await getSalonContractPercent();
  const product = await getStorefrontCatalogProduct(code, { contractPercent, row });
  if (!product) notFound();

  const audience = row && isDresserStorefrontProduct(row) ? 'dresser' : 'consumer';
  const { items: relatedRaw } = await getStorefrontProducts({
    taxon: row?.taxon || undefined,
    audience,
  });
  const related = relatedRaw
    .filter((item) => item.code !== (row?.code || code))
    .slice(0, 4)
    .map((item) => toStorefrontProduct(item, { contractPercent }));

  return (
    <ProductDetailView
      product={product}
      related={related}
      description={richTextToHtml(row?.description || row?.short_description || product.shortDescription)}
      inStock={row?.stock}
    />
  );
}
