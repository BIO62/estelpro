'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { assetUrl } from '@/lib/constants';
import { useSwiperControls } from '@/lib/useSwiperControls';

const slides = [
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

export default function BestsellerSlider() {
  const { pagRef, ready } = useSwiperControls();

  return (
    <section className="position-relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
        className="swiper bigProducts"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="d-sm-block d-none position-relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(slide.desktop)} alt="" className="w-100 h-auto img-cover" />
            </div>
            <div className="d-sm-none d-block position-relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(slide.mobile)} alt="" className="w-100 h-auto img-cover" />
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-sm-end align-items-center justify-content-end">
              <div className="d-flex flex-column maxw-320 bg-white rounded-3 shadow p-3 me-sm-4 mb-4 mx-auto gap-3">
                <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3">Bestseller</h4>
                <a href="/products/1" className="d-flex flex-column gap-1 text-decoration-none fc-dark">
                  <strong className="fs-5">17,000₮</strong>
                  <span className="fs-12 doubleTruncate">
                    12314
                  </span>
                </a>
                <button type="button" className="btn btn-main d-flex align-items-center text-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/icons/cartWhite.svg')} alt="" className="w-20 h-20" />
                  <span className="flex-grow-1">Сагслах</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div ref={pagRef} className="swiper-pagination bigProducts-pagination" />
      </Swiper>
    </section>
  );
}
