'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { assetUrl } from '@/lib/constants';
import { listUlaanbaatarBranches } from '@/lib/branches';
import { useSwiperControls } from '@/lib/useSwiperControls';

export default function BranchesSlider() {
  const { prevRef, nextRef, pagRef, ready } = useSwiperControls();
  const branches = listUlaanbaatarBranches();

  return (
    <section className="position-relative">
      <div className="container">
        <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-3">Салбарууд</h4>
        <div className="position-relative">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1.2}
            spaceBetween={4}
            slidesPerGroup={1}
            centeredSlides
            watchSlidesProgress
            preventClicks={false}
            preventClicksPropagation={false}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 8, slidesPerGroup: 2, centeredSlides: false },
              1200: { slidesPerView: 4, spaceBetween: 8, slidesPerGroup: 2, centeredSlides: false },
            }}
            pagination={ready ? { el: pagRef.current, clickable: true, dynamicBullets: true } : false}
            navigation={ready ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
            className="swiper branchesSlider zindex-1 pb-4"
          >
            {branches.map((branch) => (
              <SwiperSlide key={branch.id} className="h-auto position-relative">
                <Link
                  href={`/branches?branch=${encodeURIComponent(branch.id)}`}
                  className="d-flex flex-column border border-dark10 h-100 rounded-3 overflow-hidden text-decoration-none text-reset"
                >
                  <div className="position-relative">
                    <div className="d-block">
                      <div className="hoverEffect">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(branch.image)} alt="" className="w-100 h-auto ratio43 img-cover" />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-grow-1 p-2 bg-white fc-dark">
                    <strong className="text-uppercase">{branch.name}</strong>
                    <span className="flex-grow-1 d-block lh-sm">{branch.address}</span>
                    <span className="d-block fs-12 fc-gray mt-1">{branch.hours}</span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <div ref={pagRef} className="swiper-pagination featuredSlide-pagination" />
          </Swiper>
        </div>
        <div className="position-absolute top-50 translate-middle-y w-100 start-0 zindex-1 d-sm-block d-none">
          <div className="container position-relative">
            <button type="button" ref={prevRef} className="swiper-button-prev m-0 featuredSlidePrev bg-white p-2 m-0 border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/chevronLeft.svg')} alt="" className="w-20 h-20" />
            </button>
            <button type="button" ref={nextRef} className="swiper-button-next m-0 featuredSlideNext bg-white p-2 m-0 border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/chevronRight.svg')} alt="" className="w-20 h-20" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
