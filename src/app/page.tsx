import HeroSlider from '@/components/sections/HeroSlider';
import VideoReels from '@/components/sections/VideoReels';
import FeaturedBanner from '@/components/sections/FeaturedBanner';
import NewProducts from '@/components/sections/NewProducts';
import BestsellerSlider from '@/components/sections/BestsellerSlider';
import SaleProducts from '@/components/sections/SaleProducts';
import BranchesSlider from '@/components/sections/BranchesSlider';
import AcademyBanner from '@/components/sections/AcademyBanner';
import { getHomeCategoryPicks, toCatalogProduct } from '@/lib/api/sylius';

export default async function HomePage() {
  const { newProducts: newRaw, saleProducts: saleRaw } = await getHomeCategoryPicks();
  const newProducts = newRaw.map((item) => toCatalogProduct(item, { forceNew: true }));
  const saleProducts = saleRaw
    .map((item) => toCatalogProduct(item))
    .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index);

  return (
    <>
      <HeroSlider />
      <VideoReels />
      <FeaturedBanner />
      <NewProducts products={newProducts} />
      <BestsellerSlider />
      <SaleProducts products={saleProducts} />
      <BranchesSlider />
      <AcademyBanner />
    </>
  );
}
