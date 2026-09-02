'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assetUrl } from '@/lib/constants';
import { DRESSER_COOKIE } from '@/lib/catalog-audience';
import type { PublicUser } from '@/lib/auth/types';

const PROMO_MESSAGES = [
  'Хот дотор 80,000₮ дээш худалдан авалтанд хүргэлт үнэгүй',
  '300,000₮ дээш худалдан авалтанд бэлэгтэй',
];

export default function PromoBar() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role === 'salon' || data.user.kind === 'salon') {
            document.cookie = `${DRESSER_COOKIE}=1; path=/; max-age=2592000; samesite=lax`;
          }
        }
      })
      .catch(() => {});

    const timer = window.setInterval(() => {
      setFading(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
        setFading(false);
      }, 500);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const isSalon = user?.role === 'salon' || user?.kind === 'salon';
  const message =
    isSalon && typeof user?.discountPercent === 'number'
      ? `Салоны хөнгөлөлт ${user.discountPercent}%`
      : PROMO_MESSAGES[index];

  let action: ReactNode = null;
  if (isSalon) {
    action = (
      <button
        type="button"
        className="promo-bar-action btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 text-decoration-none"
        onClick={async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          document.cookie = `${DRESSER_COOKIE}=; path=/; max-age=0; samesite=lax`;
          setUser(null);
          router.push('/');
          router.refresh();
        }}
      >
        <span className="fc-white fs-12 text-nowrap">Гарах</span>
      </button>
    );
  } else if (!user) {
    action = (
      <Link
        href="/login?kind=salon"
        className="promo-bar-action btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 text-decoration-none"
        aria-label="Салон нэвтрэх"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetUrl('images/icons/loginWhite.svg')} alt="" />
        <span className="fc-white fs-12 text-nowrap promo-bar-action-label">Салон нэвтрэх</span>
      </Link>
    );
  }

  return (
    <section className="promo-bar bg-dark">
      <div className="promo-bar-inner">
        <div className="promo-bar-side" aria-hidden="true" inert>
          {action}
        </div>
        <span className={`promo-bar-msg ticker-text${fading ? ' fading' : ''}`}>{message}</span>
        <div className="promo-bar-side promo-bar-side--end">{action}</div>
      </div>
    </section>
  );
}
