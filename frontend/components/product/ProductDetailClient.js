'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/product/ProductCard';
import { getProduct, getProducts } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const detailTabs = [
  { id: 'details', label: 'Product Details' },
  { id: 'sizing', label: 'Sizing' },
  { id: 'shipping', label: 'Shipping & Returns' }
];

function formatCategoryLabel(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ProductDetailClient({ productId }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
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
        setSelectedImageIndex(0);
        setActiveTab('details');

        try {
          const relatedResponse = await getProducts({
            category: item.category,
            limit: 4,
            page: 1
          });
          const nextRelatedProducts = (relatedResponse.products || [])
            .filter((relatedProduct) => String(relatedProduct.id) !== String(item.id))
            .slice(0, 4);

          setRelatedProducts(nextRelatedProducts);
        } catch (relatedError) {
          console.error(relatedError);
          setRelatedProducts([]);
        }

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

  const galleryImages = [product.image_url, product.image_url, product.image_url];
  const formattedCategory = formatCategoryLabel(product.category);

  return (
    <section className="product-page">
      <div className="container section-spacing">
        <nav className="breadcrumb-trail" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href={`/${product.category}`}>{formattedCategory}</Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid luxe-product-layout">
          <div className="product-gallery-shell">
            <div className="product-thumbnail-rail">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={
                    index === selectedImageIndex ? 'product-thumbnail active' : 'product-thumbnail'
                  }
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image src={image} alt={`${product.name} preview ${index + 1}`} fill className="product-image" />
                </button>
              ))}
            </div>

            <div className="product-detail-image luxe-product-image">
              <Image
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                fill
                className="product-image"
              />
            </div>
          </div>

          <div className="product-detail-copy luxe-product-copy">
            <span className="product-highlight">Editor&apos;s Choice</span>
            <div className="product-copy-head">
              <span className="product-category">{formattedCategory}</span>
              <h1>{product.name}</h1>
            </div>

            <div className="product-inline-meta">
              <span className="product-star-row" aria-hidden="true">
                ★★★★★
              </span>
              <span>{product.stock} available</span>
            </div>

            <p className="product-detail-price">{formatCurrency(product.price)}</p>
            <p>{product.description}</p>

            <div className="product-option-group">
              <span className="option-label">Size</span>
              <div className="product-size-options">
                {(product.sizes || ['ONE SIZE']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={selectedSize === size ? 'size-option active' : 'size-option'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-list luxe-detail-list">
              <div>
                <strong>Stock</strong>
                <span>{product.stock} available</span>
              </div>
              <div>
                <strong>Category</strong>
                <span>{formattedCategory}</span>
              </div>
              <div>
                <strong>Checkout</strong>
                <span>Guest checkout only</span>
              </div>
            </div>

            <div className="product-card-actions product-detail-actions">
              <button
                type="button"
                className="button button-primary product-detail-cart-button"
                onClick={() => addToCart(product, selectedSize)}
              >
                Add to Cart
              </button>
              <Link href="/shop" className="button button-secondary">
                Continue Shopping
              </Link>
            </div>

            <div className="product-benefits">
              <span>Live stock visibility</span>
              <span>Guest checkout ready</span>
              <span>Account support available</span>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          {detailTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'product-tab active' : 'product-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-tab-panel">
          {activeTab === 'details' ? (
            <div className="product-tab-content product-detail-content-grid">
              <div className="prose-block">
                <h2>Craftsmanship Meets Everyday Wear</h2>
                <p>{product.description}</p>
                <div className="product-feature-list">
                  <span>Category: {formattedCategory}</span>
                  <span>Sizes: {(product.sizes || ['ONE SIZE']).join(', ')}</span>
                  <span>Stock synced from your storefront backend</span>
                </div>
              </div>
              <div className="product-support-card">
                <h3>Designed Around Your Existing Store Flow</h3>
                <p>
                  This product page keeps your current cart action, live product lookup, and size
                  selection behavior while presenting them in a cleaner editorial layout.
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'sizing' ? (
            <div className="product-tab-content">
              <div className="product-feature-list">
                {(product.sizes || ['ONE SIZE']).map((size) => (
                  <span key={size}>Available in {size}</span>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === 'shipping' ? (
            <div className="product-tab-content">
              <p>
                Orders still use your existing guest checkout flow. Shipping policy, returns, and
                support links remain available in the footer and the rest of the storefront.
              </p>
            </div>
          ) : null}
        </div>

        {relatedProducts.length > 0 ? (
          <div className="related-products-section">
            <div className="related-products-heading">
              <div>
                <span className="eyebrow">Complete the Set</span>
                <h2>You may also like</h2>
              </div>
              <Link href={`/${product.category}`} className="related-link">
                View all
              </Link>
            </div>

            <div className="product-grid related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
