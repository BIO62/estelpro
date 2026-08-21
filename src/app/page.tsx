import HeroSlider from '@/components/sections/HeroSlider';
import VideoReels from '@/components/sections/VideoReels';
import FeaturedBanner from '@/components/sections/FeaturedBanner';
import NewProducts from '@/components/sections/NewProducts';
import BestsellerSlider from '@/components/sections/BestsellerSlider';
import SaleProducts from '@/components/sections/SaleProducts';
import BranchesSlider from '@/components/sections/BranchesSlider';
import AcademyBanner from '@/components/sections/AcademyBanner';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <VideoReels />
      <FeaturedBanner />
      <NewProducts />
      <BestsellerSlider />
      <SaleProducts />
      <BranchesSlider />
      <AcademyBanner />
    </>
  );
}
