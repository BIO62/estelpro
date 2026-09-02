'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HELP_NAV_LINKS } from '@/lib/branches';

export function HelpMobileNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {HELP_NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`btn btn-sm fs-13 py-2 text-start${pathname === link.href ? ' fw-semibold fc-main' : ' fc-secondary'}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function HelpSideNav() {
  const pathname = usePathname();

  return (
    <nav className="d-flex flex-column">
      {HELP_NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`side-nav-item${pathname === link.href ? ' active' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
