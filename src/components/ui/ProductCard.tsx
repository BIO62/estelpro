'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import WishlistButton from '@/components/ui/WishlistButton';
import { hairConcernFor } from '@/lib/hair-concern';
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

type ProductCardProps = Partial<CatalogProduct> & {
  id: string;
  wished?: boolean;
  className?: string;
  layout?: 's' | 'l' | 'h';
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
  shortDescription,
  className = '',
  layout = 's',
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
    shortDescription,
  };
  const displayPrice = sizes?.[0]?.price || price;
  const displayOriginal = sizes?.[0]?.originalPrice || originalPrice;
  const concern = hairConcernFor({ name, category });
  const slides = useMemo(() => {
    const unique = [image, ...(gallery || [])].filter(
      (src, index, list): src is string => Boolean(src) && list.indexOf(src) === index
    );
    return unique.length ? unique : [image];
  }, [gallery, image]);
  const [slide, setSlide] = useState(0);
  const typeLabel = category && !/^[a-z0-9_]+$/i.test(category) ? category : '';
  const { title, size } = splitCardName(name, sizes?.[0]?.label);

  return (
    <article className={`ga-card ga-card--${layout}${className ? ` ${className}` : ''}`}>
      <div className="ga-card__body">
        <div className="ga-card__ratio">
          {(discount || hit || isNew) && (
            <div className="ga-card__labels">
              {discount ? <span className="ga-card__label ga-card__label--sale">{discount.replace(/^-/, '')}</span> : null}
              {hit ? <span className="ga-card__label ga-card__label--hit">HIT</span> : null}
              {isNew ? <span className="ga-card__label ga-card__label--new">NEW</span> : null}
            </div>
          )}
          <Link
            href={`/products/${encodeURIComponent(id)}`}
            className="ga-card__media-link"
            onMouseMove={(event) => {
              if (slides.length < 2) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width;
              const next = Math.min(slides.length - 1, Math.max(0, Math.floor(x * slides.length)));
              setSlide(next);
            }}
            onMouseLeave={() => setSlide(0)}
          >
            <div className="ga-card__gallery">
              {slides.map((src, index) => (
                <div key={src} className={`ga-card__gallery-item${index === slide ? ' is-visible' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl(src)} alt={name} />
                </div>
              ))}
            </div>
          </Link>
          <WishlistButton product={product} />
          <div className="ga-card__cart">
            <CartIconButton product={product} className="ga-card__cart-btn" />
          </div>
        </div>
        <Link href={`/products/${encodeURIComponent(id)}`} className="ga-card__link">
          <div className="ga-card__info">
            <div className="ga-card__meta">
              {concern ? (
                <span className={`ga-card__concern ga-card__concern--${concern.tone}`}>{concern.label}</span>
              ) : typeLabel ? (
                <div className="ga-card__type">{typeLabel}</div>
              ) : (
                <span className="ga-card__concern ga-card__concern--empty" aria-hidden="true" />
              )}
            </div>
            <div className="ga-card__name">
              <span className="ga-card__title">{title}</span>
              {size ? <span className="ga-card__size">{size}</span> : null}
            </div>
            <div className="ga-card__price">
              <strong>{displayPrice}</strong>
              {displayOriginal ? <s>{displayOriginal}</s> : null}
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
