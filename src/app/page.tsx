import HeroSlider from '@/components/sections/HeroSlider';
import VideoReels from '@/components/sections/VideoReels';
import FeaturedBanner from '@/components/sections/FeaturedBanner';
import HomePicks from '@/components/sections/HomePicks';
import BranchesSlider from '@/components/sections/BranchesSlider';
import AcademyBanner from '@/components/sections/AcademyBanner';
import { getBestsellerProducts, getHomeCategoryPicks, toHomePicksPayload } from '@/lib/api/sylius';
import { getSalonContractPercent } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const contractPercent = await getSalonContractPercent();
  const picks = toHomePicksPayload(await getHomeCategoryPicks(), { contractPercent });
  const bestsellers = await getBestsellerProducts({ contractPercent });

  return (
    <div className="home-stack">
      <HeroSlider />
      <VideoReels />
      <FeaturedBanner />
      <HomePicks
        newProducts={picks.newProducts}
        saleProducts={picks.saleProducts}
        bestsellers={bestsellers}
      />
      <BranchesSlider />
      <AcademyBanner />
    </div>
  );
}
