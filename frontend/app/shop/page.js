import PageHero from '@/components/layout/PageHero';
import ShopClient from '@/components/shop/ShopClient';

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop All"
        title="Browse the full collection"
        text="Search, filter, and sort products with live results coming from the Express API."
      />
      <ShopClient initialCategory="all" />
    </>
  );
}
