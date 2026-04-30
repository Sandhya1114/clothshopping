'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { categories, mainNav } from '@/lib/site';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 8.5h12l-.8 11.5H6.8L6 8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V7.6A3 3 0 0112 4.5a3 3 0 013 3.1V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19a6.5 6.5 0 0113 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

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
      <div className="container header-shell">
        <Link href="/" className="brand-mark">
          NorthStitch
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
          <Link href="/shop" className="header-icon-link" aria-label="Search products">
            <SearchIcon />
          </Link>
          <Link href="/cart" className="header-icon-link header-cart-link" aria-label={`Cart with ${itemCount} items`}>
            <BagIcon />
            <span className="header-icon-badge">{itemCount}</span>
          </Link>
          <Link
            href={isLoggedIn ? '/account' : '/login'}
            className="header-icon-link"
            aria-label={isLoggedIn ? `Account for ${user?.full_name || 'user'}` : 'Log in'}
          >
            <UserIcon />
          </Link>
          {isLoggedIn ? (
            <button type="button" className="header-text-link" onClick={logoutUser}>
              Log Out
            </button>
          ) : (
            <Link href="/signup" className="header-text-link">
              Join
            </Link>
          )}
          <button
            type="button"
            className="menu-button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <MenuIcon />
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
