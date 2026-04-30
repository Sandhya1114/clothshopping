import Link from 'next/link';
import { footerGroups } from '@/lib/site';

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 12h17M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7.5h16v9H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8l7.5 6 7.5-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4.5h14v15H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-luxe">
        <div className="footer-brand-column">
          <Link href="/" className="brand-mark brand-mark-footer">
            NorthStitch
          </Link>
          <p className="footer-copy">
            A refined storefront experience with the same live catalog, cart, account, and checkout
            flow already powering your shop.
          </p>
          <div className="footer-socials" aria-label="Connect">
            <Link href="/about" className="footer-icon-link" aria-label="About NorthStitch">
              <GlobeIcon />
            </Link>
            <Link href="/contact" className="footer-icon-link" aria-label="Contact NorthStitch">
              <MailIcon />
            </Link>
            <Link href="/faq" className="footer-icon-link" aria-label="Support notes">
              <NoteIcon />
            </Link>
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <div className="footer-links">
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© 2026 NorthStitch. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
