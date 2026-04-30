'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const initialState = {
  full_name: '',
  email: '',
  password: ''
};

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const { loginUser, signupUser, isAuthenticating } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  function updateField(key, value) {
    setFormData((currentData) => ({
      ...currentData,
      [key]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');

      if (isSignup) {
        await signupUser(formData);
      } else {
        await loginUser({
          email: formData.email,
          password: formData.password
        });
      }

      router.push('/account');
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="container section-spacing">
      <div className="auth-shell">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">{isSignup ? 'Create Account' : 'Welcome Back'}</span>
          <h1>{isSignup ? 'Sign up for a faster shopping flow' : 'Log in to your account'}</h1>
          <p>
            {isSignup
              ? 'Save your name for quicker checkout and unlock a cleaner returning-customer experience.'
              : 'Use your email and password to continue with your saved account.'}
          </p>

          {isSignup ? (
            <>
              <label htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(event) => updateField('full_name', event.target.value)}
                required
              />
            </>
          ) : null}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(event) => updateField('password', event.target.value)}
            minLength="6"
            required
          />

          {error ? <p className="status-message error-message">{error}</p> : null}

          <button type="submit" className="button button-primary" disabled={isAuthenticating}>
            {isAuthenticating
              ? isSignup
                ? 'Creating Account...'
                : 'Logging In...'
              : isSignup
                ? 'Sign Up'
                : 'Log In'}
          </button>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link href={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Log in here' : 'Create one here'}
            </Link>
          </p>
        </form>

        <div className="auth-side-panel">
          <span className="eyebrow">Account Benefits</span>
          <h2>Optional accounts, same clean storefront experience</h2>
          <div className="auth-benefit-list">
            <div>
              <strong>Faster checkout</strong>
              <p>Your name is prefilled when you return to place another order.</p>
            </div>
            <div>
              <strong>Guest mode still works</strong>
              <p>You can keep using the store without logging in if that fits the flow better.</p>
            </div>
            <div>
              <strong>Simple backend model</strong>
              <p>Accounts are stored in Supabase while auth logic stays in your Express API.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
