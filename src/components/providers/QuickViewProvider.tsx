'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { CatalogProduct } from '@/lib/products';
import type { CartSelection } from '@/lib/cart';
import { useCart } from '@/components/providers/CartProvider';
import QuickViewOffcanvas from '@/components/ui/QuickViewOffcanvas';
import CartAddedToast from '@/components/ui/CartAddedToast';

export type CartNotice = {
  product: CatalogProduct;
  volume?: string;
};

type QuickViewContextValue = {
  openQuickView: (product: CatalogProduct) => void;
  addToCart: (product: CatalogProduct, selection?: CartSelection) => void;
};

const QuickViewContext = createContext<QuickViewContextValue>({
  openQuickView: () => undefined,
  addToCart: () => undefined,
});

export function useQuickView() {
  return useContext(QuickViewContext);
}

export function hasProductOptions(product: Pick<CatalogProduct, 'sizes' | 'shades'>) {
  return Boolean((product.shades && product.shades.length > 0) || (product.sizes && product.sizes.length > 1));
}

export default function QuickViewProvider({ children }: { children: ReactNode }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const openQuickView = useCallback((item: CatalogProduct) => setProduct(item), []);
  const onClose = useCallback(() => setProduct(null), []);
  const dismissNotice = useCallback(() => setNotice(null), []);
  const addToCart = useCallback(
    (item: CatalogProduct, selection: CartSelection = {}) => {
      addItem(item, selection);
      setProduct(null);
      setNotice({ product: item, volume: selection.size });
    },
    [addItem]
  );

  return (
    <QuickViewContext.Provider value={{ openQuickView, addToCart }}>
      {children}
      <QuickViewOffcanvas product={product} onClose={onClose} onAdd={addToCart} />
      <CartAddedToast notice={notice} onDone={dismissNotice} />
    </QuickViewContext.Provider>
  );
}
