'use client';

import CartBagIcon from '@/components/ui/CartBagIcon';
import { useCart } from '@/components/providers/CartProvider';
import { defaultSelection } from '@/lib/cart';
import type { CatalogProduct } from '@/lib/products';

type Props = {
  product?: CatalogProduct;
  className?: string;
};

export default function CartIconButton({ product, className = '' }: Props) {
  const { items, addItem, removeByProductId } = useCart();
  const added = Boolean(product && items.some((item) => item.productId === product.id));

  return (
    <button
      type="button"
      className={`${className || 'btn-cart-fab'}${added ? ' is-added' : ''}`}
      aria-label={added ? 'Сагснаас хасах' : 'Сагслах'}
      aria-pressed={added}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product) return;
        if (added) {
          removeByProductId(product.id);
          return;
        }
        addItem(product, defaultSelection(product));
      }}
    >
      <CartBagIcon className="btn-cart-fab-icon" />
    </button>
  );
}
