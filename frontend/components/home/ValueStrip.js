import { valuePoints } from '@/lib/site';

export default function ValueStrip() {
  return (
    <section className="value-strip">
      <div className="container value-strip-grid">
        {valuePoints.map((point) => (
          <article key={point.title} className="value-card">
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
