'use client';

import { useWishlist } from '@/components/providers/WishlistProvider';
import type { CatalogProduct } from '@/lib/products';

export default function WishlistButton({
  product,
  className = 'ga-card__fav',
}: {
  product: CatalogProduct;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(product.id);

  return (
    <button
      type="button"
      className={`${className}${active ? ' is-active' : ''}`}
      aria-label={active ? 'Хадгалснаас хасах' : 'Хадгалах'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
    >
      <svg viewBox="0 0 15 15" aria-hidden="true">
        <path
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          d="m7.138 3.04.362.38.361-.38c.382-.398 1.253-1.104 2.296-1.402 1.003-.286 2.167-.202 3.281.963 1.119 1.17 1.208 2.41.928 3.484-.288 1.103-.967 2.02-1.348 2.417l-3.255 3.406-1.824 1.909-.44.46-.438-.46-1.824-1.909-3.255-3.406C1.602 8.104.922 7.188.634 6.085.354 5.01.443 3.772 1.561 2.6c1.114-1.165 2.279-1.25 3.282-.963 1.042.298 1.914 1.004 2.295 1.403Z"
        />
      </svg>
    </button>
  );
}
