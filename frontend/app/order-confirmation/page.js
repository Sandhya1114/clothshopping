import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';

export default async function OrderConfirmationPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams?.orderId;

  return (
    <>
      <PageHero
        eyebrow="Order Confirmed"
        title="Thanks for your order"
        text="Your guest checkout has been saved successfully and is ready for your next fulfillment step."
      />
      <section className="container section-spacing">
        <div className="confirmation-card">
          <h2>Confirmation details</h2>
          <p>
            Your order reference is <strong>#{orderId || 'Pending'}</strong>.
          </p>
          <p>
            This starter saves orders in Supabase and leaves payment, shipping notifications, and
            admin tooling ready for your next iteration.
          </p>
          <div className="product-card-actions">
            <Link href="/shop" className="button button-primary">
              Keep Shopping
            </Link>
            <Link href="/" className="button button-secondary">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
