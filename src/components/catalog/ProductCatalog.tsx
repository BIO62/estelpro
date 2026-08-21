import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import ProductCard from '@/components/ui/ProductCard';
import {
  getSyliusProductsCollection,
  getSyliusTaxons,
  toCatalogProduct,
  toMenuTaxons,
  type ProductSort,
} from '@/lib/api/sylius';
import { isDresserTaxonCode } from '@/lib/catalog-audience';

const PAGE_SIZE = 12;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function catalogHref(
  basePath: string,
  params: { taxon?: string; sort?: string; page?: number }
) {
  const query = new URLSearchParams();
  if (params.taxon) query.set('taxon', params.taxon);
  if (params.sort && params.sort !== 'newest') query.set('sort', params.sort);
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
  const sort = (firstParam(sp.sort) as ProductSort) || 'newest';
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);

  const [collection, taxons] = await Promise.all([
    getSyliusProductsCollection({
      taxonCode: taxon,
      page,
      itemsPerPage: PAGE_SIZE,
      sort: forceNew ? 'newest' : sort,
      audience,
    }),
    getSyliusTaxons(),
  ]);

  const menuTaxons = toMenuTaxons(taxons, audience).filter((item) => item.code !== 'all_products');
  const currentTaxon =
    menuTaxons.find((item) => item.code === taxon) ||
    menuTaxons.flatMap((item) => item.children).find((item) => item.code === taxon);
  const products = collection.items.map((item) => toCatalogProduct(item, { forceNew }));
  const knownTotal = collection.total;
  const totalPages = knownTotal
    ? Math.max(1, Math.ceil(knownTotal / PAGE_SIZE))
    : page + (products.length === PAGE_SIZE ? 1 : 0);
  const countLabel = knownTotal || products.length;
  const title = currentTaxon?.name || defaultTitle;
  const sortOptions: { value: ProductSort; label: string }[] = [
    { value: 'newest', label: 'Шинэ эхэндээ' },
    { value: 'price-asc', label: 'Үнэ: багаас их' },
    { value: 'price-desc', label: 'Үнэ: ихээс бага' },
    { value: 'onsale', label: 'Хямдралтай' },
  ];
  const sortLabel = sortOptions.find((item) => item.value === sort)?.label || 'Шинэ эхэндээ';

  const taxonLinks = menuTaxons.map((item) => (
    <Link
      key={item.code}
      href={catalogHref(basePath, { taxon: item.code, sort })}
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
          <div className="row g-4">
            <div className="col-lg-3 d-none d-lg-block">
              <div className="filter-section">
                <span className="filter-label d-block mb-3">Ангилал</span>
                <div className="d-flex flex-column">{taxonLinks}</div>
              </div>
            </div>

            <div className="col-12 col-lg-9">
              <div className="position-relative overflow-hidden rounded-4 mb-4" style={{ height: '200px' }}>
                <img
                  src={assetUrl('images/demo/slide3.webp')}
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
                  <button type="button" className="btn btn-outline-secondary btn-sm d-lg-none d-flex align-items-center gap-1" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
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
                            href={catalogHref(basePath, { taxon, sort: option.value })}
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

              <div className="row g-3" id="productGrid">
                {products.map((product) => (
                  <div className="col-6 col-md-4" key={product.id}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center" aria-label="Page navigation">
                  <ul className="pagination pagination-sm gap-1 mb-0">
                    <li className={`page-item${page <= 1 ? ' disabled' : ''}`}>
                      <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, sort, page: page - 1 })}>
                        <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" />
                      </Link>
                    </li>
                    {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((n) => (
                      <li className={`page-item${n === page ? ' active' : ''}`} key={n}>
                        <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, sort, page: n })}>
                          {n}
                        </Link>
                      </li>
                    ))}
                    <li className={`page-item${page >= totalPages ? ' disabled' : ''}`}>
                      <Link className="page-link rounded-3 border-0" href={catalogHref(basePath, { taxon, sort, page: page + 1 })}>
                        <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="w-16 h-16" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
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
          </div>
          <div className="pt-3">
            <button type="button" className="btn btn-main w-100 p-3" data-bs-dismiss="offcanvas">Шүүлт хэрэглэх</button>
          </div>
        </div>
      </div>
    </>
  );
}
