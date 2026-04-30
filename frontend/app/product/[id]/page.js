import PageHero from '@/components/layout/PageHero';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  return (
    <>
      <PageHero
        eyebrow="Product Detail"
        title="Closer look at the piece"
        text="Inspect sizing, stock, and styling details before adding the item to your cart."
      />
      <ProductDetailClient productId={resolvedParams.id} />
    </>
  );
}
