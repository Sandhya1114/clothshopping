'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SectionTitle from '@/components/common/SectionTitle';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts({
          limit: 4,
          sort: 'price-high-low'
        });

        setProducts(response.products || []);
        setError('');
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="container section-spacing">
      <SectionTitle
        eyebrow="Featured"
        title="Best sellers with a polished, everyday edge"
        text="A quick entry point into the collection, pulled from the live products API."
      />

      {isLoading ? <LoadingSpinner label="Loading featured products..." /> : null}
      {error ? <p className="status-message error-message">{error}</p> : null}

      {!isLoading && !error ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
