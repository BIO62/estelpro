import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import MasonryGrid from '@/components/catalog/MasonryGrid';
import ProductCard from '@/components/ui/ProductCard';
import {
  getStorefrontProducts,
  storefrontMenuTaxons,
  storefrontProductMatchesBrand,
  sortStorefrontProducts,
  toStorefrontProduct,
  type ProductSort,
} from '@/lib/storefront-products';
import { isDresserTaxonCode } from '@/lib/catalog-audience';
import { getMenuBrand, MENU_BRANDS } from '@/lib/brands';
import { getSessionUser } from '@/lib/auth/session';

const PAGE_SIZE = 24;

const LISTING_PATTERN: { layout: 's' | 'l' }[] = [
  { layout: 's' },
  { layout: 's' },
  { layout: 'l' },
  { layout: 'l' },
  { layout: 's' },
  { layout: 's' },
];

function listingSlot(index: number) {
  return LISTING_PATTERN[index % LISTING_PATTERN.length];
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function catalogHref(
  basePath: string,
  params: { taxon?: string; brand?: string; sort?: string; page?: number }
) {
  const query = new URLSearchParams();
  if (params.taxon) query.set('taxon', params.taxon);
  if (params.brand) query.set('brand', params.brand);
  if (params.sort && params.sort !== 'random') query.set('sort', params.sort);
  if (params.page && params.page > 1) query.set('page', String(params.page));
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default async function ProductCatalog({
  searchParams,
  basePath,
  forceNew = false,
  defaultTitle,
  audience = 'consumer',
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  basePath: string;
  forceNew?: boolean;
  defaultTitle: string;
  audience?: 'consumer' | 'dresser';
}) {
  const sp = await searchParams;
  let taxon = firstParam(sp.taxon);
  if (audience === 'consumer' && isDresserTaxonCode(taxon)) taxon = undefined;
  if (audience === 'dresser' && (!taxon || !isDresserTaxonCode(taxon))) taxon = 'hair_coloring';
  const brand = getMenuBrand(firstParam(sp.brand))?.slug;
  const sort = ((firstParam(sp.sort) as ProductSort) || (forceNew ? 'newest' : 'random')) as ProductSort;
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);
  const session = audience === 'dresser' ? await getSessionUser() : null;
  const contractPercent = session?.role === 'salon' ? session.discountPercent || 0 : 0;

  const { items: allProducts } = await getStorefrontProducts({
    taxon,
    audience,
  });
  const menuTaxons = storefrontMenuTaxons(audience);
  const currentTaxon =
    menuTaxons.find((item) => item.code === taxon) ||
    menuTaxons.flatMap((item) => item.children).find((item) => item.code === taxon);
  const currentBrand = getMenuBrand(brand);
  const branded = brand ? allProducts.filter((item) => storefrontProductMatchesBrand(item, brand)) : allProducts;
  const sorted = sortStorefrontProducts(
    branded,
    forceNew ? 'newest' : sort,
    `${taxon || 'all'}:${brand || 'all'}:${branded.length}`
  );
  const knownTotal = sorted.length;
  const totalPages = Math.max(1, Math.ceil(knownTotal / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const products = sorted
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    .map((item) => toStorefrontProduct(item, { forceNew, contractPercent }));
  const countLabel = knownTotal;
  const title = currentBrand?.name || currentTaxon?.name || defaultTitle;
  const sortOptions: { value: ProductSort; label: string }[] = forceNew
    ? [
        { value: 'newest', label: 'Шинэ эхэндээ' },
        { value: 'price-asc', label: 'Үнэ: багаас их' },
        { value: 'price-desc', label: 'Үнэ: ихээс бага' },
      ]
    : [
        { value: 'random', label: 'Санамсаргүй' },
        { value: 'newest', label: 'Шинэ эхэндээ' },
        { value: 'price-asc', label: 'Үнэ: багаас их' },
        { value: 'price-desc', label: 'Үнэ: ихээс бага' },
        { value: 'onsale', label: 'Хямдралтай' },
      ];
  const sortLabel = sortOptions.find((item) => item.value === sort)?.label || sortOptions[0].label;

  const taxonLinks = menuTaxons.map((item) => (
    <Link
      key={item.code}
      href={catalogHref(basePath, { taxon: item.code, brand, sort })}
      className="filter-check text-decoration-none"
    >
      <span className={`filter-check-box${taxon === item.code ? ' bg-main' : ''}`} />
      <span className="fs-13 fc-dark">{item.name}</span>
    </Link>
  ));

  return (
    <>
      <section className="py-4">
        <div className="container">
          <div className="position-relative overflow-hidden rounded-4 mb-4 ga-plp-banner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl('images/taxon/800x375 taxon banner.jpg')}
              alt={title}
              style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(90deg,rgba(8,18,32,.85) 0%,rgba(8,18,32,.45) 55%,transparent 100%)' }} />
          </div>

          <div className="mb-3">
            <h1 className="fw-bold fs-4 mb-1">{title}</h1>
            <span className="fc-secondary fs-13">хайлтын илэрц</span>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
            <span className="fc-secondary fs-14">
              <strong className="fc-dark">{countLabel}</strong> бараа олдлоо
            </span>
            <div className="d-flex align-items-center gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/icons/swap.svg')} alt="" className="w-16 h-16" />
                <span className="fs-13">Шүүлт</span>
              </button>
              <div className="dropdown">
                <button className="btn d-flex align-items-center gap-2 px-3 py-2 fs-13 bg-white fc-dark rounded-pill border" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <span>{sortLabel}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/icons/chevronDownSmall.svg')} alt="" className="w-16 h-16" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 rounded-3 py-2 mt-1" style={{ minWidth: '200px', boxShadow: '0 8px 24px rgba(0,0,0,.10)' }}>
                  {sortOptions.map((option) => (
                    <li key={option.value}>
                      <Link
                        href={catalogHref(basePath, { taxon, brand, sort: option.value })}
                        className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-13${sort === option.value ? ' fw-semibold fc-main' : ''}`}
                      >
                        {option.label}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assetUrl('images/icons/check.svg')} alt="" className={`w-16 h-16${sort === option.value ? '' : ' opacity-0'}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <MasonryGrid className="ga-plp-grid" id="productGrid">
            {products.map((product, index) => {
              const slot = listingSlot(index);
              return (
                <div
                  key={product.id}
                  className={`ga-plp-grid__item ga-plp-item ga-plp-item--${slot.layout}`}
                  data-layout={slot.layout}
                >
                  <ProductCard {...product} layout={slot.layout} />
                </div>
              );
            })}
          </MasonryGrid>

          {products.length === 0 ? (
            <div className="border rounded-4 px-4 py-5 text-center">
              <h2 className="fs-6 fw-semibold mb-2">Бүтээгдэхүүн олдсонгүй</h2>
              <p className="fs-13 fc-secondary mb-3">Шүүлтүүрээ цэвэрлээд дахин оролдоно уу.</p>
              <Link href={basePath} className="btn btn-main btn-sm px-4">
                Бүх бүтээгдэхүүн
              </Link>
            </div>
          ) : null}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
              <Link
                href={catalogHref(basePath, { taxon, brand, sort, page: Math.max(1, safePage - 1) })}
                className={`btn btn-outline-secondary btn-sm px-3${safePage <= 1 ? ' disabled' : ''}`}
              >
                Өмнөх
              </Link>
              <span className="fs-13 fc-secondary">
                {safePage} / {totalPages}
              </span>
              <Link
                href={catalogHref(basePath, { taxon, brand, sort, page: Math.min(totalPages, safePage + 1) })}
                className={`btn btn-outline-secondary btn-sm px-3${safePage >= totalPages ? ' disabled' : ''}`}
              >
                Дараах
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Filter Offcanvas */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="filterCanvas" aria-labelledby="filterCanvasLabel">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fs-16 fw-bold" id="filterCanvasLabel">
            Шүүлтүүр
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-4">
            <h6 className="fw-semibold fs-14 mb-2">Ангилал</h6>
            <div className="d-flex flex-column gap-2">{taxonLinks}</div>
          </div>

          <div className="mb-4">
            <h6 className="fw-semibold fs-14 mb-2">Брэнд</h6>
            <div className="d-flex flex-column gap-2">
              {MENU_BRANDS.map((item) => (
                <Link
                  key={item.slug}
                  href={catalogHref(basePath, { taxon, brand: item.slug, sort })}
                  className="filter-check text-decoration-none"
                >
                  <span className={`filter-check-box${brand === item.slug ? ' bg-main' : ''}`} />
                  <span className="fs-13 fc-dark">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
