'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import WishlistButton from '@/components/ui/WishlistButton';
import type { CatalogProduct } from '@/lib/products';

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
  };
  const displayPrice = sizes?.[0]?.price || price;
  const displayOriginal = sizes?.[0]?.originalPrice || originalPrice;
  const showSizes = Boolean(sizes && sizes.length > 1);
  const showShades = Boolean(shades && shades.length > 0);
  const extraShades = shades && shades.length > 2 ? shades.length - 2 : 0;
  const extraSizes = sizes && sizes.length > 2 ? sizes.length - 2 : 0;
  const hoverImages = (gallery && gallery.length > 1 ? gallery.slice(1, 6) : []).filter(Boolean);

  return (
    <article className={`ga-card ga-card--${layout}${className ? ` ${className}` : ''}`}>
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
            {(discount || hit || isNew) && (
              <div className="ga-card__labels">
                {discount && <span className="ga-card__label ga-card__label--sale">{discount}</span>}
                {hit && <span className="ga-card__label ga-card__label--hit">HIT</span>}
                {isNew && <span className="ga-card__label ga-card__label--new">NEW</span>}
              </div>
            )}
            <WishlistButton product={product} />
            <div className="ga-card__cart">
              <CartIconButton product={product} className="ga-card__cart-btn" />
            </div>
          </div>
          <div className="ga-card__info">
            {(showShades || showSizes) && (
              <div className="ga-card__attrs">
                {showShades && (
                  <div className="ga-card__colors">
                    {shades!.slice(0, 2).map((shade) => (
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
                    {sizes!.slice(0, 2).map((size) => (
                      <span key={size.label} className="ga-card__unit">
                        {size.label}
                      </span>
                    ))}
                    {extraSizes > 0 && <span className="ga-card__unit-more">+{extraSizes}</span>}
                  </div>
                )}
              </div>
            )}
            <div className="ga-card__type">{category}</div>
            <div className="ga-card__name">
              <span className="ga-card__brand">{brand}</span>
              <span className="ga-card__title">{name}</span>
            </div>
            {discount && (
              <div className="ga-card__coupon">
                <span>ХЯМДРАЛ</span>
                <span className="ga-card__coupon-div">|</span>
                <span>{`до −${String(discount).replace(/^[−\-]?/, '').replace(/%$/, '')}%`}</span>
              </div>
            )}
            <div className="ga-card__price">
              {showSizes && <span className="ga-card__price-from">от</span>}
              <strong>{displayPrice}</strong>
              {displayOriginal && <s>{displayOriginal}</s>}
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
