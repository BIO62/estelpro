import ProductCatalog from '@/components/catalog/ProductCatalog';

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
