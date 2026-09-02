'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { assetUrl } from '@/lib/constants';
import { useSwiperControls } from '@/lib/useSwiperControls';
import CartBagIcon from '@/components/ui/CartBagIcon';
import { useCart } from '@/components/providers/CartProvider';
import { defaultSelection } from '@/lib/cart';
import type { CatalogProduct } from '@/lib/products';

const BANNERS = [
  {
    desktop: 'images/demo/bestseller 2500x1212 copy (1).jpg',
    mobile: 'images/demo/bestseller mob 800x1388 (1).jpg',
  },
  {
    desktop: 'images/demo/bestseller 2500x1212 copy (2).jpg',
    mobile: 'images/demo/bestseller mob 800x1388 (2).jpg',
  },
  {
    desktop: 'images/demo/bestseller 2500x1212 copy (3).jpg',
    mobile: 'images/demo/bestseller mob 800x1388 (2).jpg',
  },
];

export default function BestsellerSlider({ products = [] }: { products?: CatalogProduct[] }) {
  const { pagRef, ready } = useSwiperControls();
  const { addItem } = useCart();
  const slides = BANNERS.map((banner, index) => ({
    ...banner,
    product: products[index] || products[0],
  })).filter((slide) => slide.product);

  if (!slides.length) return null;

  return (
    <section className="position-relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={slides.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
        className="swiper bigProducts"
      >
        {slides.map((slide, idx) => {
          const product = slide.product;
          const href = `/products/${encodeURIComponent(product.id)}`;
          return (
            <SwiperSlide key={`${product.id}-${idx}`}>
              <div className="d-sm-block d-none position-relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(slide.desktop)} alt="" className="w-100 h-auto img-cover" />
              </div>
              <div className="d-sm-none d-block position-relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(slide.mobile)} alt="" className="w-100 h-auto img-cover" />
              </div>
              <div className="bestseller-card-wrap">
                <article className="bestseller-card">
                  <span className="bestseller-card__tag">Bestseller</span>
                  <Link href={href} className="bestseller-card__copy">
                    <strong className="bestseller-card__name">{product.name}</strong>
                    {product.shortDescription ? (
                      <span className="bestseller-card__desc">{product.shortDescription}</span>
                    ) : null}
                    <span className="bestseller-card__price">{product.price}</span>
                  </Link>
                  <button
                    type="button"
                    className="bestseller-card__btn"
                    onClick={() => addItem(product, defaultSelection(product))}
                  >
                    <CartBagIcon className="bestseller-card__btn-icon" />
                    Сагслах
                  </button>
                </article>
              </div>
            </SwiperSlide>
          );
        })}
        <div ref={pagRef} className="swiper-pagination bigProducts-pagination" />
      </Swiper>
    </section>
  );
}
