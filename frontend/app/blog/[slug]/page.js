import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageHero from '@/components/layout/PageHero';
import { blogPosts } from '@/lib/site';

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const post = blogPosts.find((item) => item.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow="Journal Entry" title={post.title} text={post.excerpt} />
      <article className="container prose-block section-spacing">
        <div className="blog-detail-image">
          <Image src={post.image} alt={post.title} fill className="product-image" />
        </div>
        <p className="blog-date">{post.date}</p>
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </>
  );
}
