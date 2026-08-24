import HeroSlider from '@/components/sections/HeroSlider';
import VideoReels from '@/components/sections/VideoReels';
import FeaturedBanner from '@/components/sections/FeaturedBanner';
import HomePicks from '@/components/sections/HomePicks';
import BranchesSlider from '@/components/sections/BranchesSlider';
import AcademyBanner from '@/components/sections/AcademyBanner';
import { getHomeCategoryPicks, toHomePicksPayload } from '@/lib/api/sylius';

export const revalidate = 300;

export default async function HomePage() {
  const picks = toHomePicksPayload(await getHomeCategoryPicks());

  return (
    <>
      <HeroSlider />
      <VideoReels />
      <FeaturedBanner />
      <HomePicks newProducts={picks.newProducts} saleProducts={picks.saleProducts} />
      <BranchesSlider />
      <AcademyBanner />
    </>
  );
}
