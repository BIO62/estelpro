'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import { useQuickView } from '@/components/providers/QuickViewProvider';
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
  const { openQuickView } = useQuickView();
  const product: CatalogProduct = {
    id,
    name,
    category,
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

  return (
    <article className={`product-card singleProduct h-100 ${className}`}>
      <div className="product-media">
        {(discount || hit || isNew) && (
          <div className="product-badges">
            {discount && <span className="product-badge product-badge-sale">{discount}</span>}
            {hit && <span className="product-badge product-badge-hit">HIT</span>}
            {isNew && <span className="product-badge product-badge-new">NEW</span>}
          </div>
        )}
        <button
          type="button"
          className={`product-wish heartWishBtn${wished ? ' active' : ''}`}
          aria-label="Хадгалах"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12.1 20.3S4.5 15.2 4.5 9.8A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.2c0 5.4-7.4 10.5-7.4 10.5Z"
              fill={wished ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Link href={`/products/${id}`} className="product-media-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(image)} alt={name} />
        </Link>
        <CartIconButton product={product} />
      </div>
      <div className="product-info">
        {showSizes && (
          <div className="product-sizes">
            {sizes!.map((size) => (
              <button
                key={size.label}
                type="button"
                className="product-size"
                onClick={() => openQuickView(product)}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
        {showShades && (
          <div className="product-shades">
            {shades!.slice(0, 4).map((shade) => (
              <button
                key={shade.id}
                type="button"
                className="product-shade"
                style={{ background: shade.hex }}
                aria-label={shade.name}
                onClick={() => openQuickView(product)}
              />
            ))}
          </div>
        )}
        <Link href={`/products/${id}`} className="product-info-link">
          <span className="product-cat">{category}</span>
          <strong className="product-title">{name}</strong>
          <div className="product-price">
            <strong>{displayPrice}</strong>
            {displayOriginal && <s>{displayOriginal}</s>}
          </div>
        </Link>
      </div>
    </article>
  );
}
