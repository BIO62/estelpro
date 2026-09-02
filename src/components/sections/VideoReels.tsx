'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { assetUrl } from '@/lib/constants';

const slides = [
  {
    title: 'OTIUM UNIQUE & Активатор',
    description:
      'Үс шингэрэх, унах хандлагатай үсэнд зориулсан шампунь. Хуйхыг зөөлөн цэвэрлэж, чийгийн тэнцвэрийг хадгалахад дэмжлэг үзүүлнэ.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/featured mob 800x1288 1 copy.jpg',
  },
  {
    title: 'Чийгшил & гялалзалт',
    description:
      'Тогтмол хэрэглэснээр үсийг илүү бат бөх, өтгөн, эрүүл байлгахад тусална. Гялалзсан, зөөлөн үс.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'video' as const,
    src: 'videos/reel1.mp4',
  },
  {
    title: 'Мэргэжлийн арчилгаа',
    description: 'ESTEL Professional — салоны үр дүнг гэртээ. Өдөр тутмын арчилгааны цогц шийдэл.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/featured mob 800x1288 2.jpg',
  },
  {
    title: 'Өнгө хамгаалалт',
    description: 'Өнгөтэй үсийг хамгаалж, гялалзлыг нэмэгдүүлнэ. Салоны дараах арчилгаанд тохиромжтой.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/product1.jpg',
  },
  {
    title: 'Хуйхны тэнцвэр',
    description: 'Хуйхыг цэвэрлэж, үсний үндсийг бэхжүүлнэ. Хөнгөн бүтэцтэй, өдөр бүр хэрэглэнэ.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'video' as const,
    src: 'videos/reel1.mp4',
  },
  {
    title: 'Гялалзсан төгсгөл',
    description: 'Үсний үзүүрийг тэжээж, хуурайшилтыг бууруулна. Зөөлөн, уян хатан үс.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/product6.jpg',
  },
  {
    title: 'Салоны дуртай',
    description: 'Мэргэжилтнүүдийн сонголт. Үр дүн нэг удаагийн хэрэглээнээс мэдэгдэнэ.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/1000x1000.jpg',
  },
  {
    title: 'Бүх үсний төрөлд',
    description: 'Нарийн, энгийн, бүдүүн үсэнд тохирно. Хүндрүүлэхгүй, хурдан шингэнэ.',
    href: '/list',
    cta: 'Худалдаж авах',
    type: 'image' as const,
    src: 'images/demo/product3.jpg',
  },
];

export default function VideoReels() {
  const [active, setActive] = useState(0);
  const mediaRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const syncMedia = (index: number) => {
    mediaRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index) {
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    syncMedia(active);
  }, [active]);

  const onChange = (swiper: SwiperType) => {
    setActive(swiper.activeIndex);
  };

  return (
    <section className="product-focus-tabs ugc-carousel" id="estel-ugc-carousel">
      <div className="product-focus-block" id="estel-ugc-carousel-block">
        <div className="product-focus-tabs__block">
          <div className="product-focus-tabs__block-content page-width">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`product-focus-tabs__block-content-inner js-slide-content${idx === active ? '' : ' hidden'}`}
                data-slide-index={idx}
              >
                <span className="product-focus-tabs__block-content-title">{slide.title}</span>
                <div className="product-focus-tabs__block-content-description">
                  <div className="metafield-rich_text_field">
                    <p>{slide.description}</p>
                  </div>
                </div>
                <Link href={slide.href} className="button">
                  {slide.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="product-focus-tabs__block-slider">
            <Swiper
              modules={[Pagination]}
              slidesPerView={1.15}
              spaceBetween={10}
              centeredSlides
              speed={450}
              watchSlidesProgress
              slideToClickedSlide
              pagination={{ clickable: true }}
              breakpoints={{
                750: {
                  slidesPerView: 3,
                  spaceBetween: 17,
                  centeredSlides: false,
                },
              }}
              onSlideChange={onChange}
              className="splide splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized"
            >
              {slides.map((slide, idx) => (
                <SwiperSlide
                  key={idx}
                  className="splide__slide"
                  data-slide-index={idx}
                >
                  <div className="product-focus-tabs__slide">
                    <div className="product-focus-tabs__slide-inner">
                      {slide.type === 'video' ? (
                        <video
                          ref={(el) => {
                            mediaRefs.current[idx] = el;
                          }}
                          playsInline
                          muted
                          loop
                          preload="metadata"
                          className={idx === active ? 'video-player playing' : 'video-player'}
                        >
                          <source src={assetUrl(slide.src)} type="video/mp4" />
                        </video>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={assetUrl(slide.src)} alt="" />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
