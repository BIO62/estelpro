'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { assetUrl } from '@/lib/constants';

const toastProducts = [
  { img: 'images/demo/product1.jpg', text: 'Magni voluptatibus nulla nisi placeat quasi error dolorem, illo quibusdam in.' },
  { img: 'images/demo/product2.jpg', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
  { img: 'images/demo/product3.jpg', text: 'Earum voluptas magni voluptatibus laudantium impedit et ut eligendi sed molestias.' },
];

export default function HeroSlider() {
  const [toastOpen, setToastOpen] = useState(true);

  return (
    <div className="position-relative">
      <Swiper
        modules={[Autoplay]}
        speed={700}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="mainBigSlide"
      >
        <SwiperSlide>
          <div className="d-sm-flex d-none position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/index 2500x1160.jpg')} alt="" className="w-100 h-auto" />
            <div className="slide-copy position-absolute start-0 top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center">
              <h3 className="fw-bold d-block mb-3">KERATIN</h3>
              <span>Кератин, амин хүчлээр баяжуулж, үсийг</span>
              <strong>зөөлөн, уян хатан болгоно.</strong>
              <span>9-р сарын 26-нд</span>
              <Link href="/products/1" className="btn btn-main btn-swipe mt-3 d-inline-flex align-items-center">
                <span>Урьдчилан захиалах</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
          <div className="d-sm-none d-flex position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/index mob 800x1422.png')} alt="" className="ratio916 img-cover w-100 h-auto" />
            <div className="slide-copy position-absolute start-0 top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-end pb-4 text-center">
              <h3 className="fw-bold d-block mb-3">LUXURY SHINE</h3>
              <span>Үсний бүтцийг бэхжүүлж, чийгшүүлэн гадаргууг</span>
              <strong>эрүүл гялалзсан болгоно.</strong>
              <span>9-р сарын 26-нд</span>
              <Link href="/products/1" className="btn btn-main btn-swipe mt-3 d-inline-flex align-items-center">
                <span>Урьдчилан захиалах</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="d-sm-flex d-none position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/index 2500x1160.png')} alt="" className="w-100 h-auto" />
            <div className="slide-copy position-absolute start-0 top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center">
              <h3 className="fw-bold d-block mb-3">LUXURY SHINE</h3>
              <span>Үсний бүтцийг бэхжүүлж, чийгшүүлэн гадаргууг</span>
              <strong>эрүүл гялалзсан болгоно.</strong>
              <span>9-р сарын 26-нд</span>
              <Link href="/products/1" className="btn btn-main btn-swipe mt-3 d-inline-flex align-items-center">
                <span>Урьдчилан захиалах</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
          <div className="d-sm-none d-flex position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/index mob Ad 800x1422.png')} alt="" className="ratio916 img-cover w-100 h-auto" />
            <div className="slide-copy position-absolute start-0 top-0 w-100 h-100 d-flex flex-column align-items-center justify-content-end pb-4 text-center fc-black">
              <h3 className="fw-bold d-block mb-3">KERATIN</h3>
              <span>Кератин, амин хүчлээр баяжуулж, үсийг</span>
              <strong>зөөлөн, уян хатан болгоно.</strong>
              <span>9-р сарын 26-нд</span>
              <Link href="/products/1" className="btn btn-main btn-swipe mt-3 d-inline-flex align-items-center">
                <span>Урьдчилан захиалах</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {toastOpen && (
        <div
          id="toastSlide"
          className="toast align-items-center show position-absolute rounded-3 top-0 start-0 zindex-1 mt-sm-3 mt-1 ms-sm-3 ms-1"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex align-items-center gap-2 p-1">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={8}
              loop
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              className="swiper toastProductSlide"
            >
              {toastProducts.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <Link href="/products/1" className="d-flex align-items-center gap-2 text-decoration-none fc-dark fs-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assetUrl(item.img)} alt="" className="w-48 h-48 rounded-2 flex-shrink-0" />
                    <span className="doubleTruncate">{item.text}</span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <button type="button" className="btn me-2 m-auto border-0 p-1" aria-label="Close" onClick={() => setToastOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/times.svg')} alt="" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
