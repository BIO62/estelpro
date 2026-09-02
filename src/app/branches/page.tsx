import BranchShowroom from '@/components/branches/branch-showroom';

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string | string[] }>;
}) {
  const params = await searchParams;
  const branch = Array.isArray(params.branch) ? params.branch[0] : params.branch;
  return <BranchShowroom initialBranchId={branch} />;
}
