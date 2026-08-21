'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

const PROMO_MESSAGES = [
  'Хот дотор 80,000₮ дээш худалдан авалтанд хүргэлт үнэгүй',
  '300,000₮ дээш худалдан авалтанд бэлэгтэй',
];

export default function PromoBar() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
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
          <Link
            href="/login/dresser"
            className="btn px-2 py-1 d-flex align-items-center justify-content-center gap-1 border-0 rounded-0 ms-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/loginWhite.svg')} alt="" />
            <span className="fc-white fs-12 text-nowrap">Салон нэвтрэх</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
