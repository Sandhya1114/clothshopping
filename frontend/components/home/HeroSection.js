import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Modern Essentials</span>
          <h1>Clothing collections designed to feel sharp, wearable, and effortless.</h1>
          <p>
            Explore a polished storefront experience with curated product discovery, fast guest
            checkout, and a clean mobile-first shopping journey.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-primary">
              Shop Collection
            </Link>
            <Link href="/about" className="button button-secondary">
              Our Story
            </Link>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>120+</strong>
              <span>daily-ready looks</span>
            </div>
            <div>
              <strong>4</strong>
              <span>signature categories</span>
            </div>
            <div>
              <strong>Guest</strong>
              <span>checkout enabled</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card hero-card-large">
            <span>Season Edit</span>
            <p>Tailored layers, soft textures, and statement accessories.</p>
          </div>
          <div className="hero-card hero-card-small">
            <span>Mobile First</span>
            <p>Built for smooth browsing across phone, tablet, and desktop.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
