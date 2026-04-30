'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { categories, mainNav } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isLoggedIn, user, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(href) {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  }

  return (
    <header className="site-header">
      <div className="announcement-bar">
        New season essentials, guest checkout, and clean mobile-first shopping flow.
      </div>
      <div className="container header-shell">
        <Link href="/" className="brand-mark">
          <span>North</span>Stitch
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <Link href="/account" className="account-pill">
                {user.full_name.split(' ')[0]}
              </Link>
              <button type="button" className="account-pill account-logout" onClick={logoutUser}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="account-pill">
                Log In
              </Link>
              <Link href="/signup" className="account-pill account-pill-primary">
                Sign Up
              </Link>
            </>
          )}
          <Link href="/cart" className="cart-pill" aria-label={`Cart with ${itemCount} items`}>
            Cart <span>{itemCount}</span>
          </Link>
          <button
            type="button"
            className="menu-button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mobile-panel">
          <div className="container mobile-panel-inner">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? 'mobile-link active' : 'mobile-link'}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-category-links">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="category-chip"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="mobile-auth-links">
              {isLoggedIn ? (
                <>
                  <Link href="/account" className="category-chip" onClick={() => setIsMenuOpen(false)}>
                    Account
                  </Link>
                  <button
                    type="button"
                    className="category-chip chip-button"
                    onClick={() => {
                      logoutUser();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="category-chip" onClick={() => setIsMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link href="/signup" className="category-chip" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
