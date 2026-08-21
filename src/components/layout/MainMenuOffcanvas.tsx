'use client';

import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { assetUrl } from '@/lib/constants';
import type { MenuTaxon } from '@/lib/api/sylius';

const TAXON_IMAGES: Record<string, string> = {
  hair_coloring: 'images/taxon/үсний будаг.jpg',
  hair_care: 'images/taxon/үс арчилгаа.jpg',
  skin_body: 'images/taxon/арьс & бие арчилгаа.jpg',
  Alpha: 'images/taxon/Alpha.jpg',
  kids_care: 'images/taxon/хүүхдийн арчилгаа.jpg',
  styling: 'images/taxon/хэлбэржүүлэлт.jpg',
  all_products: 'images/taxon/бүх бүтээгдэхүүн.jpg',
};

const TAXON_FALLBACK = 'images/taxon/бүх бүтээгдэхүүн.jpg';

import { MENU_BRANDS } from '@/lib/brands';

function closeMainMenu() {
  const el = document.getElementById('mainMenuCanvas');
  if (!el) return;
  document.querySelectorAll('.navigationLevelOne.active, .navigationLevelTwo.active').forEach((node) => {
    node.classList.remove('active');
  });
  const Offcanvas = (
    window as Window & {
      bootstrap?: { Offcanvas?: { getOrCreateInstance: (node: Element) => { hide: () => void } } };
    }
  ).bootstrap?.Offcanvas;
  if (Offcanvas) {
    Offcanvas.getOrCreateInstance(el).hide();
    return;
  }
  el.classList.remove('show');
  document.querySelector('.offcanvas-backdrop')?.remove();
  document.body.classList.remove('offcanvas-open');
  document.body.style.removeProperty('overflow');
}

function MenuLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMainMenu();
    router.push(href);
  };
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function MainMenuOffcanvas({ taxons = [] }: { taxons?: MenuTaxon[] }) {
  const categories = taxons.length
    ? taxons
    : [
        { code: 'hair_care', name: 'Үс арчилгаа', children: [] },
        { code: 'skin_body', name: 'Арьс & Бие арчилгаа', children: [] },
        { code: 'Alpha', name: 'Alpha', children: [] },
        { code: 'kids_care', name: 'Хүүхдийн арчилгаа', children: [] },
        { code: 'styling', name: 'Хэлбэржүүлэлт', children: [] },
        { code: 'all_products', name: 'Бүх бүтээгдэхүүн', children: [] },
      ];

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
            <MenuLink href="/list" className="btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Бүх бүтээгдэхүүн</span>
            </MenuLink>
            <hr className="my-1 opacity-10" />
            <button type="button" className="navigationButton btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Ангилал</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" />
            </button>
            <div className="position-absolute bg-white zindex-1 navigationLevelOne top-0 h-100 start-0 w-100 overflow-y-auto overflow-x-hidden pb-4">
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-3 d-flex ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              <div className="row row-cols-2 gx-2 gy-3 navTileGrid">
                {categories.map((cat) => {
                  const href =
                    cat.code === 'all_products' ? '/list' : `/list?taxon=${encodeURIComponent(cat.code)}`;
                  const hasChildren = cat.children.length > 0 && cat.code !== 'all_products';
                  return (
                    <div className="col" key={cat.code}>
                      {hasChildren ? (
                        <button
                          type="button"
                          className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark border-0 bg-white text-start p-0"
                          data-cat={cat.code}
                        >
                          <div className="singleNavImage rounded-3 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={assetUrl(TAXON_IMAGES[cat.code] || TAXON_FALLBACK)} alt="" className="w-100 h-auto ratio-11" />
                          </div>
                          <span className="flex-grow-1 fs-12 text-uppercase">{cat.name}</span>
                        </button>
                      ) : (
                        <MenuLink href={href} className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark">
                          <div className="singleNavImage rounded-3 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={assetUrl(TAXON_IMAGES[cat.code] || TAXON_FALLBACK)} alt="" className="w-100 h-auto ratio-11" />
                          </div>
                          <span className="flex-grow-1 fs-12 text-uppercase">{cat.name}</span>
                        </MenuLink>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="position-absolute bg-white zindex-1 navigationLevelTwo top-0 h-100 start-0 w-100 overflow-y-auto overflow-x-hidden pb-4">
  
  {/* 1. Буцах 2 товчлуур (Дээр дороо цэвэрхэн, шууд буцна) */}
  <div className="d-flex flex-column gap-1 mb-2">
    <button 
      type="button" 
      onClick={() => {
        document.querySelectorAll('.navigationLevelOne.active, .navigationLevelTwo.active').forEach((el) => el.classList.remove('active'));
      }}
      className="btn btn-back border-0 py-2 px-0 d-flex align-items-center text-start w-100"
    >
      <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="me-2 d-flex" />
      <span className="flex-grow-1 fs-12 text-uppercase fw-medium">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
    </button>
    
    <button 
      type="button" 
      onClick={(e) => {
        e.currentTarget.closest('.navigationLevelTwo')?.classList.remove('active');
      }}
      className="btn btn-back border-0 py-2 px-0 d-flex align-items-center text-start w-100"
    >
      <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="me-2" />
      <span className="flex-grow-1 fs-12 text-uppercase fw-medium">АНГИЛЛЫН ЦЭС РҮҮ БУЦАХ</span>
    </button>
  </div>

  {/* Зааглагч зураас */}
  <hr className="my-2 opacity-10" />

  {/* 2. Дэд ангиллын жагсаалт */}
  {categories.map((cat) => (
    <div key={cat.code} data-subcat={cat.code} className="d-none flex-column gap-2 pt-1">
      {cat.children.map((item) => (
        <MenuLink
          key={item.code}
          href={`/list?taxon=${encodeURIComponent(item.code)}`}
          className="d-flex align-items-center justify-content-between text-decoration-none fc-dark bg-light rounded-3 px-3 py-2.5"
        >
          <span className="fs-13 fw-normal">{item.name}</span>
          <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="opacity-50" />
        </MenuLink>
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
              <button type="button" className="btn btn-back border-0 py-2 px-0 mb-3 d-flex ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" />
                <span className="flex-grow-1 fs-12 text-uppercase">ҮНДСЭН ЦЭС РҮҮ БУЦАХ</span>
              </button>
              <div className="row row-cols-2 gx-2 gy-3 navTileGrid">
                {MENU_BRANDS.map((brand) => (
                  <div className="col" key={brand.slug}>
                    <MenuLink href={`/list?brand=${encodeURIComponent(brand.slug)}`} className="singleNav d-flex flex-column gap-2 text-decoration-none fc-dark">
                      <div className="singleNavImage rounded-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl(brand.img)} alt="" className="w-100 h-auto ratio-11" />
                      </div>
                      <span className="fs-11 text-uppercase">{brand.name}</span>
                    </MenuLink>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-1 opacity-10" />
            <MenuLink href="/new" className="btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Шинэ бүтээгдэхүүн</span>
            </MenuLink>
            <MenuLink href="/new" className="d-block my-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/taxon/800x375 taxon banner.jpg')} alt="" className="w-100 h-auto" />
            </MenuLink>
            <MenuLink href="/list?sort=onsale" className="btn text-start d-flex align-items-center border-0 p-3">
              <span className="me-2 fs-12 text-uppercase">Хямдрал</span>
              <div className="d-flex align-items-center flex-grow-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/alarm.svg')} alt="" className="me-1" />
                <span className="fw-semibold fs-12 fc-red">1 өдөр 15:17:55</span>
              </div>
            </MenuLink>
            <hr className="my-1 opacity-10" />
            <MenuLink href="/academy" className="btn text-start d-flex align-items-center border-0 p-3">
              <span className="flex-grow-1 fs-12 text-uppercase">Академи</span>
            </MenuLink>
          </div>
          <hr className="my-1 opacity-10" />
          <MenuLink href="/login" className="btn text-start d-flex align-items-center border-0 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/user.svg')} alt="" className="me-2" />
            <span className="flex-grow-1 fs-12 text-uppercase">Нэвтрэх</span>
          </MenuLink>
        </div>
      </div>
    </div>
  );
}
