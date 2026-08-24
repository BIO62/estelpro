import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import MasonryGrid from '@/components/catalog/MasonryGrid';
import ProductCard from '@/components/ui/ProductCard';
import {
  getAllSyliusProducts,
  getSyliusTaxons,
  sortSyliusProducts,
  toCatalogProduct,
  toMenuTaxons,
  type ProductSort,
} from '@/lib/api/sylius';
import { isDresserTaxonCode } from '@/lib/catalog-audience';
import { getMenuBrand, MENU_BRANDS, productMatchesBrand } from '@/lib/brands';

const PAGE_SIZE = 24;

const LISTING_PATTERN: { layout: 's' | 'l' | 'h' }[] = [
  { layout: 's' },
  { layout: 's' },
  { layout: 'l' },
  { layout: 'l' },
  { layout: 's' },
  { layout: 's' },
  { layout: 's' },
  { layout: 's' },
  { layout: 'l' },
  { layout: 's' },
  { layout: 's' },
  { layout: 'h' },
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

  const [allProducts, taxons] = await Promise.all([
    getAllSyliusProducts({
      taxonCode: taxon,
      audience,
    }),
    getSyliusTaxons(),
  ]);

  const menuTaxons = toMenuTaxons(taxons, audience).filter((item) => item.code !== 'all_products');
  const currentTaxon =
    menuTaxons.find((item) => item.code === taxon) ||
    menuTaxons.flatMap((item) => item.children).find((item) => item.code === taxon);
  const currentBrand = getMenuBrand(brand);
  const branded = brand ? allProducts.filter((item) => productMatchesBrand(item, brand)) : allProducts;
  const sorted = sortSyliusProducts(
    branded,
    forceNew ? 'newest' : sort,
    `${taxon || 'all'}:${brand || 'all'}:${branded.length}`
  );
  const knownTotal = sorted.length;
  const totalPages = Math.max(1, Math.ceil(knownTotal / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const products = sorted
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    .map((item) => toCatalogProduct(item, { forceNew }));
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
                    <img src={assetUrl('images/icons/swap.svg')} alt="" className="w-16 h-16" />
                    <span className="fs-13">Шүүлт</span>
                  </button>
                  <div className="dropdown">
                    <button className="btn d-flex align-items-center gap-2 px-3 py-2 fs-13 bg-white fc-dark rounded-pill border" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <span>{sortLabel}</span>
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
                    <div className={`ga-plp-item ga-plp-item--${slot.layout}`} key={product.id}>
                      <ProductCard {...product} layout={slot.layout} />
                    </div>
                  );
                })}
              </MasonryGrid>

              {totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center" aria-label="Page navigation">
                  <ul className="pagination pagination-sm gap-1 mb-0">
                    <li className={`page-item${safePage <= 1 ? ' disabled' : ''}`}>
                      <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, brand, sort, page: safePage - 1 })}>
                        <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" />
                      </Link>
                    </li>
                    {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                      const window = Math.min(totalPages, 8);
                      const start = Math.max(1, Math.min(safePage - 3, totalPages - window + 1));
                      return start + i;
                    })
                      .filter((n) => n >= 1 && n <= totalPages)
                      .map((n) => (
                      <li className={`page-item${n === safePage ? ' active' : ''}`} key={n}>
                        <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, brand, sort, page: n })}>
                          {n}
                        </Link>
                      </li>
                    ))}
                    <li className={`page-item${safePage >= totalPages ? ' disabled' : ''}`}>
                      <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, brand, sort, page: safePage + 1 })}>
                        <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="w-16 h-16" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
        </div>
      </section>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="filterCanvas" aria-labelledby="filterCanvasLabel">
        <div className="offcanvas-header border-bottom position-relative">
          <h6 className="offcanvas-title fw-bold text-uppercase" id="filterCanvasLabel">Шүүлт</h6>
          <button type="button" className="btn p-1 position-absolute top-0 end-0 mt-2 me-2" data-bs-dismiss="offcanvas" aria-label="Close">
            <img src={assetUrl('images/icons/timesGray.svg')} alt="" className="w-20 h-20" />
          </button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <div className="flex-grow-1">
            <div className="filter-section">
              <span className="filter-label d-block mb-3">Ангилал</span>
              <div className="d-flex flex-column">{taxonLinks}</div>
            </div>
            <div className="filter-section mt-4">
              <span className="filter-label d-block mb-3">Брэнд</span>
              <div className="d-flex flex-column">
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
          <div className="pt-3">
            <button type="button" className="btn btn-main w-100 p-3" data-bs-dismiss="offcanvas">Шүүлт хэрэглэх</button>
          </div>
        </div>
      </div>
    </>
  );
}
