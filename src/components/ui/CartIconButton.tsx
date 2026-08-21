'use client';

import { useState } from 'react';
import CartBagIcon from '@/components/ui/CartBagIcon';
import { hasProductOptions, useQuickView } from '@/components/providers/QuickViewProvider';
import type { CatalogProduct } from '@/lib/products';

type Props = {
  product?: CatalogProduct;
};

export default function CartIconButton({ product }: Props) {
  const { openQuickView, addToCart } = useQuickView();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={`btn-cart-fab${added ? ' is-added' : ''}`}
      aria-label="Сагслах"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product && hasProductOptions(product)) {
          openQuickView(product);
          return;
        }
        setAdded(true);
        if (product) addToCart(product, { size: product.sizes?.[0]?.label });
      }}
    >
      <CartBagIcon className="btn-cart-fab-icon" />
    </button>
  );
}
