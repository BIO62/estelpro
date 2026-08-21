import { redirect } from 'next/navigation';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  if (firstParam(sp.new) === '1') redirect('/new');

  const query = new URLSearchParams();
  const taxon = firstParam(sp.taxon);
  const sort = firstParam(sp.sort);
  const page = firstParam(sp.page);
  if (taxon) query.set('taxon', taxon);
  if (sort) query.set('sort', sort);
  if (page) query.set('page', page);
  const qs = query.toString();
  redirect(qs ? `/list?${qs}` : '/list');
}
