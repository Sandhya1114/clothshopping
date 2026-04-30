import PageHero from '@/components/layout/PageHero';

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NorthStitch"
        title="A storefront built around clarity, style, and momentum"
        text="This project pairs a bold presentation layer with a practical backend foundation you can keep extending."
      />
      <section className="container info-grid section-spacing">
        <article className="info-card">
          <h2>Design Direction</h2>
          <p>
            NorthStitch blends warm editorial styling with efficient storefront UX. The interface
            stays clean while still feeling deliberate and brand-led.
          </p>
        </article>
        <article className="info-card">
          <h2>Technical Stack</h2>
          <p>
            The frontend uses Next.js App Router and JavaScript, while the backend runs on Express
            and persists products and orders in Supabase PostgreSQL.
          </p>
        </article>
        <article className="info-card">
          <h2>Future Ready</h2>
          <p>
            The architecture is ready for payment integration, admin tooling, inventory workflows,
            and CMS-driven content when you want to push it further.
          </p>
        </article>
      </section>
    </>
  );
}
