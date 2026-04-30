import { notFound } from 'next/navigation';
import CategoryShopView from '@/components/shop/CategoryShopView';
import { categories } from '@/lib/site';

export default async function ShopCategoryPage({ params }) {
  const resolvedParams = await params;
  const category = categories.find((item) => item.slug === resolvedParams.category);

  if (!category) {
    notFound();
  }

  return <CategoryShopView slug={resolvedParams.category} />;
}
