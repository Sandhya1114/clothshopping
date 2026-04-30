'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/format';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card luxe-product-card">
      <Link href={`/product/${product.id}`} className="product-image-link">
        <div className="product-image-frame">
          <Image src={product.image_url} alt={product.name} fill className="product-image" />
        </div>
      </Link>

      <div className="product-meta luxe-product-meta">
        <span className="product-category">{product.category}</span>
        <div className="product-title-row">
          <h3>
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          <span className="product-price">{formatCurrency(product.price)}</span>
        </div>
        <p className="product-card-description">{product.description}</p>
        <div className="size-badges">
          {(product.sizes || []).slice(0, 4).map((size) => (
            <span key={size}>{size}</span>
          ))}
        </div>
        <div className="product-card-actions luxe-card-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={() => addToCart(product, product.sizes?.[0])}
          >
            Add to Cart
          </button>
          <Link href={`/product/${product.id}`} className="button button-secondary">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
