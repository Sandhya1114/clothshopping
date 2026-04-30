import PageHero from '@/components/layout/PageHero';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Simple guest checkout"
        text="Collect customer details, show the order summary, and save the order in Supabase."
      />
      <CheckoutClient />
    </>
  );
}
