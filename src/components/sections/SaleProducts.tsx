'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../ui/ProductCard';
import { assetUrl } from '@/lib/constants';
import { saleProducts } from '@/lib/products';
import { useSwiperControls } from '@/lib/useSwiperControls';

export default function SaleProducts() {
  const { prevRef, nextRef, pagRef, ready } = useSwiperControls();

  return (
    <section className="bg-light py-sm-5 py-4">
      <div className="container">
        <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-3">Хямдралтай бүтээгдэхүүн</h4>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1.45}
          spaceBetween={12}
          preventClicks={false}
          preventClicksPropagation={false}
          watchSlidesProgress
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            576: { slidesPerView: 2.15, spaceBetween: 14 },
            992: { slidesPerView: 3, spaceBetween: 18 },
            1400: { slidesPerView: 3.4, spaceBetween: 20 },
          }}
          navigation={ready ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
          pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
          className="swiper productsSlider"
        >
          {saleProducts.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="d-flex align-items-center justify-content-center pt-2 gap-2">
          <div ref={prevRef} className="swiper-button-prev productsSlider-Prev position-relative bg-white p-2 rounded-2 border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/chevronLeft.svg')} alt="" className="w-20 h-20" />
          </div>
          <div ref={pagRef} className="swiper-pagination productsSlider-pagination position-relative" />
          <div ref={nextRef} className="swiper-button-next productsSlider-Next position-relative bg-white p-2 rounded-2 border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/chevronRight.svg')} alt="" className="w-20 h-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
