'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { useEffect } from 'react';
import RelatedProducts from '@/components/ui/RelatedProducts';

export default function ProductSimplePage() {

  useEffect(() => {
    document.querySelectorAll('.thumbBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mainImg = document.getElementById('mainProductImg') as HTMLImageElement | null;
        const imgPath = (btn as HTMLElement).dataset.img;
        if (mainImg && imgPath) mainImg.src = assetUrl(imgPath);
        document.querySelectorAll('.thumbBtn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    const nameEl = document.getElementById('selectedColorName');
    const subEl = document.getElementById('selectedColorSub');
    document.querySelectorAll('.colorSwatch').forEach((swatch) => {
      swatch.addEventListener('mouseenter', () => {
        if (nameEl) nameEl.textContent = (swatch as HTMLElement).dataset.code || '';
        if (subEl) subEl.textContent = (swatch as HTMLElement).dataset.sub || '';
      });
      swatch.addEventListener('mouseleave', () => {
        const active = document.querySelector('.colorSwatch.active') as HTMLElement | null;
        if (active && nameEl) nameEl.textContent = active.dataset.name || '';
        if (active && subEl) subEl.textContent = active.dataset.sub || '';
      });
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.colorSwatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        if (nameEl) nameEl.textContent = (swatch as HTMLElement).dataset.name || '';
        if (subEl) subEl.textContent = (swatch as HTMLElement).dataset.sub || '';
      });
    });
    const toggleBtn = document.getElementById('colorToggleBtn');
    toggleBtn?.addEventListener('click', () => {
      document.getElementById('colorGrid')?.classList.toggle('d-none');
      document.getElementById('colorList')?.classList.toggle('d-none');
    });
    document.querySelectorAll('.qtyMinus, .qtyPlus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.qtyControl')?.querySelector('.qtyInput') as HTMLInputElement | null;
        if (!input) return;
        let v = parseInt(input.value, 10) || 1;
        if (btn.classList.contains('qtyMinus')) v = Math.max(1, v - 1);
        else v += 1;
        input.value = String(v);
      });
    });
  }, []);

  return (
    <>
      <section className="py-sm-5 py-3">
            <div className="container">
              <div className="row g-4 g-lg-5">
      
                
                <div className="col-lg-6">
                  <div className="d-flex flex-sm-row flex-column-reverse gap-3">
      
                    
                    <div className="d-flex flex-sm-column flex-row gap-2 flex-shrink-0">
                      <button type="button" className="thumbBtn active border-0 bg-transparent p-0" data-img="images/demo/product1.jpg">
                        <img src={assetUrl('images/demo/product1.jpg')} alt="" className="w-56 h-56 img-cover rounded-2 border border-2" />
                      </button>
                      <button type="button" className="thumbBtn border-0 bg-transparent p-0" data-img="images/demo/product2.jpg">
                        <img src={assetUrl('images/demo/product2.jpg')} alt="" className="w-56 h-56 img-cover rounded-2 border" />
                      </button>
                      <button type="button" className="thumbBtn border-0 bg-transparent p-0" data-img="images/demo/product3.jpg">
                        <img src={assetUrl('images/demo/product3.jpg')} alt="" className="w-56 h-56 img-cover rounded-2 border" />
                      </button>
                      <button type="button" className="thumbBtn border-0 bg-transparent p-0" data-img="images/demo/product4.jpg">
                        <img src={assetUrl('images/demo/product4.jpg')} alt="" className="w-56 h-56 img-cover rounded-2 border" />
                      </button>
                      <button type="button" className="thumbBtn border-0 bg-transparent p-0" data-img="images/demo/product6.jpg">
                        <img src={assetUrl('images/demo/product6.jpg')} alt="" className="w-56 h-56 img-cover rounded-2 border" />
                      </button>
                    </div>
      
                    
                    <div className="flex-grow-1 position-relative">
                      <img id="mainProductImg" src={assetUrl('images/demo/product1.jpg')} alt="" className="w-100 h-auto ratio11 img-cover rounded-3" />
                    </div>
      
                  </div>
                </div>
      
                
                <div className="col-lg-6">
      
                  
                  <div className="mb-3">
                    <span className="fs-12 fc-secondary text-uppercase d-block mb-1">ESTEL Professional</span>
                    <h1 className="fw-bold fs-4 lh-sm mb-2">Curex Balance Шампунь</h1>
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <strong className="fs-3 fc-main">18,000₮</strong>
                      <div className="d-flex flex-column align-items-start">
                        <span className="badge bg-danger fs-11 fw-semibold">-18%</span>
                        <span className="fs-14 text-decoration-line-through fc-secondary">22,000₮</span>
                      </div>
                    </div>
                  </div>
      
                  <hr className="opacity-10" />
      
                  
                  <div className="mb-4">
                    <span className="fs-12 fc-secondary d-block mb-2">Хэмжээ:</span>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary rounded-3 sizeBtn">250 мл</button>
                      <button type="button" className="btn rounded-3 sizeBtn active">500 мл</button>
                      <button type="button" className="btn btn-outline-secondary rounded-3 sizeBtn">1000 мл</button>
                    </div>
                  </div>
      
                  
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fs-14 fw-semibold">Тоо:</span>
                    <div className="d-flex">
                      <button type="button" className="btn border rounded-end-0 w-40 h-40 d-flex align-items-center justify-content-center" id="qtyMinus">
                        <img src={assetUrl('images/icons/minus.svg')} alt="" />
                      </button>
                      <input type="number" className="form-control text-center fw-bold rounded-0 border-0 w-56 h-40 px-0 border-top border-bottom" id="qtyInput" value="1" min="1" />
                      <button type="button" className="btn border rounded-start-0 w-40 h-40 d-flex align-items-center justify-content-center" id="qtyPlus">
                        <img src={assetUrl('images/icons/plus.svg')} alt="" />
                      </button>
                    </div>
                    <span className="fs-12 fc-secondary">Үлдэгдэл: <strong className="fc-dark">142ш</strong></span>
                  </div>
      
                  
                  <div className="d-flex gap-2 mb-4">
                    <button type="button" className="btn btn-main flex-grow-1 p-3 d-flex align-items-center justify-content-center gap-2">
                      <img src={assetUrl('images/icons/cartAddWhite.svg')} alt="" />
                      <strong>Сагслах</strong>
                    </button>
                    <button type="button" className="btn btn-main p-3 wishlistBtn2 d-flex align-items-center justify-content-center" style={{border:"1px solid #fff"}}>
                      <img src={assetUrl('images/icons/heart.svg')} alt="" className="w-20 h-20" style={{filter:"brightness(0) invert(1)"}} />
                    </button>
                  </div>
      
                  
                  <div className="d-flex flex-column gap-2 bg-light rounded-3 p-3 fs-12">
                    <div className="d-flex align-items-center gap-2">
                      <img src={assetUrl('images/icons/cartAdd.svg')} alt="" className="w-16 h-16 opacity-50" />
                      <span><strong>80,000₮</strong> дээш захиалгад хүргэлт <strong className="fc-main">үнэгүй</strong></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <img src={assetUrl('images/icons/times.svg')} alt="" className="w-16 h-16 opacity-50" />
                      <span>Худалдан авснаас хойш <strong>14 хоногт</strong> буцаалт хийх боломжтой</span>
                    </div>
                  </div>
      
                </div>
              </div>
            </div>
          </section>
      
          
          <section className="border-top">
            <div className="container">
              <ul className="nav nav-tabs border-0" id="productTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active fw-semibold fs-14 px-4 py-3" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc-pane" type="button" role="tab">Тайлбар</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link fw-semibold fs-14 px-4 py-3" id="usage-tab" data-bs-toggle="tab" data-bs-target="#usage-pane" type="button" role="tab">Хэрэглэх заавар</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link fw-semibold fs-14 px-4 py-3" id="ingr-tab" data-bs-toggle="tab" data-bs-target="#ingr-pane" type="button" role="tab">Орц найрлага</button>
                </li>
              </ul>
              <div className="tab-content py-4" id="productTabsContent">
      
                
                <div className="tab-pane fade show active" id="desc-pane" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="fw-bold mb-3">ESTEL De Luxe Үсний будаг</h5>
                      <p>ESTEL De Luxe бол мэргэжлийн зориулалттай байнгын үсний будаг бөгөөд гайхалтай өнгө, урт эдэлгээ, найдвартай бүтцийн хамгаалалтыг нэгтгэсэн онцгой найрлагатай.</p>
                      <p>Найрлагад орсон <strong>үслэг уураг</strong> ба <strong>натурал тосны комплекс</strong> нь үсийг гэмтлээс хамгаалж, гялалзсан, зөөлөн байдлыг хадгалдаг. Аммоний агуулсан боловч нейтрализатор технологийн ачаар тааламжгүй үнэргүй.</p>
                      <ul className="d-flex flex-column gap-2 mt-3">
                        <li>100% цагаан үсийг бүрэн будна</li>
                        <li>Гэрэлтсэн, тод өнгө өгнө</li>
                        <li>Үсний гадаргуу жигдэрч, гялалзана</li>
                        <li>4–6 долоо хоног эдэлгээтэй</li>
                        <li>Мэргэжлийн, гэртээ хэрэглэхэд тохиромжтой</li>
                      </ul>
                    </div>
                  </div>
                </div>
      
                
                <div className="tab-pane fade" id="usage-pane" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="fw-bold mb-4">Хэрэглэх заавар</h5>
                      <div className="d-flex flex-column gap-4">
                        <div className="d-flex gap-3">
                          <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">1</div>
                          <div>
                            <strong className="d-block mb-1">Холих</strong>
                            <p className="fc-secondary mb-0 fs-14">De Luxe будгийг (60 мл) De Luxe оксидант (60 мл)-тай тэнцүү хэмжээгээр холино. Хуванцар буюу шилэн аяганд холино. Металл хэрэгсэл хэрэглэхгүй.</p>
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">2</div>
                          <div>
                            <strong className="d-block mb-1">Хэрэглэх</strong>
                            <p className="fc-secondary mb-0 fs-14">Угааагүй, хуурай үсэнд тос хэрэглэнэ. Нэг хэсгийн зузааны дагуу тараана. Дараа нь туузны үзүүрээс эхэлж, мод хэрэглэнэ.</p>
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">3</div>
                          <div>
                            <strong className="d-block mb-1">Хүлээх</strong>
                            <p className="fc-secondary mb-0 fs-14">Цагаан үсэнд: 30–45 минут. Будсан үсэнд: 20–30 минут. Дулааны дор: 15–20 минут.</p>
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div className="w-40 h-40 bg-main fc-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">4</div>
                          <div>
                            <strong className="d-block mb-1">Угаах</strong>
                            <p className="fc-secondary mb-0 fs-14">Халуун усаар сайтар угаана. Хөөсрөлт зогссон хойно гялалзуулагч бальзамаар арчина.</p>
                          </div>
                        </div>
                      </div>
                      <div className="alert alert-warning mt-4 fs-12 rounded-3 border-0">
                        ⚠️ <strong>Анхааруулга:</strong> Харшлын шинжилгээг хэрэглэхийн 48 цагийн өмнө хийнэ үү. Нүд, хөмсөгт хэрэглэхгүй.
                      </div>
                    </div>
                  </div>
                </div>
      
                
                <div className="tab-pane fade" id="ingr-pane" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <h5 className="fw-bold mb-3">Орц найрлага</h5>
                      <p className="fs-12 fc-secondary lh-lg">Aqua (Water), Cetearyl Alcohol, Propylene Glycol, Decyl Glucoside, p-Phenylenediamine, Resorcinol, m-Aminophenol, 2-Amino-4-hydroxyethylaminoanisole Sulfate, 4-Chlororesorcinol, Toluene-2,5-Diamine Sulfate, Ammonium Hydroxide, Sodium Lauryl Sulfate, Parfum (Fragrance), Erythorbic Acid, Polyquaternium-22, Hydrolyzed Wheat Protein, Panthenol, Tocopheryl Acetate, Citric Acid, Etidronic Acid, Sodium Metabisulfite.</p>
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Гол найрлага</h6>
                        <div className="row row-cols-sm-2 row-cols-1 g-3">
                          <div className="col">
                            <div className="d-flex gap-3 align-items-start">
                              <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">🌾</div>
                              <div>
                                <strong className="d-block fs-14">Гидролизатласан пшеницийн уураг</strong>
                                <span className="fs-12 fc-secondary">Үсний бүтцийг бэхжүүлнэ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="d-flex gap-3 align-items-start">
                              <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">💊</div>
                              <div>
                                <strong className="d-block fs-14">Пантенол (B5 витамин)</strong>
                                <span className="fs-12 fc-secondary">Чийглэлт, эмчилгээ</span>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="d-flex gap-3 align-items-start">
                              <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">🌿</div>
                              <div>
                                <strong className="d-block fs-14">Токоферил ацетат (E витамин)</strong>
                                <span className="fs-12 fc-secondary">Антиоксидант хамгаалалт</span>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="d-flex gap-3 align-items-start">
                              <div className="w-40 h-40 bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 fs-20">✨</div>
                              <div>
                                <strong className="d-block fs-14">Polyquaternium-22</strong>
                                <span className="fs-12 fc-secondary">Зөөлөн, гялалзалт</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
              </div>
            </div>
          </section>
      
          
          <RelatedProducts />
    </>
  );
}
