'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { assetUrl } from '@/lib/constants';
import { formatPrice, hideCartDrawer } from '@/lib/cart';
import { useCart } from '@/components/providers/CartProvider';
import OrderTruckButton from '@/components/cart/OrderTruckButton';
import CartIconButton from '@/components/ui/CartIconButton';
import WishlistButton from '@/components/ui/WishlistButton';
import type { CatalogProduct } from '@/lib/products';

const SIZE_IN_NAME = /[,\s]+(\d+(?:[.,]\d+)?\s*(?:мл|ml|л|l|г|g))\s*$/i;

function splitCardName(name: string, sizeLabel?: string) {
  const clean = name.replace(/^\s*ESTEL\s+/i, '').trim() || name;
  const fromName = clean.match(SIZE_IN_NAME);
  const title = fromName ? clean.slice(0, fromName.index).replace(/[,\s]+$/, '').trim() : clean;
  const fromLabel = (sizeLabel || '').trim();
  const size =
    fromName?.[1]?.replace(/\s+/g, ' ') ||
    (fromLabel && /^\d/.test(fromLabel)
      ? /(?:мл|ml|л|l|г|g)$/i.test(fromLabel)
        ? fromLabel
        : `${fromLabel}мл`
      : '');
  return { title, size };
}

export default function CartOffcanvas() {
  const pathname = usePathname();
  const { items, count, total, subtotal, discount, setQty, updateItemSelection, removeItem, clearCart } = useCart();
  const [recs, setRecs] = useState<CatalogProduct[]>([]);
  const recsRef = useRef<HTMLDivElement>(null);
  const excludeKey = useMemo(
    () =>
      [...new Set(items.map((item) => item.productId))]
        .sort()
        .join(','),
    [items],
  );
  const catsKey = useMemo(
    () =>
      [...new Set(items.map((item) => item.category).filter(Boolean))]
        .sort()
        .join(','),
    [items],
  );
  const visibleRecs = recs.filter((product) => !items.some((item) => item.productId === product.id));
  const scrollRecs = (dir: number) => {
    recsRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' });
  };

  useEffect(() => {
    hideCartDrawer();
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (excludeKey) params.set('exclude', excludeKey);
    if (catsKey) params.set('cats', catsKey);
    const query = params.toString();
    fetch(`/api/cart/recs${query ? `?${query}` : ''}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data: { products?: CatalogProduct[] }) => {
        if (!cancelled) setRecs(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (!cancelled) setRecs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [excludeKey, catsKey]);

  return (
    <div className="offcanvas offcanvas-end cart-drawer" tabIndex={-1} id="cartCanvas" aria-labelledby="cartCanvasLabel">
      <div className="cart-drawer-head">
        <h2 className="cart-drawer-title" id="cartCanvasLabel">
          сагс
        </h2>
        <div className="cart-drawer-tools">
          {items.length > 0 && (
            <button type="button" className="cart-tool" onClick={clearCart} aria-label="Сагс цэвэрлэх">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <button type="button" className="cart-tool" data-bs-dismiss="offcanvas" aria-label="Хаах">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="offcanvas-body cart-drawer-body">
        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="fw-semibold mb-1">Сагс хоосон байна</p>
            <p className="mb-0">Бараа сагсалбал энд харагдана.</p>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {items.map((item) => {
                const original = item.originalPrice || item.price;
                const saved = Math.max(0, (original - item.price) * item.qty);
                return (
                  <article key={item.key} className="cart-line">
                    <Link href={`/products/${item.productId}`} className="cart-line-img" data-bs-dismiss="offcanvas">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(item.image)} alt="" />
                    </Link>
                    <div className="cart-line-copy">
                      <span className="cart-line-cat">{item.category}</span>
                      <Link href={`/products/${item.productId}`} className="cart-line-name" data-bs-dismiss="offcanvas">
                        {item.name}
                      </Link>
                      {item.sizes && item.sizes.length > 1 && (
                        <div className="cart-opts">
                          <span className="cart-opt-label">Хэмжээ</span>
                          <div className="product-sizes">
                            {item.sizes.map((size) => (
                              <button
                                key={size.label}
                                type="button"
                                className={`product-size${item.size === size.label ? ' is-active' : ''}`}
                                onClick={() => updateItemSelection(item.key, { size: size.label, shade: item.shade })}
                              >
                                {size.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.shades && item.shades.length > 0 && (
                        <div className="cart-opts">
                          <span className="cart-opt-label">Өнгө</span>
                          <div className="product-shades">
                            {item.shades.map((shade) => (
                              <button
                                key={shade.id}
                                type="button"
                                title={shade.name}
                                className={`product-shade${item.shade === shade.name ? ' is-active' : ''}`}
                                style={{ background: shade.hex }}
                                onClick={() => updateItemSelection(item.key, { size: item.size, shade: shade.name })}
                              />
                            ))}
                          </div>
                          {item.shade && <span className="cart-line-meta">{item.shade}</span>}
                        </div>
                      )}
                      {!item.sizes?.length && !item.shades?.length && (item.size || item.shade) && (
                        <span className="cart-line-meta">
                          {[item.size, item.shade].filter(Boolean).join(' · ')}
                        </span>
                      )}
                      <div className="cart-line-row">
                        <div className="cart-qty">
                          <button type="button" onClick={() => setQty(item.key, item.qty - 1)} aria-label="Хасах">
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button type="button" onClick={() => setQty(item.key, item.qty + 1)} aria-label="Нэмэх">
                            +
                          </button>
                        </div>
                        <div className="cart-line-price">
                          {saved > 0 && <span className="cart-save">хямдрал {formatPrice(saved)}</span>}
                          {original > item.price && <s>{formatPrice(original * item.qty)}</s>}
                          <strong>{formatPrice(item.price * item.qty)}</strong>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="cart-line-remove" onClick={() => removeItem(item.key)} aria-label="Хасах">
                      ×
                    </button>
                  </article>
                );
              })}
            </div>

            <label className="cart-promo">
              <input type="text" placeholder="ПРОМО КОД ОРУУЛАХ" />
              <button type="button" aria-label="Нэмэх">
                +
              </button>
            </label>

            <div className="cart-sum">
              <span className="cart-sum-title">захиалгын дүн</span>
              <div className="cart-sum-row">
                <span className="cart-sum-label">барааны үнэ</span>
                <span className="cart-sum-lead" aria-hidden="true" />
                <span className="cart-sum-val">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-sum-row">
                  <span className="cart-sum-label">хямдрал</span>
                  <span className="cart-sum-lead" aria-hidden="true" />
                  <span className="cart-sum-val">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="cart-sum-row cart-sum-total">
                <span className="cart-sum-label">нийт</span>
                <span className="cart-sum-lead" aria-hidden="true" />
                <strong className="cart-sum-val">{formatPrice(total)}</strong>
              </div>
            </div>

            <OrderTruckButton count={count} />
          </>
        )}

        {visibleRecs.length > 0 && (
          <div className="cart-recs">
            <div className="cart-recs-head">
              <span className="cart-recs-title">танд санал болгох</span>
              <div className="cart-recs-nav">
                <button type="button" onClick={() => scrollRecs(-1)} aria-label="Өмнөх">
                  ‹
                </button>
                <button type="button" onClick={() => scrollRecs(1)} aria-label="Дараах">
                  ›
                </button>
              </div>
            </div>
            <div className="cart-recs-track" ref={recsRef}>
              {visibleRecs.map((product) => {
                const { title, size } = splitCardName(product.name, product.sizes?.[0]?.label);
                return (
                <article key={product.id} className="cart-rec">
                  <div className="cart-rec-media">
                    {(product.discount || product.hit) && (
                      <div className="product-badges">
                        {product.discount && <span className="product-badge product-badge-sale">{product.discount}</span>}
                        {product.hit && <span className="product-badge product-badge-hit">HIT</span>}
                      </div>
                    )}
                    <WishlistButton product={product} className="product-wish cart-rec-wish" />
                    <Link href={`/products/${product.id}`} data-bs-dismiss="offcanvas">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(product.image)} alt="" />
                    </Link>
                    <CartIconButton
                      product={product}
                      className="ga-card__cart-btn cart-rec-cart"
                    />
                  </div>
                  <Link href={`/products/${product.id}`} className="cart-rec-info" data-bs-dismiss="offcanvas">
                    <span className="product-cat">{product.category}</span>
                    <strong className="cart-rec-name">{title}</strong>
                    {size ? <span className="cart-rec-size">{size}</span> : null}
                    <span className="cart-rec-price">{product.price}</span>
                  </Link>
                </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
