'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import type { CatalogProduct } from '@/lib/products';

type Props = {
  product: CatalogProduct | null;
  onClose: () => void;
  onAdd: (product: CatalogProduct, selection?: { size?: string; shade?: string }) => void;
};

export default function QuickViewOffcanvas({ product, onClose, onAdd }: Props) {
  const open = Boolean(product);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [shadeIdx, setShadeIdx] = useState(0);
  const [shadeOpen, setShadeOpen] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    setSizeIdx(0);
    setShadeIdx(0);
    setShadeOpen(false);
  }, [product?.id]);

  useEffect(() => {
    document.body.classList.toggle('qv-open', open);
    return () => document.body.classList.remove('qv-open');
  }, [open]);

  const gallery = product?.gallery?.length ? product.gallery : product ? [product.image] : [];
  const size = product?.sizes?.[sizeIdx];
  const shade = product?.shades?.[shadeIdx];
  const price = size?.price || shade?.price || product?.price || '';
  const original = size?.originalPrice || shade?.originalPrice || product?.originalPrice;

  return (
    <>
      <div className={`qv-backdrop${open ? ' is-open' : ''}`} onClick={onClose} />
      <aside className={`qv-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button type="button" className="quick-view-close" onClick={onClose} aria-label="Хаах">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {product && (
          <div className="quick-view-body">
            <div className="quick-view-top">
              <div className="quick-view-copy">
                <span className="product-cat">{product.category}</span>
                <h2 className="quick-view-name">{product.name}</h2>
              </div>
              <div className="product-badges quick-view-badges">
                {product.discount && <span className="product-badge product-badge-sale">{product.discount}</span>}
                {product.hit && <span className="product-badge product-badge-hit">HIT</span>}
                {product.isNew && <span className="product-badge product-badge-new">NEW</span>}
              </div>
            </div>

            <div className="quick-view-gallery">
              {gallery.length > 1 && (
                <div className="quick-view-thumbs">
                  {gallery.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      className={`quick-view-thumb${idx === activeImg ? ' is-active' : ''}`}
                      onClick={() => setActiveImg(idx)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(img)} alt="" />
                    </button>
                  ))}
                </div>
              )}
              <div className="quick-view-main">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(gallery[activeImg] || product.image)} alt={product.name} />
              </div>
            </div>

            <Link href={`/products/${product.id}`} className="quick-view-more" onClick={onClose}>
              Дэлгэрэнгүй
              <span aria-hidden="true">→</span>
            </Link>

            <div className="quick-view-opts">
              {product.sizes && product.sizes.length > 0 && (
                <div className="quick-view-block">
                  <span className="quick-view-label">Хэмжээ / мл</span>
                  <div className="product-sizes">
                    {product.sizes.map((item, idx) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`product-size${idx === sizeIdx ? ' is-active' : ''}`}
                        onClick={() => setSizeIdx(idx)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.shades && product.shades.length > 0 && shade && (
                <div className="quick-view-block">
                  <span className="quick-view-label">Өнгө</span>
                  <button type="button" className="shade-select" onClick={() => setShadeOpen((v) => !v)}>
                    <span className="shade-dot" style={{ background: shade.hex }} />
                    <span className="flex-grow-1 text-start">{shade.name}</span>
                    <span className="shade-caret">{shadeOpen ? '▴' : '▾'}</span>
                  </button>
                  {shadeOpen && (
                    <div className="shade-menu">
                      {product.shades.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`shade-option${idx === shadeIdx ? ' is-active' : ''}`}
                          onClick={() => {
                            setShadeIdx(idx);
                            setShadeOpen(false);
                          }}
                        >
                          <span className="shade-dot" style={{ background: item.hex }} />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="product-price quick-view-price">
                <strong>{price}</strong>
                {original && <s>{original}</s>}
              </div>

              <button
                type="button"
                className="btn btn-main btn-swipe quick-view-cart"
                onClick={() => onAdd(product, { size: size?.label, shade: shade?.name })}
              >
                <span>Сагслах</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
