'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import { saleProducts } from '@/lib/products';
import { useSwiperControls } from '@/lib/useSwiperControls';

function SliderArrow() {
  return (
    <i className="ga-slider-control__icon" aria-hidden="true">
      <svg fill="none" viewBox="0 0 25 15">
        <path stroke="currentColor" d="M6 2 .5 7.5 6 13" />
        <path fill="currentColor" d="M1 7h20v1H1z" />
      </svg>
    </i>
  );
}

export default function SaleProducts() {
  const { prevRef, nextRef, ready } = useSwiperControls();

  return (
    <section className="ga-slider-section">
      <div className="container">
        <header className="ga-slider-header">
          <h2 className="ga-slider-heading">
            <Link href="/products">Хямдрал</Link>
          </h2>
          <div className="ga-slider-controls">
            <button ref={prevRef} type="button" className="ga-slider-control" aria-label="Өмнөх">
              <SliderArrow />
            </button>
            <button
              ref={nextRef}
              type="button"
              className="ga-slider-control ga-slider-control--right"
              aria-label="Дараах"
            >
              <SliderArrow />
            </button>
          </div>
        </header>
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={8}
          preventClicks={false}
          preventClicksPropagation={false}
          watchSlidesProgress
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 12 },
            1280: { slidesPerView: 4, spaceBetween: 16 },
          }}
          navigation={ready ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
          className="ga-product-slider"
        >
          {saleProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <article className="ga-slider-more">
              <Link href="/products" className="ga-slider-more__action">
                <span className="ga-slider-more__btn">
                  бүгдийг харах
                  <svg fill="none" viewBox="0 0 14 11" aria-hidden="true">
                    <path stroke="currentColor" strokeWidth="1.25" d="m8 1 4.5 4.5L8 10m4-4.5H0" />
                  </svg>
                </span>
              </Link>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
