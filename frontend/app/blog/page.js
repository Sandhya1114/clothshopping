import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';
import { blogPosts } from '@/lib/site';

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Editorial notes from the collection"
        text="Optional content space for styling ideas, behind-the-scenes updates, and seasonal direction."
      />
      <section className="container blog-grid section-spacing">
        {blogPosts.map((post) => (
          <article key={post.slug} className="blog-card">
            <div className="blog-image">
              <Image src={post.image} alt={post.title} fill className="product-image" />
            </div>
            <span className="eyebrow">{post.date}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="button button-secondary">
              Read Article
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
