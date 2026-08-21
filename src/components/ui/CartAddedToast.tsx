'use client';

import { useEffect } from 'react';
import { assetUrl } from '@/lib/constants';
import CartBagIcon from '@/components/ui/CartBagIcon';
import type { CartNotice } from '@/components/providers/QuickViewProvider';

type Props = {
  notice: CartNotice | null;
  onDone: () => void;
};

export default function CartAddedToast({ notice, onDone }: Props) {
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(timer);
  }, [notice, onDone]);

  if (!notice) return null;

  const volume = notice.volume || notice.product.sizes?.[0]?.label;

  return (
    <div className="cart-added-toast" role="status">
      <div className="cart-added-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetUrl(notice.product.image)} alt="" />
      </div>
      <div className="cart-added-copy">
        <span className="cart-added-label">
          <CartBagIcon className="cart-added-bag" />
          сагсанд нэмэгдлээ
        </span>
        <strong>{notice.product.name}</strong>
        {volume ? <span className="cart-added-vol">{volume} мл</span> : null}
      </div>
    </div>
  );
}
