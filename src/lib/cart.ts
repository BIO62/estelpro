import type { CatalogProduct } from '@/lib/products';

export const CART_STORAGE_KEY = 'estel-cart';

export type CartSelection = {
  size?: string;
  shade?: string;
};

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  qty: number;
  size?: string;
  shade?: string;
};

export function parsePrice(label: string) {
  return Number(String(label).replace(/[^\d]/g, '')) || 0;
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString('en-US')}₮`;
}

export function cartItemKey(productId: string, selection: CartSelection = {}) {
  return [productId, selection.size || '', selection.shade || ''].join('|');
}

export function priceForProduct(product: CatalogProduct, selection: CartSelection = {}) {
  const size = product.sizes?.find((item) => item.label === selection.size);
  return parsePrice(size?.price || product.price);
}

export function originalPriceForProduct(product: CatalogProduct, selection: CartSelection = {}) {
  const size = product.sizes?.find((item) => item.label === selection.size);
  const label = size?.originalPrice || product.originalPrice;
  return label ? parsePrice(label) : priceForProduct(product, selection);
}

export function toCartItem(product: CatalogProduct, selection: CartSelection = {}, qty = 1): CartItem {
  const price = priceForProduct(product, selection);
  return {
    key: cartItemKey(product.id, selection),
    productId: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    price,
    originalPrice: originalPriceForProduct(product, selection) || price,
    qty,
    size: selection.size,
    shade: selection.shade,
  };
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function mergeCartItem(items: CartItem[], incoming: CartItem) {
  const index = items.findIndex((item) => item.key === incoming.key);
  if (index === -1) return [...items, incoming];
  return items.map((item, i) => (i === index ? { ...item, qty: item.qty + incoming.qty } : item));
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.qty, 0);
}

export function cartDiscount(items: CartItem[]) {
  return Math.max(0, cartSubtotal(items) - cartTotal(items));
}
