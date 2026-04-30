import PageHero from '@/components/layout/PageHero';
import { faqItems } from '@/lib/site';

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers to the most common questions"
        text="A straightforward support page that explains shipping, checkout, sizing, and next-step integration points."
      />
      <section className="container faq-list section-spacing">
        {faqItems.map((item) => (
          <article key={item.question} className="faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </>
  );
}
