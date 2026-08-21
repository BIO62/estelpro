import ProductCatalog from '@/components/catalog/ProductCatalog';

export default function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <ProductCatalog
      searchParams={searchParams}
      basePath="/new"
      forceNew
      defaultTitle="Шинэ бүтээгдэхүүн"
    />
  );
}
