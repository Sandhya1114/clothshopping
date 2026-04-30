'use client';

import Image from 'next/image';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/format';

export default function CartPageClient() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, isReady } = useCart();

  if (!isReady) {
    return <div className="container section-spacing">Loading your cart...</div>;
  }

  if (!cartItems.length) {
    return (
      <div className="container section-spacing">
        <EmptyState
          title="Your cart is empty"
          text="Browse the shop and add a few pieces to get started."
          actionHref="/shop"
          actionLabel="Go to shop"
        />
      </div>
    );
  }

  return (
    <section className="container section-spacing">
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={`${item.id}-${item.selectedSize}`}>
              <div className="cart-image">
                <Image src={item.image_url} alt={item.name} fill className="product-image" />
              </div>
              <div className="cart-item-copy">
                <div>
                  <h2>{item.name}</h2>
                  <p>Size: {item.selectedSize}</p>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
                <div className="cart-controls">
                  <label htmlFor={`quantity-${item.id}-${item.selectedSize}`}>Qty</label>
                  <input
                    id={`quantity-${item.id}-${item.selectedSize}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.id, item.selectedSize, Number(event.target.value))
                    }
                  />
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <span className="eyebrow">Order Summary</span>
          <h2>{formatCurrency(subtotal)}</h2>
          <p>Taxes and payment processing are intentionally left out of this starter flow.</p>
          <Link href="/checkout" className="button button-primary">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="button button-secondary">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
