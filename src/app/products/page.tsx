'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { catalog } from '@/lib/products';

export default function ProductsPage() {

  useEffect(() => {
    const priceRange = document.getElementById('priceRange');
    const priceRangeVal = document.getElementById('priceRangeVal');
    const priceRangeMobile = document.getElementById('priceRangeMobile');
    const priceRangeValMobile = document.getElementById('priceRangeValMobile');
    const onPriceInput = (e: Event, valEl: HTMLElement | null) => {
      if (valEl) valEl.textContent = Number((e.target as HTMLInputElement).value).toLocaleString() + '₮';
    };
    priceRange?.addEventListener('input', (e) => onPriceInput(e, priceRangeVal));
    priceRangeMobile?.addEventListener('input', (e) => onPriceInput(e, priceRangeValMobile));
    const sortBtn = document.getElementById('sortDropdown');
    const sortChevron = sortBtn?.querySelector('img') as HTMLElement | null;
    const dropdown = sortBtn?.closest('.dropdown');
    dropdown?.addEventListener('show.bs.dropdown', () => { if (sortChevron) sortChevron.style.transform = 'rotate(180deg)'; });
    dropdown?.addEventListener('hide.bs.dropdown', () => { if (sortChevron) sortChevron.style.transform = ''; });
    document.querySelectorAll('.sort-option').forEach((btn) => {
      btn.addEventListener('click', function (this: HTMLElement) {
        const label = document.getElementById('sortLabel');
        if (label) label.textContent = this.dataset.label || '';
        document.querySelectorAll('.sort-option').forEach((b) => {
          b.classList.remove('fw-semibold', 'fc-main');
          b.querySelector('img')?.classList.add('opacity-0');
        });
        this.classList.add('fw-semibold', 'fc-main');
        this.querySelector('img')?.classList.remove('opacity-0');
      });
    });
  }, []);

  return (
    <>
      <section className="py-4">
            <div className="container">
              <div className="row g-4">
      
                
                <div className="col-lg-3 d-none">
                  <div>
      
                    
                    <div className="filter-section">
                      <button className="filter-collapse-btn mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#filterPrice" aria-expanded="true">
                        <span className="filter-label flex-grow-1 text-start">Үнийн хязгаар</span>
                        <img src={assetUrl('images/icons/chevronDownSmall.svg')} alt="" className="chevron w-16 h-16" />
                      </button>
                      <div className="collapse show" id="filterPrice">
                        <div className="price-pills">
                          <span className="price-pill">0₮</span>
                          <span className="price-sep">—</span>
                          <span className="price-pill" id="priceRangeVal">100,000₮</span>
                        </div>
                        <input type="range" className="filter-range" id="priceRange" min="0" max="100000" step="1000" value="100000" />
                      </div>
                    </div>
      
                    
                    <div className="filter-section">
                      <button className="filter-collapse-btn mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#filterCats" aria-expanded="true">
                        <span className="filter-label flex-grow-1 text-start">Ангилал</span>
                        <img src={assetUrl('images/icons/chevronDownSmall.svg')} alt="" className="chevron w-16 h-16" />
                      </button>
                      <div className="collapse show" id="filterCats">
                        <div className="d-flex flex-column">
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="hair-color" checked />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Үсний будаг <span className="fc-secondary fs-12">(48)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="shampoo" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Шампунь <span className="fc-secondary fs-12">(32)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="conditioner" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Кондиционер <span className="fc-secondary fs-12">(27)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="mask" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Маск <span className="fc-secondary fs-12">(19)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="serum" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Сэрум <span className="fc-secondary fs-12">(14)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterCategory" value="styling" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Стайлинг <span className="fc-secondary fs-12">(22)</span></span>
                          </label>
                        </div>
                      </div>
                    </div>
      
                    
                    <div className="filter-section">
                      <button className="filter-collapse-btn mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#filterBrands" aria-expanded="true">
                        <span className="filter-label flex-grow-1 text-start">Брэнд</span>
                        <img src={assetUrl('images/icons/chevronDownSmall.svg')} alt="" className="chevron w-16 h-16" />
                      </button>
                      <div className="collapse show" id="filterBrands">
                        <div className="d-flex flex-column">
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="estel" checked />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">ESTEL <span className="fc-secondary fs-12">(86)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="matrix" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Matrix <span className="fc-secondary fs-12">(41)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="loreal" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">L'Oréal <span className="fc-secondary fs-12">(35)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="wella" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Wella <span className="fc-secondary fs-12">(28)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="schwarzkopf" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Schwarzkopf <span className="fc-secondary fs-12">(22)</span></span>
                          </label>
                          <label className="filter-check">
                            <input type="checkbox" className="filterBrand" value="kerastase" />
                            <span className="filter-check-box"></span>
                            <span className="fs-13 fc-dark">Kérastase <span className="fc-secondary fs-12">(17)</span></span>
                          </label>
                        </div>
                      </div>
                    </div>
      
                  </div>
                </div>
      
                
                <div className="col-12">
      
                  
                  <div className="position-relative overflow-hidden rounded-4 mb-4" style={{height:"200px"}}>
                    <img src={assetUrl('images/demo/slide3.webp')} alt="Шампунь" style={{position:"absolute",inset:"0",width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
                    <div style={{position:"absolute",inset:"0",background:"linear-gradient(90deg,rgba(8,18,32,.85) 0%,rgba(8,18,32,.45) 55%,transparent 100%)"}}></div>
                  </div>
      
                  
                  <div className="mb-3">
                    <h1 className="fw-bold fs-4 mb-1">Шампунь</h1>
                    <span className="fc-secondary fs-13">хайлтын илэрц</span>
                  </div>
      
                  
                  <div className="d-flex align-items-center justify-content-between gap-3 mb-4 flex-wrap">
                    <span className="fc-secondary fs-14"><strong className="fc-dark">48</strong> бараа олдлоо</span>
                    <div className="d-flex align-items-center gap-2">
                      
                      <button type="button" className="btn btn-outline-secondary btn-sm d-lg-none d-flex align-items-center gap-1" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                        <img src={assetUrl('images/icons/swap.svg')} alt="" className="w-16 h-16" />
                        <span className="fs-13">Шүүлт</span>
                      </button>
                      
                      <div className="dropdown">
                        <button className="btn d-flex align-items-center gap-2 px-3 py-2 fs-13 bg-white fc-dark rounded-pill border" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{letterSpacing:".01em"}}>
                          <span id="sortLabel">Шинэ эхэндээ</span>
                          <img src={assetUrl('images/icons/chevronDownSmall.svg')} alt="" className="w-16 h-16" style={{transition:"transform .2s"}} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 rounded-3 py-2 mt-1" style={{minWidth:"200px",boxShadow:"0 8px 24px rgba(0,0,0,.10)"}} aria-labelledby="sortDropdown">
                          <li><button className="sort-option dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-13 fw-semibold fc-main" data-value="newest" data-label="Шинэ эхэндээ">Шинэ эхэндээ<img src={assetUrl('images/icons/check.svg')} alt="" className="w-16 h-16" /></button></li>
                          <li><button className="sort-option dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-13" data-value="price-asc" data-label="Үнэ: багаас их">Үнэ: багаас их<img src={assetUrl('images/icons/check.svg')} alt="" className="w-16 h-16 opacity-0" /></button></li>
                          <li><button className="sort-option dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-13" data-value="price-desc" data-label="Үнэ: ихээс бага">Үнэ: ихээс бага<img src={assetUrl('images/icons/check.svg')} alt="" className="w-16 h-16 opacity-0" /></button></li>
                          <li><button className="sort-option dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-13" data-value="onsale" data-label="Хямдралтай">Хямдралтай<img src={assetUrl('images/icons/check.svg')} alt="" className="w-16 h-16 opacity-0" /></button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
      
                  
                  <div className="row g-3" id="productGrid">
                    {catalog.map((product) => (
                      <div className="col-6 col-md-4" key={product.id}>
                        <ProductCard {...product} />
                      </div>
                    ))}
                  </div>

                  <nav className="mt-5 d-flex justify-content-center" aria-label="Page navigation">
                    <ul className="pagination pagination-sm gap-1 mb-0">
                      <li className="page-item disabled">
                        <a className="page-link rounded-3 border-0" href="#"><img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" /></a>
                      </li>
                      <li className="page-item active"><a className="page-link rounded-3 border-0" href="#">1</a></li>
                      <li className="page-item"><a className="page-link rounded-3 border-0" href="#">2</a></li>
                      <li className="page-item"><a className="page-link rounded-3 border-0" href="#">3</a></li>
                      <li className="page-item"><a className="page-link rounded-3 border-0" href="#">4</a></li>
                      <li className="page-item">
                        <a className="page-link rounded-3 border-0" href="#"><img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="w-16 h-16" /></a>
                      </li>
                    </ul>
                  </nav>
      
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
                  <span className="filter-label d-block mb-3">Үнийн хязгаар</span>
                  <div className="price-pills">
                    <span className="price-pill">0₮</span>
                    <span className="price-sep">—</span>
                    <span className="price-pill" id="priceRangeValMobile">100,000₮</span>
                  </div>
                  <input type="range" className="filter-range" id="priceRangeMobile" min="0" max="100000" step="1000" value="100000" />
                </div>
      
                
                <div className="filter-section">
                  <span className="filter-label d-block mb-3">Ангилал</span>
                  <div className="d-flex flex-column">
                    <label className="filter-check"><input type="checkbox" checked /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Үсний будаг <span className="fc-secondary fs-12">(48)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Шампунь <span className="fc-secondary fs-12">(32)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Кондиционер <span className="fc-secondary fs-12">(27)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Маск <span className="fc-secondary fs-12">(19)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Сэрум <span className="fc-secondary fs-12">(14)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Стайлинг <span className="fc-secondary fs-12">(22)</span></span></label>
                  </div>
                </div>
      
                
                <div className="filter-section">
                  <span className="filter-label d-block mb-3">Брэнд</span>
                  <div className="d-flex flex-column">
                    <label className="filter-check"><input type="checkbox" checked /><span className="filter-check-box"></span><span className="fs-13 fc-dark">ESTEL <span className="fc-secondary fs-12">(86)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Matrix <span className="fc-secondary fs-12">(41)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">L'Oréal <span className="fc-secondary fs-12">(35)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Wella <span className="fc-secondary fs-12">(28)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Schwarzkopf <span className="fc-secondary fs-12">(22)</span></span></label>
                    <label className="filter-check"><input type="checkbox" /><span className="filter-check-box"></span><span className="fs-13 fc-dark">Kérastase <span className="fc-secondary fs-12">(17)</span></span></label>
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
