'use client';

import { useMemo, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BranchCarousel from '@/components/branches/branch-carousel';
import BranchMapPanel from '@/components/branches/branch-map-panel';
import { assetUrl } from '@/lib/constants';
import {
  branchFullAddress,
  branchGallery,
  branchGoogleMapsUrl,
  branchServices,
  DEFAULT_BRANCH_ID,
  listBranches,
} from '@/lib/branches';

type Tab = 'stores' | 'map';

export default function BranchShowroom({ initialBranchId }: { initialBranchId?: string }) {
  const branches = listBranches();
  const [tab, setTab] = useState<Tab>('stores');
  const [selectedId, setSelectedId] = useState(
    () =>
      branches.find((b) => b.id === initialBranchId)?.id ||
      branches.find((b) => b.id === DEFAULT_BRANCH_ID)?.id ||
      branches[0]?.id ||
      '',
  );
  const [carousel, setCarousel] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const selected = useMemo(
    () => branches.find((branch) => branch.id === selectedId) || branches[0],
    [branches, selectedId],
  );

  const selectBranch = (id: string) => {
    setSelectedId(id);
    const index = branches.findIndex((branch) => branch.id === id);
    if (index >= 0) carousel?.slideTo(index);
  };

  if (!selected) return null;

  const gallery = branchGallery(selected);
  const services = branchServices(selected);
  const serviceCols = services.length === 4 ? 'row-cols-xl-4' : 'row-cols-xl-3';

  return (
    <div className="container branches-showroom pt-lg-5 pt-4">
      <div className="d-flex justify-content-center mb-3">
        <div className="d-flex gap-3 maxw-640 w-100">
          <button
            type="button"
            className={`btn px-3 w-100${tab === 'stores' ? ' btn-main' : ' btn-main-outline'}`}
            onClick={() => setTab('stores')}
          >
            Салбар дэлгүүрүүд
          </button>
          <button
            type="button"
            className={`btn px-3 w-100${tab === 'map' ? ' btn-main' : ' btn-main-outline'}`}
            onClick={() => setTab('map')}
          >
            Газрын зураг харах
          </button>
        </div>
      </div>

      <BranchCarousel
        branches={branches}
        selectedId={selectedId}
        onSelect={selectBranch}
        onSwiper={setCarousel}
      />

      {tab === 'map' ? (
        <BranchMapPanel selectedId={selectedId} onSelect={selectBranch} />
      ) : (
        <div className="pt-3">
          <div className="branch-services-panel bg-gray mb-4 p-4 rounded-4">
            <div className="row">
              <div className="offset-xl-1 col-xl-10">
                <div className={`row ${serviceCols} row-cols-1 g-4`}>
                  {services.map((service) => (
                    <div key={service.id} className="col d-flex">
                      <div
                        className={`d-flex flex-column align-items-center branchService text-center w-100${
                          service.active ? ' active' : ''
                        }`}
                      >
                        <div className="branchService__icon-slot">
                        {service.logos?.length ? (
                          <div className="branch-service-logos">
                            {service.logos.map((logo) => (
                              <span key={logo.alt} className="branch-service-logo-wrap">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={assetUrl(logo.src)} alt={logo.alt} className="branch-service-logo" />
                              </span>
                            ))}
                          </div>
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/icons/checkBigBlue.svg" alt="" className="active w-48 h-48" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/icons/checkBigGray.svg" alt="" className="default w-48 h-48" />
                          </>
                        )}
                        </div>
                        <strong className="fs-18 mt-2">{service.title}</strong>
                        <span className="fs-14 fc-gray text-center">{service.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-sm-4 g-3 align-items-start">
            <div className="col-lg-7">
              <Swiper
                  modules={[Navigation, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  navigation
                  className="detailImage mx-0 mb-2 w-100"
                  spaceBetween={10}
                >
                  {gallery.map((src) => (
                    <SwiperSlide key={src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(src)} alt="" className="w-100 h-auto ratio169 img-cover rounded-3" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              {gallery.length > 1 ? (
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode
                  watchSlidesProgress
                  className="detailThumbs"
                >
                  {gallery.map((src) => (
                    <SwiperSlide key={`thumb-${src}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(src)} alt="" className="w-100 h-auto ratio169 img-cover rounded-2" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : null}
            </div>

            <div className="col-lg-5 pt-lg-0 pt-2">
              <div className="d-flex flex-column gap-2 mb-4">
                <h2 className="fs-3 fw-bold m-0">Хаяг</h2>
                <span className="fc-gray fs-14">{branchFullAddress(selected)}</span>
                <a
                  href={branchGoogleMapsUrl(selected)}
                  className="text-decoration-none fs-14 text-primary fw-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Maps дээр харах
                </a>
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <h2 className="fs-3 fw-bold m-0">Цагийн хуваарь</h2>
                <span className="fc-gray fs-14">{selected.hours}</span>
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <h2 className="fs-3 fw-bold m-0">Холбогдох дугаар</h2>
                <a href={`tel:${selected.phone.replace(/\s+/g, '')}`} className="fc-gray fs-14 text-decoration-none">
                  {selected.phone}
                </a>
              </div>
              <p className="fc-secondary fs-14 mb-0">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
