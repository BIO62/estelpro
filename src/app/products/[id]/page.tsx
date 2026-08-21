'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { useEffect } from 'react';
import RelatedProducts from '@/components/ui/RelatedProducts';

export default function ProductDetailPage() {

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
                    <span className="fs-12 fc-secondary text-uppercase d-block mb-1">ESTEL De Luxe</span>
                    <h1 className="fw-bold fs-4 lh-sm mb-2">De Luxe Үсний будаг</h1>
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
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <span className="fs-12 fc-secondary d-block mb-1">Өнгө:</span>
                        <strong id="selectedColorName" className="d-block">1 Black</strong>
                        <span id="selectedColorSub" className="fs-12 fc-secondary d-block">True Black</span>
                      </div>
                      <button type="button" className="btn btn-light btn-sm fs-12 rounded-3 d-flex align-items-center gap-1" id="colorToggleBtn">
                        <span>Жагсаалтаар харах</span>
                        <img src={assetUrl('images/icons/chevronRightSmall.svg')} alt="" className="w-16 h-16" id="colorToggleIcon" />
                      </button>
                    </div>
      
                    
                    <div id="colorGrid">
                      <div className="d-flex flex-wrap gap-2">
                        <button type="button" className="colorSwatch active" data-code="1" data-name="1 Black" data-sub="True Black" style={{background:"#1a1008"}} title="1 - Black"></button>
                        <button type="button" className="colorSwatch" data-code="2" data-name="2 Very Dark Brown" data-sub="Very Dark Brown" style={{background:"#2b1a0e"}} title="2 - Very Dark Brown"></button>
                        <button type="button" className="colorSwatch" data-code="3" data-name="3 Dark Brown" data-sub="Dark Brown" style={{background:"#3d2010"}} title="3 - Dark Brown"></button>
                        <button type="button" className="colorSwatch" data-code="3.5NNN" data-name="3.5NNN Ravenna Brown" data-sub="True Darkest Brown" style={{background:"#3a1e0c"}} title="3.5NNN - Ravenna Brown"></button>
                        <button type="button" className="colorSwatch" data-code="3.65" data-name="3.65 Black Red" data-sub="Black Red" style={{background:"#3a1018"}} title="3.65 - Black Red"></button>
                        <button type="button" className="colorSwatch" data-code="4" data-name="4 Brown" data-sub="Brown" style={{background:"#4e2912"}} title="4 - Brown"></button>
                        <button type="button" className="colorSwatch" data-code="4.3" data-name="4.3 Golden Brown" data-sub="Golden Brown" style={{background:"#5a3010"}} title="4.3 - Golden Brown"></button>
                        <button type="button" className="colorSwatch" data-code="4.6" data-name="4.6 Red Brown" data-sub="Red Brown" style={{background:"#6b2215"}} title="4.6 - Red Brown"></button>
                        <button type="button" className="colorSwatch" data-code="4.65" data-name="4.65 Red Mahogany Brown" data-sub="Red Mahogany Brown" style={{background:"#6e1e18"}} title="4.65 - Red Mahogany Brown"></button>
                        <button type="button" className="colorSwatch" data-code="4.15" data-name="4.15 Ash Mahogany Brown" data-sub="Ash Mahogany Brown" style={{background:"#3a2820"}} title="4.15 - Ash Mahogany Brown"></button>
                        <button type="button" className="colorSwatch" data-code="4N" data-name="4N Natural Brown" data-sub="Natural Brown" style={{background:"#4a2810"}} title="4N - Natural Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5" data-name="5 Light Brown" data-sub="Light Brown" style={{background:"#6b3a1a"}} title="5 - Light Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5.3" data-name="5.3 Golden Light Brown" data-sub="Golden Light Brown" style={{background:"#7a4520"}} title="5.3 - Golden Light Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5.5" data-name="5.5 Mahogany Light Brown" data-sub="Mahogany Light Brown" style={{background:"#6b2820"}} title="5.5 - Mahogany Light Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5.6" data-name="5.6 Red Light Brown" data-sub="Red Light Brown" style={{background:"#7a2a1e"}} title="5.6 - Red Light Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5.65" data-name="5.65 Mahogany Red Brown" data-sub="Mahogany Red Brown" style={{background:"#6a2020"}} title="5.65 - Mahogany Red Brown"></button>
                        <button type="button" className="colorSwatch" data-code="5N" data-name="5N Natural Light Brown" data-sub="Natural Light Brown" style={{background:"#6a3818"}} title="5N - Natural Light Brown"></button>
                        <button type="button" className="colorSwatch" data-code="6" data-name="6 Dark Blonde" data-sub="Dark Blonde" style={{background:"#8a5025"}} title="6 - Dark Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="6.3" data-name="6.3 Golden Dark Blonde" data-sub="Golden Dark Blonde" style={{background:"#9a5c28"}} title="6.3 - Golden Dark Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="6.5" data-name="6.5 Mahogany Dark Blonde" data-sub="Mahogany Dark Blonde" style={{background:"#7a3222"}} title="6.5 - Mahogany Dark Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="6.6" data-name="6.6 Red Dark Blonde" data-sub="Red Dark Blonde" style={{background:"#8a3020"}} title="6.6 - Red Dark Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="6.45" data-name="6.45 Copper Mahogany Blonde" data-sub="Copper Mahogany Blonde" style={{background:"#8a3828"}} title="6.45 - Copper Mahogany Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="6N" data-name="6N Natural Dark Blonde" data-sub="Natural Dark Blonde" style={{background:"#8a5020"}} title="6N - Natural Dark Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7" data-name="7 Blonde" data-sub="Blonde" style={{background:"#b07830"}} title="7 - Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7.3" data-name="7.3 Golden Blonde" data-sub="Golden Blonde" style={{background:"#c08835"}} title="7.3 - Golden Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7.4" data-name="7.4 Copper Blonde" data-sub="Copper Blonde" style={{background:"#b06030"}} title="7.4 - Copper Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7.5" data-name="7.5 Mahogany Blonde" data-sub="Mahogany Blonde" style={{background:"#8a4030"}} title="7.5 - Mahogany Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7.6" data-name="7.6 Red Blonde" data-sub="Red Blonde" style={{background:"#a03828"}} title="7.6 - Red Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7.43" data-name="7.43 Copper Golden Blonde" data-sub="Copper Golden Blonde" style={{background:"#b06028"}} title="7.43 - Copper Golden Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="7N" data-name="7N Natural Blonde" data-sub="Natural Blonde" style={{background:"#aa7030"}} title="7N - Natural Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="8" data-name="8 Light Blonde" data-sub="Light Blonde" style={{background:"#c89840"}} title="8 - Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="8.3" data-name="8.3 Golden Light Blonde" data-sub="Golden Light Blonde" style={{background:"#d8a845"}} title="8.3 - Golden Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="8.5" data-name="8.5 Mahogany Light Blonde" data-sub="Mahogany Light Blonde" style={{background:"#a05040"}} title="8.5 - Mahogany Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="8.43" data-name="8.43 Golden Copper Light Blonde" data-sub="Golden Copper Light Blonde" style={{background:"#c87830"}} title="8.43 - Golden Copper Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="8N" data-name="8N Natural Light Blonde" data-sub="Natural Light Blonde" style={{background:"#ca9040"}} title="8N - Natural Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="9" data-name="9 Very Light Blonde" data-sub="Very Light Blonde" style={{background:"#e0b850"}} title="9 - Very Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="9.1" data-name="9.1 Ash Very Light Blonde" data-sub="Ash Very Light Blonde" style={{background:"#c8b890"}} title="9.1 - Ash Very Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="9.3" data-name="9.3 Golden Very Light Blonde" data-sub="Golden Very Light Blonde" style={{background:"#e8c860"}} title="9.3 - Golden Very Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="9.65" data-name="9.65 Mahogany Red Very Light Blonde" data-sub="Mahogany Red Very Light Blonde" style={{background:"#b05848"}} title="9.65 - Mahogany Red Very Light Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="10" data-name="10 Lightest Blonde" data-sub="Lightest Blonde" style={{background:"#f0d880"}} title="10 - Lightest Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="10.1" data-name="10.1 Ash Lightest Blonde" data-sub="Ash Lightest Blonde" style={{background:"#d8d0b0"}} title="10.1 - Ash Lightest Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="66.46" data-name="66.46 Intense Copper Red" data-sub="Intense Copper Red" style={{background:"#a03018"}} title="66.46 - Intense Copper Red"></button>
                        <button type="button" className="colorSwatch" data-code="66.56" data-name="66.56 Intense Mahogany Red" data-sub="Intense Mahogany Red" style={{background:"#8a2020"}} title="66.56 - Intense Mahogany Red"></button>
                        <button type="button" className="colorSwatch" data-code="77.46" data-name="77.46 Intense Copper Blonde" data-sub="Intense Copper Blonde" style={{background:"#b85028"}} title="77.46 - Intense Copper Blonde"></button>
                        <button type="button" className="colorSwatch" data-code="88.43" data-name="88.43 Intense Golden Copper" data-sub="Intense Golden Copper" style={{background:"#c86030"}} title="88.43 - Intense Golden Copper"></button>
                        <button type="button" className="colorSwatch" data-code="0/00N" data-name="0/00N Natural Booster" data-sub="Natural Booster" style={{background:"#e0c070"}} title="0/00N - Natural Booster"></button>
                        <button type="button" className="colorSwatch" data-code="0/22V" data-name="0/22V Violet Booster" data-sub="Violet Booster" style={{background:"#6a3880"}} title="0/22V - Violet Booster"></button>
                        <button type="button" className="colorSwatch" data-code="0/33C" data-name="0/33C Copper Booster" data-sub="Copper Booster" style={{background:"#a05020"}} title="0/33C - Copper Booster"></button>
                        <button type="button" className="colorSwatch" data-code="0/44R" data-name="0/44R Red Booster" data-sub="Red Booster" style={{background:"#901820"}} title="0/44R - Red Booster"></button>
                        <button type="button" className="colorSwatch" data-code="0/66A" data-name="0/66A Ash Booster" data-sub="Ash Booster" style={{background:"#708090"}} title="0/66A - Ash Booster"></button>
                      </div>
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
