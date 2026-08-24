'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { assetUrl } from '@/lib/constants';
import { useSwiperControls } from '@/lib/useSwiperControls';

export default function FeaturedBanner() {
  const { pagRef, ready } = useSwiperControls();

  return (
    <section>
      <Swiper
        modules={[Pagination, Autoplay]}
        speed={700}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
        className="swiper midBannerSlide"
      >
        <SwiperSlide>
          <div className="d-sm-block d-none position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/featured 2500x1215 2 (1).jpg')} alt="" className="w-100 h-auto img-cover" />
            <div className="slide-copy position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-start justify-content-center ps-lg-5 ps-4">
              <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-4">Онцлох бүтээгдэхүүн</h4>
              <h3 className="fw-bold d-block mb-3">SUMMER</h3>
              <span className="fst-italic">
                UV шүүлтүүртэй шампунь нь үс, <br />
                хуйхыг зөөлөн цэвэрлэж, чийгшүүлнэ.
                <br />
                9-р сарын 26-нд
              </span>
              <div className="d-flex gap-1 mt-3">
                <Link href="/list" className="btn btn-white btn-swipe d-flex align-items-center text-start gap-2">
                  <span className="flex-grow-1">Худалдаж авах</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="d-sm-none d-block position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/featured mob 800x1288 1 copy.jpg')} alt="" className="w-100 h-auto img-cover" />
            <div className="slide-copy position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center text-center justify-content-end pb-4 px-3">
              <h3 className="fw-bold d-block mb-3">ОБНИМИ</h3>
              <span className="fst-italic">
                Далайн коллаген + Замагны ханд <br /> Үсийг чийгээр хангаж, толигор байдлыг нэмэгдүүлнэ.
                <br />
                9-р сарын 26-нд
              </span>
              <div className="d-flex gap-1 mt-3">
                <Link href="/list" className="btn btn-white btn-swipe d-flex align-items-center text-start gap-2">
                  <span className="flex-grow-1">Худалдаж авах</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="d-sm-block d-none position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/featured 2500x1215 2 (2).jpg')} alt="" className="w-100 h-auto img-cover" />
            <div className="slide-copy position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-start justify-content-center ps-lg-5 ps-4 fc-white">
              <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-4">Онцлох бүтээгдэхүүн</h4>
              <h3 className="fw-bold d-block mb-3">ОБНИМИ</h3>
              <span className="fst-italic">
                Далайн коллаген + Замагны ханд <br /> Үсийг чийгээр хангаж, толигор байдлыг нэмэгдүүлнэ.
                <br />
                9-р сарын 26-нд
              </span>
              <div className="d-flex gap-1 mt-3">
                <Link href="/list" className="btn btn-white btn-swipe d-flex align-items-center text-start gap-2">
                  <span className="flex-grow-1">Худалдаж авах</span>
                  <span className="btn-arrow">→</span>
                </Link>

              </div>
            </div>
          </div>
          <div className="d-sm-none d-block position-relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/demo/featured mob 800x1288 2.jpg')} alt="" className="w-100 h-auto img-cover" />
            <div className="slide-copy position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center text-center justify-content-end pb-4 px-3 fc-white">
              <h3 className="fw-bold d-block mb-3">SUMMER</h3>
              <span className="fst-italic">
                UV шүүлтүүртэй шампунь нь үс, хуйхыг зөөлөн цэвэрлэж, чийгшүүлнэ.
                <br />
                9-р сарын 26-нд
              </span>
              <div className="d-flex gap-1 mt-3">
                <Link href="/list" className="btn btn-white btn-swipe d-flex align-items-center text-start gap-2">
                  <span className="flex-grow-1">Худалдаж авах</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <div ref={pagRef} className="swiper-pagination midBannerSlide-pagination" />
      </Swiper>
    </section>
  );
}
