import type { CatalogProduct } from '@/lib/products';

export const WISHLIST_STORAGE_KEY = 'estel-wishlist';

export function readWishlist(): CatalogProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CatalogProduct[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id) : [];
  } catch {
    return [];
  }
}

export function writeWishlist(items: CatalogProduct[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function toggleWishlistItem(items: CatalogProduct[], product: CatalogProduct) {
  const exists = items.some((item) => item.id === product.id);
  return exists ? items.filter((item) => item.id !== product.id) : [...items, product];
}
