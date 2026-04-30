'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const initialForm = {
  customer_name: '',
  address: '',
  phone: ''
};

export default function CheckoutClient() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart, isReady } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.full_name) {
      return;
    }

    setFormData((currentData) =>
      currentData.customer_name
        ? currentData
        : {
            ...currentData,
            customer_name: user.full_name
          }
    );
  }, [user]);

  function updateField(key, value) {
    setFormData((currentData) => ({
      ...currentData,
      [key]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');
      const response = await createOrder({
        ...formData,
        items: cartItems,
        total_price: subtotal
      });

      clearCart();
      router.push(`/order-confirmation?orderId=${response.order.id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return <div className="container section-spacing">Preparing checkout...</div>;
  }

  if (!cartItems.length) {
    return (
      <div className="container section-spacing">
        <EmptyState
          title="Your cart is empty"
          text="Add at least one item before checking out."
          actionHref="/shop"
          actionLabel="Browse products"
        />
      </div>
    );
  }

  return (
    <section className="container section-spacing">
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <span className="eyebrow">{user ? 'Signed-In Checkout' : 'Guest Checkout'}</span>
          <h1>Enter delivery details</h1>

          <label htmlFor="customer_name">Full name</label>
          <input
            id="customer_name"
            type="text"
            value={formData.customer_name}
            onChange={(event) => updateField('customer_name', event.target.value)}
            required
          />

          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            rows="4"
            value={formData.address}
            onChange={(event) => updateField('address', event.target.value)}
            required
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            required
          />

          {error ? <p className="status-message error-message">{error}</p> : null}

          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <aside className="summary-card">
          <span className="eyebrow">Summary</span>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="summary-line">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
