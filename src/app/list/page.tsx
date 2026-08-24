import ProductCatalog from '@/components/catalog/ProductCatalog';

export const revalidate = 300;

export default function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ProductCatalog searchParams={searchParams} basePath="/list" defaultTitle="Бүх бүтээгдэхүүн" />;
}
