import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import { categories } from '@/lib/site';

export default function CategoryPreview() {
  return (
    <section className="container section-spacing">
      <SectionTitle
        eyebrow="Browse Categories"
        title="Explore every corner of the collection"
        text="From tailored menswear to playful kids pieces and finishing accessories, each category has its own mood and pace."
      />

      <div className="category-grid">
        {categories.map((category) => (
          <Link href={`/${category.slug}`} className="category-card" key={category.slug}>
            <div className="category-image-wrap">
              <Image src={category.image} alt={category.title} fill className="category-image" />
            </div>
            <div className="category-card-body">
              <span>{category.accent}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
