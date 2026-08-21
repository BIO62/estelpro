'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CatalogProduct } from '@/lib/products';
import {
  cartCount,
  cartDiscount,
  cartItemKey,
  cartSubtotal,
  cartTotal,
  mergeCartItem,
  originalPriceForProduct,
  priceForProduct,
  readCart,
  toCartItem,
  writeCart,
  type CartItem,
  type CartSelection,
} from '@/lib/cart';

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  subtotal: number;
  discount: number;
  addItem: (product: CatalogProduct, selection?: CartSelection) => void;
  setQty: (key: string, qty: number) => void;
  updateItemSelection: (key: string, selection: CartSelection) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  total: 0,
  subtotal: 0,
  discount: 0,
  addItem: () => undefined,
  setQty: () => undefined,
  updateItemSelection: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
});

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeCart(items);
  }, [items, ready]);

  const addItem = useCallback((product: CatalogProduct, selection: CartSelection = {}) => {
    setItems((current) => mergeCartItem(current, toCartItem(product, selection)));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((current) => {
      if (qty < 1) return current.filter((item) => item.key !== key);
      return current.map((item) => (item.key === key ? { ...item, qty } : item));
    });
  }, []);

  const updateItemSelection = useCallback((key: string, selection: CartSelection) => {
    setItems((current) => {
      const item = current.find((entry) => entry.key === key);
      if (!item) return current;
      const nextSel = { size: selection.size ?? item.size, shade: selection.shade ?? item.shade };
      const nextKey = cartItemKey(item.productId, nextSel);
      const stub = {
        id: item.productId,
        name: item.name,
        category: item.category,
        image: item.image,
        price: String(item.price),
        originalPrice: item.originalPrice ? String(item.originalPrice) : undefined,
        sizes: item.sizes,
        shades: item.shades,
      } as CatalogProduct;
      const nextItem: CartItem = {
        ...item,
        key: nextKey,
        size: nextSel.size,
        shade: nextSel.shade,
        price: priceForProduct(stub, nextSel),
        originalPrice: originalPriceForProduct(stub, nextSel) || priceForProduct(stub, nextSel),
      };
      const rest = current.filter((entry) => entry.key !== key);
      const dup = rest.find((entry) => entry.key === nextKey);
      if (dup) {
        return rest.map((entry) => (entry.key === nextKey ? { ...entry, qty: entry.qty + item.qty } : entry));
      }
      return current.map((entry) => (entry.key === key ? nextItem : entry));
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: cartCount(items),
      total: cartTotal(items),
      subtotal: cartSubtotal(items),
      discount: cartDiscount(items),
      addItem,
      setQty,
      updateItemSelection,
      removeItem,
      clearCart,
    }),
    [items, addItem, setQty, updateItemSelection, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
