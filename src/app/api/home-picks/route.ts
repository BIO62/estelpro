import { getHomeCategoryPicks, toHomePicksPayload } from '@/lib/api/sylius';
import { getSalonContractPercent } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const picks = await getHomeCategoryPicks();
  return Response.json(
    toHomePicksPayload(picks, { contractPercent: await getSalonContractPercent() }),
  );
}
