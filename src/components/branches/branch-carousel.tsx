'use client';

import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { assetUrl } from '@/lib/constants';
import { branchFullAddress, type Branch } from '@/lib/branches';

type BranchCarouselProps = {
  branches: Branch[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSwiper?: (swiper: SwiperType) => void;
};

export default function BranchCarousel({ branches, selectedId, onSelect, onSwiper }: BranchCarouselProps) {
  return (
    <div className="pt-2 overflow-x-hidden">
      <Swiper
        modules={[Navigation]}
        onSwiper={onSwiper}
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={{
          768: { slidesPerView: 2.5 },
          1200: { slidesPerView: 4 },
        }}
        className="branchesSlide overflow-visible pb-2"
        onSlideChange={(swiper) => {
          const branch = branches[swiper.activeIndex];
          if (branch) onSelect(branch.id);
        }}
      >
        {branches.map((branch) => (
          <SwiperSlide key={branch.id}>
            <button
              type="button"
              className={`d-flex flex-column h-100 rounded-4 overflow-hidden border w-100 text-start bg-white branch-slide-card${
                branch.id === selectedId ? ' branch-slide-card--active' : ''
              }`}
              onClick={() => onSelect(branch.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(branch.image)} alt="" className="w-100 h-160 img-cover" />
              <div className="d-flex p-3 flex-column gap-1 flex-grow-1">
                <strong className="flex-grow-1 fc-dark">{branch.name}</strong>
                <span className="fc-gray fs-14">{branchFullAddress(branch)}</span>
                <span className="fc-gray fs-14">{branch.hours}</span>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
