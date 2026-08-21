'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { formatPrice } from '@/lib/cart';
import { catalog } from '@/lib/products';
import { useCart } from '@/components/providers/CartProvider';

export default function CartOffcanvas() {
  const { items, count, total, subtotal, discount, setQty, updateItemSelection, removeItem, clearCart } = useCart();
  const recs = catalog.filter((product) => !items.some((item) => item.productId === product.id)).slice(0, 8);
  const recsRef = useRef<HTMLDivElement>(null);
  const scrollRecs = (dir: number) => {
    recsRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' });
  };

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
                <span>барааны үнэ</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-sum-row">
                  <span>хямдрал</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="cart-sum-row cart-sum-total">
                <span>нийт</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <Link href="/checkout" className="cart-checkout" data-bs-dismiss="offcanvas">
              ЗАХИАЛГА ӨГӨХ — {count} ш
            </Link>
          </>
        )}

        {recs.length > 0 && (
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
              {recs.map((product) => (
                <article key={product.id} className="cart-rec">
                  <div className="cart-rec-media">
                    {(product.discount || product.hit) && (
                      <div className="product-badges">
                        {product.discount && <span className="product-badge product-badge-sale">{product.discount}</span>}
                        {product.hit && <span className="product-badge product-badge-hit">HIT</span>}
                      </div>
                    )}
                    <button type="button" className="product-wish cart-rec-wish" aria-label="Хадгалах">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12.1 20.3S4.5 15.2 4.5 9.8A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.2c0 5.4-7.4 10.5-7.4 10.5Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <Link href={`/products/${product.id}`} data-bs-dismiss="offcanvas">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(product.image)} alt="" />
                    </Link>
                  </div>
                  <Link href={`/products/${product.id}`} className="cart-rec-info" data-bs-dismiss="offcanvas">
                    <span className="product-cat">{product.category}</span>
                    <strong className="cart-rec-name">{product.name}</strong>
                    <span className="cart-rec-price">{product.price}</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
