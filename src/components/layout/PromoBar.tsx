'use client';

import { useEffect, useState } from 'react';
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

  return (
    <section className="bg-dark">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {/* Ticker text identical to home page */}
          <div className="d-flex justify-content-center flex-grow-1 fc-white fw-semibold align-items-center overflow-hidden ps-sm-5">
            <span
              className={`ticker-text fs-12 d-block lh-sm my-1 ms-sm-5 ps-sm-5${fading ? ' fading' : ''}`}
              id="promo-ticker"
            >
              {isSalon && typeof user?.discountPercent === 'number'
                ? `Салоны хөнгөлөлт ${user.discountPercent}%`
                : PROMO_MESSAGES[index]}
            </span>
          </div>

          {/* Right Action */}
          {isSalon ? (
            <button
              type="button"
              className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 ms-auto text-decoration-none"
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
          ) : user ? null : (
            <Link
              href="/login?kind=salon"
              className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 ms-auto text-decoration-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/loginWhite.svg')} alt="" />
              <span className="fc-white fs-12 text-nowrap">Салон нэвтрэх</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
