import PageHero from '@/components/layout/PageHero';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        text="This project stores only the minimum guest checkout order data you define in the backend and database."
      />
      <section className="container prose-block section-spacing">
        <h2>Information collected</h2>
        <p>
          The checkout flow collects customer name, address, phone number, cart items, and total
          order value for order creation.
        </p>
        <h2>How data is used</h2>
        <p>
          Order data is stored in Supabase to support fulfillment and operational review. This
          starter does not include authentication or marketing consent collection.
        </p>
        <h2>Next steps</h2>
        <p>
          Before production, add your real privacy text, retention policy, cookie handling, and any
          required compliance notices for your region.
        </p>
      </section>
    </>
  );
}
