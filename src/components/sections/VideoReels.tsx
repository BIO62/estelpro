'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { assetUrl } from '@/lib/constants';
import { useSwiperControls } from '@/lib/useSwiperControls';

const reelText = `Үс шингэрэх, унах хандлагатай үсэнд зориулсан шампунь. Хуйхыг зөөлөн цэвэрлэж, чийгийн тэнцвэрийг хадгалахад дэмжлэг үзүүлнэ. Тогтмол хэрэглэснээр үсийг илүү бат бөх, өтгөн, эрүүл байлгахад тусална.`;

export default function VideoReels() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { prevRef, nextRef, pagRef, ready } = useSwiperControls();

  return (
    <section className="py-sm-5 py-3">
      <div className="container">
        <div className="row g-3">
          <div className="col-xl-3 col-lg-4 col-sm-5 order-sm-1 order-2">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              loop
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              navigation={ready ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
              pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
              className="swiper reelSlider h-100"
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <div className="d-flex flex-column h-100 justify-content-center align-items-start pe-sm-5 gap-1">
                    <strong className="fs-5">OTIUM UNIQUE  &amp; Активатор</strong>
                    <span className="d-block lh-sm">{reelText}</span>
                    <Link href="/products/1" className="btn btn-main btn-swipe mt-3 d-inline-flex align-items-center">
                      <span>Худалдаж авах</span>
                      <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="col-xl-9 col-lg-8 col-sm-7 order-sm-2 order-1">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              watchSlidesProgress
              spaceBetween={8}
              slidesPerView={1.2}
              centeredSlides
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                  centeredSlides: false,
                },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                  centeredSlides: false,
                },
              }}
              className="swiper thumbSlider"
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <SwiperSlide key={idx} className="d-flex h-auto align-items-end">
                  <div className="reel-overlay" />
                  <video src={assetUrl('videos/reel1.mp4')} className="w-100 h-auto rounded-3" playsInline muted loop autoPlay />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center pt-2 gap-2 position-relative zindex-0">
          <div ref={prevRef} className="swiper-button-prev reelSlider-Prev position-relative bg-white p-2 rounded-2 border">
        
            <Image src={assetUrl('images/icons/chevronLeft.svg')} alt="" width={20} height={20} className="w-20 h-20" />
          </div>
          <div ref={pagRef} className="swiper-pagination reelSlider-pagination position-relative" />
          <div ref={nextRef} className="swiper-button-next reelSlider-Next position-relative bg-white p-2 rounded-2 border">
           
            <Image src={assetUrl('images/icons/chevronRight.svg')} alt="" width={20} height={20} className="w-20 h-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
