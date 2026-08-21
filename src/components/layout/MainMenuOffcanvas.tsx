'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

const categories = [
  { name: 'Үсний будаг', img: 'images/demo/category1.avif', cat: 'hair-dye' },
  { name: 'Үс арчилгаа', img: 'images/demo/category2.avif', cat: 'hair-care' },
  { name: 'Арьс & Бие арчилгаа', img: 'images/demo/category3.avif', cat: 'skin-body' },
  { name: 'Alpha', img: 'images/demo/category4.avif', cat: 'alpha' },
  { name: 'Хүүхдийн арчилгаа', img: 'images/demo/category5.avif', href: '/products' },
  { name: 'Хэлбэржүүлэлт', img: 'images/demo/category6.avif', cat: 'styling' },
  { name: 'Бүх бүтээгдэхүүн', img: 'images/demo/category6.avif', href: '/products' },
];

const brands = [
  { name: 'Couture Luxury', img: 'images/brands/500x500px logo 1.jpg' },
  { name: 'Otium', img: 'images/brands/500x500px logo 2.jpg' },
  { name: 'Обними', img: 'images/brands/500x500px logo 3.jpg' },
  { name: 'Prima Blonde', img: 'images/brands/500x500px logo 4.jpg' },
  { name: 'Estel 18+', img: 'images/brands/500x500px logo 5.jpg' },
  { name: 'Keratin+', img: 'images/brands/500x500px logo 6.jpg' },
  { name: 'Q3 Comfort', img: 'images/brands/500x500px logo 7.jpg' },
  { name: 'Lissage', img: 'images/brands/500x500px logo 8.jpg' },
  { name: 'reHair', img: 'images/brands/500x500px logo 9.jpg' },
  { name: 'Alpha', img: 'images/brands/500x500px logo 10.jpg' },
  { name: 'Little ME', img: 'images/brands/500x500px logo 11.jpg' },
  { name: 'Airex', img: 'images/brands/500x500px logo 12.jpg' },
];

const subcats: Record<string, string[]> = {
  'hair-dye': ['Signature', 'Love'],
  'hair-care': [
    'Хуурай',
    'Тослог',
    'Хагтай',
    'Будагтай',
    'Гэмтэлтэй',
    'Ургалт дэмжих',
    'Цайралттай',
    'Шулуун химитэй',
    'Буржгар химитэй',
    'Нарийн ширхэгтэй',
    'Нарны хамгаалалттай',
    'Бүх төрлийн',
    'Хуурай шампунь',
    'Хүүхдийн',
    'Эрчүүдийн',
    'Бүх бүтээгдэхүүн',
  ],
  'skin-body': ['Нүүр', 'Гар', 'Бие', 'Хөлс дарагч', 'Бүх бүтээгдэхүүн'],
  alpha: [
    'Хагны эсрэг',
    'Уналтын эсрэг',
    'Гаатай',
    'Гүн чийгшүүлэх',
    'Эмзэг мэдрэмттэй',
    'Хөлс дарагч',
    'Шудний ОО',
    'Гарын тос',
    'Хэлбэржүүлэгч',
    'Бие',
    'Сахал',
    'Бүх бүтээгдэхүүн',
  ],
  styling: ['Вакс', 'Гель', 'Лак', 'Хөөс & Хэв баригч', 'Индүү сэнсний хамгаалалт', 'Уг босгогч', 'Сахал', 'Бүх бүтээгдэхүүн'],
};

