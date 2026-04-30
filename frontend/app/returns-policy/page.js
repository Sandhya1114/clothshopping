import PageHero from '@/components/layout/PageHero';

export default function ReturnsPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Returns"
        title="Returns policy"
        text="A customer-facing policy page for exchanges, return windows, and item condition expectations."
      />
      <section className="container prose-block section-spacing">
        <h2>Return window</h2>
        <p>
          Customers may request a return within 14 days of delivery for unworn items with original
          tags attached.
        </p>
        <h2>Condition requirements</h2>
        <p>
          Returned products should be clean, undamaged, and packaged safely. Final decisions can be
          made by your operations team after inspection.
        </p>
        <h2>How to request a return</h2>
        <p>
          Direct customers to your contact page or support email until a self-service returns portal
          is added.
        </p>
      </section>
    </>
  );
}
