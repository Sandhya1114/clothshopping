import PageHero from '@/components/layout/PageHero';

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms and conditions"
        text="These placeholder policies are ready to be replaced with your legal team’s final wording."
      />
      <section className="container prose-block section-spacing">
        <h2>Use of the store</h2>
        <p>
          By using this website, customers agree to provide accurate checkout information and use
          the storefront only for lawful purchasing activity.
        </p>
        <h2>Product information</h2>
        <p>
          We aim to keep pricing, stock, and imagery accurate, but product availability and content
          may change without notice as the catalog updates.
        </p>
        <h2>Orders</h2>
        <p>
          Orders submitted through guest checkout are subject to review and fulfillment. You can add
          payment capture and fulfillment automation later in the workflow.
        </p>
      </section>
    </>
  );
}
