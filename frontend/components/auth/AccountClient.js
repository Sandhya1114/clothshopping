'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AccountClient() {
  const { user, isReady, isLoggedIn, logoutUser } = useAuth();

  if (!isReady) {
    return <div className="container section-spacing">Loading account...</div>;
  }

  if (!isLoggedIn) {
    return (
      <section className="container section-spacing">
        <div className="auth-card">
          <span className="eyebrow">Account</span>
          <h1>You are not logged in</h1>
          <p>Sign in or create an account to use the new authentication flow.</p>
          <div className="product-card-actions">
            <Link href="/login" className="button button-primary">
              Log In
            </Link>
            <Link href="/signup" className="button button-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container section-spacing">
      <div className="account-grid">
        <div className="auth-card">
          <span className="eyebrow">Signed In</span>
          <h1>{user.full_name}</h1>
          <p>{user.email}</p>
          <p>Your account is active and ready to use with the current storefront flow.</p>
          <div className="product-card-actions">
            <Link href="/checkout" className="button button-primary">
              Go to Checkout
            </Link>
            <button type="button" className="button button-secondary" onClick={logoutUser}>
              Log Out
            </button>
          </div>
        </div>

        <div className="info-card">
          <span className="eyebrow">Current Scope</span>
          <h2>What this account feature does today</h2>
          <div className="auth-benefit-list">
            <div>
              <strong>Secure signup and login</strong>
              <p>Passwords are hashed in the backend before being stored in Supabase.</p>
            </div>
            <div>
              <strong>Session restore</strong>
              <p>Your token is kept in localStorage so the storefront can restore the session.</p>
            </div>
            <div>
              <strong>Checkout assist</strong>
              <p>Your saved name is reused in the checkout form to make ordering quicker.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
