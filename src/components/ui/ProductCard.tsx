'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import type { CatalogProduct } from '@/lib/products';

type ProductCardProps = Partial<CatalogProduct> & {
  id: string;
  wished?: boolean;
  className?: string;
};

export default function ProductCard({
  id,
  name = 'Honey Infused Hair Perfume Limited Edition',
  category = 'Үсний арчилгаа',
  brand = 'ESTEL',
  price = '17,000₮',
  originalPrice,
  discount,
  hit,
  isNew,
  image = 'images/demo/product6.jpg',
  gallery,
  sizes,
  shades,
  wished = false,
  className = '',
}: ProductCardProps) {
  const product: CatalogProduct = {
    id,
    name,
    category,
    brand,
    price,
    originalPrice,
    discount,
    hit,
    isNew,
    image,
    gallery,
    sizes,
    shades,
  };
  const displayPrice = sizes?.[0]?.price || price;
  const displayOriginal = sizes?.[0]?.originalPrice || originalPrice;
  const showSizes = Boolean(sizes && sizes.length > 1);
  const showShades = Boolean(shades && shades.length > 0);
  const extraShades = shades && shades.length > 3 ? shades.length - 3 : 0;
  const hoverImages = (gallery && gallery.length > 1 ? gallery.slice(1, 6) : []).filter(Boolean);

  return (
    <article className={`ga-card ${className}`}>
      <div className="ga-card__body">
        <Link href={`/products/${encodeURIComponent(id)}`} className="ga-card__link">
          <div className="ga-card__ratio">
            <div className="ga-card__gallery">
              <div className="ga-card__gallery-item is-visible">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(image)} alt={name} />
              </div>
              {hoverImages.map((src) => (
                <div className="ga-card__gallery-item" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(src)} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="ga-card__info">
            {(showShades || showSizes) && (
              <div className="ga-card__attrs">
                {showShades && (
                  <div className="ga-card__colors">
                    {shades!.slice(0, 3).map((shade) => (
                      <span
                        key={shade.id}
                        className="ga-card__color"
                        style={{ background: shade.hex }}
                        aria-label={shade.name}
                      />
                    ))}
                    {extraShades > 0 && <span className="ga-card__color-more">+{extraShades}</span>}
                  </div>
                )}
                {showSizes && (
                  <div className="ga-card__units">
                    {sizes!.map((size) => (
                      <span key={size.label} className="ga-card__unit">
                        {size.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="ga-card__type">{category}</div>
            <div className="ga-card__name">
              <span className="ga-card__brand">{brand}</span>
              <span className="ga-card__title">{name}</span>
            </div>
            <div className="ga-card__price">
              <strong>{displayPrice}</strong>
              {displayOriginal && <s>{displayOriginal}</s>}
            </div>
          </div>
        </Link>
        <div className="ga-card__actions">
          {(discount || hit || isNew) && (
            <div className="ga-card__labels">
              {discount && <span className="ga-card__label ga-card__label--sale">{discount}</span>}
              {hit && <span className="ga-card__label ga-card__label--hit">HIT</span>}
              {isNew && <span className="ga-card__label ga-card__label--new">NEW</span>}
            </div>
          )}
          <button
            type="button"
            className={`ga-card__fav${wished ? ' is-active' : ''}`}
            aria-label="Хадгалах"
          >
            <svg viewBox="0 0 15 15" aria-hidden="true">
              <path
                fill={wished ? 'currentColor' : 'none'}
                stroke="currentColor"
                d="m7.138 3.04.362.38.361-.38c.382-.398 1.253-1.104 2.296-1.402 1.003-.286 2.167-.202 3.281.963 1.119 1.17 1.208 2.41.928 3.484-.288 1.103-.967 2.02-1.348 2.417l-3.255 3.406-1.824 1.909-.44.46-.438-.46-1.824-1.909-3.255-3.406C1.602 8.104.922 7.188.634 6.085.354 5.01.443 3.772 1.561 2.6c1.114-1.165 2.279-1.25 3.282-.963 1.042.298 1.914 1.004 2.295 1.403Z"
              />
            </svg>
          </button>
          <div className="ga-card__cart">
            <CartIconButton product={product} className="ga-card__cart-btn" />
          </div>
        </div>
      </div>
    </article>
  );
}
