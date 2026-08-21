'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import type { CatalogProduct } from '@/lib/products';
import { defaultSelection, openCartDrawer, type CartSelection } from '@/lib/cart';
import { useCart } from '@/components/providers/CartProvider';

export type CartNotice = {
  product: CatalogProduct;
  volume?: string;
};

type QuickViewContextValue = {
  addToCart: (product: CatalogProduct, selection?: CartSelection) => void;
};

const QuickViewContext = createContext<QuickViewContextValue>({
  addToCart: () => undefined,
});

export function useQuickView() {
  return useContext(QuickViewContext);
}

export default function QuickViewProvider({ children }: { children: ReactNode }) {
  const { addItem } = useCart();
  const addToCart = useCallback(
    (item: CatalogProduct, selection: CartSelection = {}) => {
      addItem(item, { ...defaultSelection(item), ...selection });
      openCartDrawer();
    },
    [addItem]
  );

  return <QuickViewContext.Provider value={{ addToCart }}>{children}</QuickViewContext.Provider>;
}
