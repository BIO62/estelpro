'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CatalogProduct } from '@/lib/products';
import { readWishlist, toggleWishlistItem, writeWishlist } from '@/lib/wishlist';

type WishlistContextValue = {
  items: CatalogProduct[];
  has: (id: string) => boolean;
  toggle: (product: CatalogProduct) => void;
};

const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  has: () => false,
  toggle: () => undefined,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readWishlist());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeWishlist(items);
  }, [items, ready]);

  const has = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const toggle = useCallback((product: CatalogProduct) => {
    setItems((current) => toggleWishlistItem(current, product));
  }, []);

  const value = useMemo(() => ({ items, has, toggle }), [items, has, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
