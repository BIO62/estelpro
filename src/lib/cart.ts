import type { CatalogProduct, ProductShade, ProductSize } from '@/lib/products';

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
  sizes?: ProductSize[];
  shades?: ProductShade[];
};

export function defaultSelection(product: CatalogProduct): CartSelection {
  return {
    size: product.sizes?.[0]?.label,
    shade: product.shades?.[0]?.name,
  };
}

type BootstrapOffcanvas = {
  getOrCreateInstance: (node: Element) => { show: () => void; hide: () => void };
};

function cartOffcanvasApi() {
  return (
    window as Window & {
      bootstrap?: { Offcanvas?: BootstrapOffcanvas };
    }
  ).bootstrap?.Offcanvas;
}

export function openCartDrawer() {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('cartCanvas');
  if (!el) return;
  const show = (Offcanvas?: BootstrapOffcanvas) => {
    Offcanvas?.getOrCreateInstance(el).show();
  };
  const existing = cartOffcanvasApi();
  if (existing) {
    show(existing);
    return;
  }
  void import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
    show(cartOffcanvasApi());
  });
}

export function hideCartDrawer() {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('cartCanvas');
  if (el) {
    cartOffcanvasApi()?.getOrCreateInstance(el).hide();
    el.classList.remove('show', 'showing');
    el.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.offcanvas-backdrop').forEach((node) => node.remove());
  document.body.classList.remove('offcanvas-open', 'modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
}

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
  const shade = product.shades?.find((item) => item.name === selection.shade || item.id === selection.shade);
  return parsePrice(size?.price || shade?.price || product.price);
}

export function originalPriceForProduct(product: CatalogProduct, selection: CartSelection = {}) {
  const size = product.sizes?.find((item) => item.label === selection.size);
  const shade = product.shades?.find((item) => item.name === selection.shade || item.id === selection.shade);
  const label = size?.originalPrice || shade?.originalPrice || product.originalPrice;
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
    sizes: product.sizes,
    shades:
      product.shades && product.shades.length > 8
        ? product.shades.filter((item) => item.name === selection.shade || item.id === selection.shade)
        : product.shades,
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
