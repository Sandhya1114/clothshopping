export default function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
