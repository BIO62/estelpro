import { getHomeCategoryPicks, toHomePicksPayload } from '@/lib/api/sylius';

export const revalidate = 60;

export async function GET() {
  const picks = await getHomeCategoryPicks();
  return Response.json(toHomePicksPayload(picks));
}
