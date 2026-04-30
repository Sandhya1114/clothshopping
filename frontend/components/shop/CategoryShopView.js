import PageHero from '@/components/layout/PageHero';
import ShopClient from '@/components/shop/ShopClient';
import { categories } from '@/lib/site';

export default function CategoryShopView({ slug }) {
  const category = categories.find((item) => item.slug === slug);

  return (
    <>
      <PageHero
        eyebrow={category?.accent || 'Category'}
        title={category?.title || 'Collection'}
        text={category?.description || 'Explore curated products in this collection.'}
      />
      <ShopClient initialCategory={slug} />
    </>
  );
}
