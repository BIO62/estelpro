import ProductCatalog from '@/components/catalog/ProductCatalog';

export const dynamic = 'force-dynamic';

export default function DresserListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProductCatalog
      searchParams={searchParams}
      basePath="/dresser/list"
      audience="dresser"
      defaultTitle="Үсчдийн каталог"
    />
  );
}
