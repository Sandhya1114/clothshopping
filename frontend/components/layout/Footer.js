import Link from 'next/link';
import { footerGroups } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand-mark brand-mark-footer">
            <span>North</span>Stitch
          </Link>
          <p className="footer-copy">
            A modern clothing storefront starter with guest checkout, responsive UX, and a clean
            Express plus Supabase backend.
          </p>
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
    </footer>
  );
}
