import PageHero from '@/components/layout/PageHero';
import CartPageClient from '@/components/cart/CartPageClient';

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Review your selected pieces"
        text="Adjust quantity, remove products, and move forward to guest checkout."
      />
      <CartPageClient />
    </>
  );
}
