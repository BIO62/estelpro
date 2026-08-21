'use client';

import { useState } from 'react';
import CartBagIcon from '@/components/ui/CartBagIcon';
import { useQuickView } from '@/components/providers/QuickViewProvider';
import type { CatalogProduct } from '@/lib/products';

type Props = {
  product?: CatalogProduct;
  className?: string;
};

export default function CartIconButton({ product, className = '' }: Props) {
  const { addToCart } = useQuickView();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={`${className || 'btn-cart-fab'}${added ? ' is-added' : ''}`}
      aria-label="Сагслах"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product) return;
        setAdded(true);
        addToCart(product);
      }}
    >
      {className.includes('ga-card__cart-btn') ? (
        <svg viewBox="0 0 21 21" aria-hidden="true">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M7 6v-.5a3.5 3.5 0 1 1 7 0V6h3v13H4V6h3Zm1-.5a2.5 2.5 0 0 1 5 0V6H8v-.5ZM7 7v1.5h1V7h5v1.5h1V7h2v11H5V7h2Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <CartBagIcon className="btn-cart-fab-icon" />
      )}
    </button>
  );
}
