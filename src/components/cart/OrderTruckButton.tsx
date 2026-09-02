'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hideCartDrawer } from '@/lib/cart';

export default function OrderTruckButton({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [animate, setAnimate] = useState(false);
  const lock = useRef(false);
  const timer = useRef<number>(0);

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = 0;
    lock.current = false;
    setAnimate(false);
  };

  useEffect(() => {
    reset();
  }, [pathname]);

  useEffect(() => {
    const el = document.getElementById('cartCanvas');
    el?.addEventListener('shown.bs.offcanvas', reset);
    el?.addEventListener('hidden.bs.offcanvas', reset);
    return () => {
      el?.removeEventListener('shown.bs.offcanvas', reset);
      el?.removeEventListener('hidden.bs.offcanvas', reset);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <button
      type="button"
      className={`order${animate ? ' animate' : ''}`}
      disabled={count < 1}
      onClick={() => {
        if (lock.current || count < 1) return;
        lock.current = true;
        setAnimate(true);
        timer.current = window.setTimeout(() => {
          hideCartDrawer();
          lock.current = false;
          setAnimate(false);
          router.push('/checkout');
        }, 7400);
      }}
    >
      <span className="default">ЗАХИАЛГА ӨГӨХ — {count} ш</span>
      <span className="success">
        ЗАХИАЛГА БАТЛАГДЛАА
        <svg viewBox="0 0 12 10" aria-hidden="true">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </span>
      <div className="box" />
      <div className="truck">
        <div className="back" />
        <div className="front">
          <div className="window" />
        </div>
        <div className="light top" />
        <div className="light bottom" />
      </div>
      <div className="lines" />
    </button>
  );
}
