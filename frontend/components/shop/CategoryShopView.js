import ShopClient from '@/components/shop/ShopClient';
import { categories } from '@/lib/site';

export default function CategoryShopView({ slug }) {
  const category = categories.find((item) => item.slug === slug);

  return (
    <ShopClient
      initialCategory={slug}
      title={`${category?.title || 'Collection'} Collection`}
      description={category?.description || 'Explore curated products in this collection.'}
    />
  );
}
