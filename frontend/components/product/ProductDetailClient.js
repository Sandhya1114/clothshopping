'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { getProduct } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function ProductDetailClient({ productId }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const response = await getProduct(productId);
        const item = response.product;

        setProduct(item);
        setSelectedSize(item.sizes?.[0] || 'ONE SIZE');
        setError('');
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (isLoading) {
    return <LoadingSpinner label="Loading product..." />;
  }

  if (error || !product) {
    return (
      <section className="container section-spacing">
        <p className="status-message error-message">{error || 'Product not found'}</p>
        <Link href="/shop" className="button button-primary">
          Back to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="container section-spacing">
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <Image src={product.image_url} alt={product.name} fill className="product-image" />
        </div>

        <div className="product-detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatCurrency(product.price)}</p>
          <p>{product.description}</p>

          <div className="detail-panel">
            <label htmlFor="size">Select size</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
            >
              {(product.sizes || ['ONE SIZE']).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="detail-list">
            <div>
              <strong>Stock</strong>
              <span>{product.stock} available</span>
            </div>
            <div>
              <strong>Category</strong>
              <span>{product.category}</span>
            </div>
            <div>
              <strong>Checkout</strong>
              <span>Guest checkout only</span>
            </div>
          </div>

          <div className="product-card-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => addToCart(product, selectedSize)}
            >
              Add to Cart
            </button>
            <Link href="/shop" className="button button-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
