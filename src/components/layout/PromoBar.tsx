'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assetUrl } from '@/lib/constants';
import { DRESSER_COOKIE } from '@/lib/catalog-audience';

const PROMO_MESSAGES = [
  'Хот дотор 80,000₮ дээш худалдан авалтанд хүргэлт үнэгүй',
  '300,000₮ дээш худалдан авалтанд бэлэгтэй',
];

export default function PromoBar() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [dresser, setDresser] = useState(false);

  useEffect(() => {
    setDresser(document.cookie.split('; ').some((part) => part.startsWith(`${DRESSER_COOKIE}=1`)));
    const timer = window.setInterval(() => {
      setFading(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
        setFading(false);
      }, 500);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-dark">
      <div className="container-fluid">
        <div className="d-flex">
          <div className="d-flex justify-content-center flex-grow-1 fc-white fw-semibold align-items-center overflow-hidden ps-sm-5">
            <span
              className={`ticker-text fs-12 d-block lh-sm my-1 ms-sm-5 ps-sm-5${fading ? ' fading' : ''}`}
              id="promo-ticker"
            >
              {PROMO_MESSAGES[index]}
            </span>
          </div>
          {dresser ? (
            <>
              <Link
                href="/dresser/list"
                className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 ms-auto"
              >
                <span className="fc-white fs-12 text-nowrap">Үсчдийн каталог</span>
              </Link>
              <button
                type="button"
                className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0"
                onClick={() => {
                  document.cookie = `${DRESSER_COOKIE}=; path=/; max-age=0; samesite=lax`;
                  setDresser(false);
                  router.push('/');
                  router.refresh();
                }}
              >
                <span className="fc-white fs-12 text-nowrap">Гарах</span>
              </button>
            </>
          ) : (
            <Link
              href="/login/dresser"
              className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 ms-auto"
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