export default function MainMenuOffcanvas() {
  return (
    <div
      className="offcanvas offcanvas-start mainMenuCanvas"
      tabIndex={-1}
      id="mainMenuCanvas"
      aria-labelledby="mainMenuCanvasLabel"
    >
      <div className="offcanvas-body d-flex flex-column">
        <div className="d-flex flex-column flex-grow-1 mb-3">
          <div className="d-flex mb-3 gap-2">
            <div className="d-flex border align-items-center rounded-3 flex-grow-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/search.svg')} alt="" className="w-20 h-20 ms-3" />
              <input type="search" className="form-control border-0 flex-grow-1 shadow-none fs-14 p-3" placeholder="Хайх..." />
            </div>
            <button type="button" className="btn btn-light p-3" data-bs-dismiss="offcanvas" aria-label="Close">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/times.svg')} alt="" />
            </button>
          </div>
          <div className="position-relative d-flex flex-column flex-grow-1">
            <Link href="/products" className="btn text-start d-flex align-items-center border-0 p-3" data-bs-dismiss="offcanvas">
              <span className="flex-grow-1 fs-12 text-uppercase">Бүх бүтээгдэхүүн</span>
            </Link>
            <hr className="my-1 opacity-10" />
            <button type="button" className="navigationButton btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Ангилал</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" />
            </button>
            <div className="position-absolute bg-white zindex-1 navigationLevelOne top-0 h-100 start-0 w-100 overflow-y-auto overflow-x-hidden pb-4">
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              <div className="row row-cols-2 gx-2 gy-3">
                {categories.map((cat) => (
                  <div className="col" key={cat.name}>
                    {cat.href ? (
                      <Link href={cat.href} className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark" data-bs-dismiss="offcanvas">
                        <div className="singleNavImage rounded-3 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={assetUrl(cat.img)} alt="" className="w-100 h-auto ratio-11" />
                        </div>
                        <span className="flex-grow-1 fs-12 text-uppercase">{cat.name}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark border-0 bg-white text-start p-0"
                        data-cat={cat.cat}
                      >
                        <div className="singleNavImage rounded-3 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={assetUrl(cat.img)} alt="" className="w-100 h-auto ratio-11" />
                        </div>
                        <span className="flex-grow-1 fs-12 text-uppercase">{cat.name}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="position-absolute bg-white zindex-1 navigationLevelTwo top-0 h-100 start-0 w-100 overflow-y-auto overflow-x-hidden pb-4">
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">АНГИЛЛЫН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              {Object.entries(subcats).map(([key, items]) => (
                <div key={key} data-subcat={key} className="d-none flex-column gap-2">
                  {items.map((item) => (
                    <Link
                      key={item}
                      href="/products"
                      className="d-flex align-items-center text-decoration-none fc-dark bg-light rounded-3 px-3 py-2"
                      data-bs-dismiss="offcanvas"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <hr className="my-1 opacity-10" />
            <button type="button" className="navigationButton btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Брэнд</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" />
            </button>
            <div className="position-absolute bg-white zindex-1 navigationLevelOne top-0 h-100 start-0 w-100 overflow-y-auto overflow-x-hidden pb-4">
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              <div className="row row-cols-2 gx-2 gy-3">
                {brands.map((brand) => (
                  <div className="col" key={brand.name}>
                    <Link href="/products" className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark" data-bs-dismiss="offcanvas">
                      <div className="singleNavImage rounded-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(brand.img)} alt="" className="w-100 h-auto ratio-11" />
                      </div>
                      <span className="fs-11 text-uppercase">{brand.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-1 opacity-10" />
            <Link href="/products" className="btn text-start d-flex align-items-center border-0 p-3" data-bs-dismiss="offcanvas">
              <span className="flex-grow-1 fs-12 text-uppercase">Шинэ бүтээгдэхүүн</span>
            </Link>
            <Link href="/products" className="d-block my-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/demo/menuBanner.webp')} alt="" className="w-100 h-auto" />
            </Link>
            <Link href="/products" className="btn text-start d-flex align-items-center border-0 p-3" data-bs-dismiss="offcanvas">
              <span className="me-2 fs-12 text-uppercase">Хямдрал</span>
              <div className="d-flex align-items-center flex-grow-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/alarm.svg')} alt="" className="me-1" />
                <span className="fw-semibold fs-12 fc-red">1 өдөр 15:17:55</span>
              </div>
            </Link>
            <hr className="my-1 opacity-10" />
            <Link href="/academy" className="btn text-start d-flex align-items-center border-0 p-3" data-bs-dismiss="offcanvas">
              <span className="flex-grow-1 fs-12 text-uppercase">Академи</span>
            </Link>
          </div>
          <hr className="my-1 opacity-10" />
          <Link href="/login" className="btn text-start d-flex align-items-center border-0 p-3" data-bs-dismiss="offcanvas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/user.svg')} alt="" className="me-2" />
            <span className="flex-grow-1 fs-12 text-uppercase">Нэвтрэх</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
