import CategoryPreview from '@/components/home/CategoryPreview';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HeroSection from '@/components/home/HeroSection';
import ValueStrip from '@/components/home/ValueStrip';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueStrip />
      <FeaturedProducts />
      <CategoryPreview />
    </>
  );
}
