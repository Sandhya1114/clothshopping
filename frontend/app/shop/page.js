import ShopClient from '@/components/shop/ShopClient';

export default function ShopPage() {
  return (
    <ShopClient
      initialCategory="all"
      title="All Collections"
      description="Discover our curated selection of modern essentials and refine the results with the same live filters you already use."
    />
  );
}
