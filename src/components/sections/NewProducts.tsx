'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import type { CatalogProduct } from '@/lib/products';

function productHref(id: string) {
  return `/products/${encodeURIComponent(id)}`;
}

function ShineBackground() {
  return (
    <>
      <div className="shine-card__shine" />
      <div className="shine-card__bg">
        <div className="shine-card__tiles">
          {Array.from({ length: 10 }, (_, i) => (
            <div className={`shine-card__tile shine-card__tile--${i + 1}`} key={i} />
          ))}
        </div>
        <div className="shine-card__line shine-card__line--1" />
        <div className="shine-card__line shine-card__line--2" />
        <div className="shine-card__line shine-card__line--3" />
      </div>
    </>
  );
}

function NewTile({
  product,
  className = '',
}: {
  product: CatalogProduct;
  className?: string;
}) {
  return (
    <article className={`shine-card ${className}`}>
      <Link href={productHref(product.id)} className="shine-card__link">
        <span className="shine-card__badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width={22} height={22}>
            <path
              d="M5.2 12.6 10.1 17.4 19.4 6.6"
              fill="none"
              stroke="#3EE0C4"
              strokeWidth="3.2"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="shine-card__stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(product.image)} alt={product.name} />
        </span>
        <span className="shine-card__copy">
          <span className="shine-card__cat">{product.category}</span>
          <strong className="shine-card__name">{product.name}</strong>
          <span className="shine-card__price">
            {product.price}
            {product.originalPrice && <s>{product.originalPrice}</s>}
          </span>
        </span>
        <ShineBackground />
      </Link>
      <CartIconButton product={product} />
    </article>
  );
}

export default function NewProducts({ products = [] }: { products?: CatalogProduct[] }) {
  const tiles = products.filter((item) => Boolean(item.image)).slice(0, 5);
  if (!tiles.length) return null;
  const cta = tiles[0];

  return (
    <section className="position-relative py-5">
      <div className="container position-relative">
        <div className="d-flex align-items-end justify-content-between mb-3">
          <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-0">Шинэ бүтээгдэхүүн</h4>
          <Link href="/new" className="fs-13 fc-main text-decoration-none">
            бүгдийг харах
          </Link>
        </div>

        <div className="row g-3 mb-4 d-none d-lg-flex">
          <div className="col-lg-6">
            <NewTile product={tiles[0]} className="shine-card--hero" />
          </div>
          <div className="col-lg-3">
            <div className="row row-cols-1 g-3 h-100">
              {tiles.slice(1, 3).map((product) => (
                <div className="col" key={product.id}>
                  <NewTile product={product} />
                </div>
              ))}
            </div>
          </div>
          {tiles[3] && (
            <div className="col-lg-3">
              <NewTile product={tiles[3]} className="h-100" />
            </div>
          )}
        </div>

        <div className="row g-3 mb-4 d-none d-sm-flex d-lg-none">
          {tiles.map((product) => (
            <div className="col-sm-6" key={product.id}>
              <NewTile product={product} />
            </div>
          ))}
        </div>

        <div className="d-sm-none new-products-mob mb-4">
          <NewTile product={tiles[0]} className="shine-card--hero" />
          {tiles.length > 1 && (
            <div className="new-products-scroll">
              {tiles.slice(1).map((product) => (
                <NewTile product={product} key={product.id} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center py-5">
          <h3 className="fw-bold mb-3">{cta.brand || 'ESTEL'}</h3>
          <p className="mb-4 mx-auto maxw-640">{cta.name}</p>
          <Link href="/list" className="btn btn-main btn-swipe d-inline-flex align-items-center">
            <span>Худалдаж авах</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
