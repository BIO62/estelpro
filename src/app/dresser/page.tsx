import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function DresserPage() {

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `.dresser-hero { position:relative; overflow:hidden; min-height:520px; display:flex; align-items:center; }
          .dresser-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; }
          .dresser-hero-overlay { position:absolute; inset:0; background:linear-gradient(100deg,rgba(8,18,32,.88) 0%,rgba(8,18,32,.65) 50%,rgba(8,18,32,.25) 100%); }
          .dresser-hero-content { position:relative; z-index:1; }
          .cat-card { position:relative; overflow:hidden; cursor:pointer; }
          .cat-card img { transition:transform .45s ease; width:100%; height:100%; object-fit:cover; display:block; }
          .cat-card:hover img { transform:scale(1.06); }
          .cat-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.1) 55%,transparent 100%); }
          .cat-label { position:absolute; bottom:0; left:0; right:0; padding:20px 18px; }
          .brand-logo-card { border:1.5px solid #E8EFF5; border-radius:14px; background:#fff; transition:border-color .2s,box-shadow .2s,transform .2s; cursor:pointer; padding:18px 14px; display:flex; align-items:center; justify-content:center; }
          .brand-logo-card:hover { border-color:#1170B7; box-shadow:0 6px 20px rgba(17,112,183,.12); transform:translateY(-3px); }
          .line-pill { text-decoration:none; display:block; transition:transform .15s,opacity .15s; }
          .line-pill:hover { transform:scale(1.05); opacity:.85; }
          .line-pill img { width:100%; aspect-ratio:1; object-fit:cover; border-radius:10px; display:block; }
          .cat-pill { text-decoration:none; display:block; transition:transform .15s,opacity .15s; }
          .cat-pill:hover { transform:scale(1.05); opacity:.85; }
          .cat-pill img { width:100%; aspect-ratio:2/1; object-fit:cover; border-radius:10px; display:block; }
          .dresser-section-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.15em; color:#708C9E; }
          .hero-stat-line { width:1px; background:rgba(255,255,255,.18); align-self:stretch; }
          .cat-group-img { width:36px; height:36px; object-fit:contain; border-radius:6px; background:#fff; border:1px solid #E0E8EF; padding:2px; flex-shrink:0; }` }} />
      
        
        <section className="dresser-hero">
          <img src={assetUrl('images/demo/mainSlide1.webp')} alt="" className="dresser-hero-img" />
          <div className="dresser-hero-overlay"></div>
          <div className="container py-5 dresser-hero-content w-100">
            <div className="row py-3">
              <div className="col-lg-7 col-xl-6">
                <span className="dresser-section-label d-block mb-3" style={{color:"rgba(255,255,255,.65)"}}>Салоны мэргэжлийн портал</span>
                <h1 className="fw-bold fc-white lh-sm mb-3" style={{fontSize:"clamp(28px,4vw,52px)"}}>ESTEL Professional<br /><span style={{color:"#FFC20F"}}>Мэргэжлийн каталог</span></h1>
                <p className="mb-4 fs-15" style={{color:"rgba(255,255,255,.72)"}}>Дэлхийн тэргүүлэгч ESTEL брэндийн бүтээгдэхүүнийг мэргэжлийн үнэ, нөхцөлтэйгөөр салондоо авна уу.</p>
                <div className="d-flex gap-3 flex-wrap mb-5">
                  <Link href="/dresser/list" className="btn btn-main px-4 py-3 fw-semibold rounded-3">Бүх барааг харах</Link>
                  <a href="#brands" className="btn px-4 py-3 fw-semibold rounded-3" style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1.5px solid rgba(255,255,255,.25)"}}>Брэнд сонгох</a>
                </div>
                <div className="d-flex gap-4 align-items-center">
                  <div>
                    <strong className="fc-white d-block" style={{fontSize:"26px",letterSpacing:"-.02em"}}>50+</strong>
                    <span className="fs-12" style={{color:"rgba(255,255,255,.55)"}}>Брэнд</span>
                  </div>
                  <div className="hero-stat-line"></div>
                  <div>
                    <strong className="fc-white d-block" style={{fontSize:"26px",letterSpacing:"-.02em"}}>5,000+</strong>
                    <span className="fs-12" style={{color:"rgba(255,255,255,.55)"}}>Бараа</span>
                  </div>
                  <div className="hero-stat-line"></div>
                  <div>
                    <strong className="fc-white d-block" style={{fontSize:"26px",letterSpacing:"-.02em"}}>20K+</strong>
                    <span className="fs-12" style={{color:"rgba(255,255,255,.55)"}}>Үйлчлүүлэгч</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="py-5" id="categories">
          <div className="container">
            <div className="d-flex align-items-end justify-content-between mb-4">
              <div>
                <span className="dresser-section-label d-block mb-1">Каталог</span>
                <h2 className="fw-bold mb-0" style={{fontSize:"28px"}}>Онцлох ангилал</h2>
              </div>
            </div>
      
            
            <div className="row g-3 mb-3">
              <div className="col-lg-8">
                <Link href="/dresser/list" className="d-block cat-card rounded-4" style={{height:"340px"}}>
                  <img src={assetUrl('images/demo/category1.avif')} alt="De Luxe" />
                  <div className="cat-overlay"></div>
                  <div className="cat-label">
                    <span className="dresser-section-label d-block mb-1" style={{color:"rgba(255,255,255,.65)"}}>Хамгийн эрэлттэй</span>
                    <h3 className="fw-bold fc-white mb-1" style={{fontSize:"28px"}}>De Luxe</h3>
                    <p className="mb-0 fs-13" style={{color:"rgba(255,255,255,.72)"}}>Урт эдэлгээт мэргэжлийн өнгийн будаг</p>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4">
                <Link href="/dresser/list" className="d-block cat-card rounded-4" style={{height:"340px"}}>
                  <img src={assetUrl('images/demo/category5.avif')} alt="Haute Couture" />
                  <div className="cat-overlay"></div>
                  <div className="cat-label">
                    <span className="dresser-section-label d-block mb-1" style={{color:"rgba(255,255,255,.65)"}}>Тансаг чанар</span>
                    <h4 className="fw-bold fc-white mb-1">Haute Couture</h4>
                    <p className="mb-0 fs-13" style={{color:"rgba(255,255,255,.72)"}}>Мэргэжлийн үс арчилгаа</p>
                  </div>
                </Link>
              </div>
            </div>
      
            
            <div className="row g-3 mb-3">
              <div className="col-4">
                <Link href="/dresser/list" className="d-block cat-card rounded-4" style={{height:"210px"}}>
                  <img src={assetUrl('images/demo/category2.avif')} alt="Sensation" />
                  <div className="cat-overlay"></div>
                  <div className="cat-label">
                    <h5 className="fw-bold fc-white mb-1">Sensation</h5>
                    <p className="mb-0 fs-12" style={{color:"rgba(255,255,255,.7)"}}>Аммиакгүй будаг</p>
                  </div>
                </Link>
              </div>
              <div className="col-4">
                <Link href="/dresser/list" className="d-block cat-card rounded-4" style={{height:"210px"}}>
                  <img src={assetUrl('images/demo/category4.avif')} alt="Curex" />
                  <div className="cat-overlay"></div>
                  <div className="cat-label">
                    <h5 className="fw-bold fc-white mb-1">Curex</h5>
                    <p className="mb-0 fs-12" style={{color:"rgba(255,255,255,.7)"}}>Эмчилгээний цуврал</p>
                  </div>
                </Link>
              </div>
              <div className="col-4">
                <Link href="/dresser/list" className="d-block cat-card rounded-4" style={{height:"210px"}}>
                  <img src={assetUrl('images/demo/category6.avif')} alt="Alpha Homme" />
                  <div className="cat-overlay"></div>
                  <div className="cat-label">
                    <h5 className="fw-bold fc-white mb-1">Alpha Homme</h5>
                    <p className="mb-0 fs-12" style={{color:"rgba(255,255,255,.7)"}}>Эрэгтэй цуврал</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      
        
        <section className="py-5" style={{background:"#F2F2F2"}} id="lines">
          <div className="container">
            <div className="d-flex align-items-end justify-content-between mb-4">
              <div>
                <span className="dresser-section-label d-block mb-1">ESTEL</span>
                <h2 className="fw-bold mb-0" style={{fontSize:"28px"}}>Ангилал</h2>
              </div>
            </div>
      
            
            <div className="row row-cols-4 row-cols-sm-5 row-cols-md-7 row-cols-lg-9 g-2 mb-5">
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="De Luxe"><img src={assetUrl('images/demo/category1.avif')} alt="De Luxe" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Sensation"><img src={assetUrl('images/demo/category2.avif')} alt="Sensation" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Prince"><img src={assetUrl('images/demo/category3.avif')} alt="Prince" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="XTRO"><img src={assetUrl('images/demo/category4.avif')} alt="XTRO" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Хөөсөн будаг"><img src={assetUrl('images/demo/category5.avif')} alt="Хөөсөн будаг" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="ANTI-YELLOW"><img src={assetUrl('images/demo/category6.avif')} alt="ANTI-YELLOW" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="ESTELLER"><img src={assetUrl('images/demo/product1.jpg')} alt="ESTELLER" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Newtone"><img src={assetUrl('images/demo/product2.jpg')} alt="Newtone" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Niagara"><img src={assetUrl('images/demo/product4.jpg')} alt="Niagara" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Lissage"><img src={assetUrl('images/demo/product3.jpg')} alt="Lissage" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Alpha"><img src={assetUrl('images/demo/product9.png')} alt="Alpha" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Genevie Pro"><img src={assetUrl('images/demo/product7.png')} alt="Genevie Pro" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Top salon"><img src={assetUrl('images/demo/product8.png')} alt="Top salon" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Proart"><img src={assetUrl('images/demo/product5.jpg')} alt="Proart" /></Link></div>
              <div className="col"><Link href="/dresser/list" className="cat-pill" title="Airex"><img src={assetUrl('images/demo/product6.jpg')} alt="Airex" /></Link></div>
            </div>
      
            
      
            
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{borderBottom:"1.5px solid #E0E8EF"}}>
                <strong className="fs-14 fc-dark">Эмчилгээний набор</strong>
              </div>
              <div className="row row-cols-4 row-cols-sm-5 row-cols-md-7 row-cols-lg-9 g-2">
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Peptides"><img src={assetUrl('images/demo/product10.png')} alt="Peptides" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Цветочный экстаз"><img src={assetUrl('images/demo/product11.png')} alt="Цветочный экстаз" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Кератин"><img src={assetUrl('images/demo/product12.png')} alt="Кератин" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Remount"><img src={assetUrl('images/demo/product1.jpg')} alt="Remount" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Filler"><img src={assetUrl('images/demo/product3.jpg')} alt="Filler" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Banya"><img src={assetUrl('images/demo/product5.jpg')} alt="Banya" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Collagen"><img src={assetUrl('images/demo/product6.jpg')} alt="Collagen" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Q3"><img src={assetUrl('images/demo/product7.png')} alt="Q3" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="ХЕК"><img src={assetUrl('images/demo/product8.png')} alt="ХЕК" /></Link></div>
              </div>
            </div>
      
            
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{borderBottom:"1.5px solid #E0E8EF"}}>
                <strong className="fs-14 fc-dark">Curex</strong>
              </div>
              <div className="row row-cols-4 row-cols-sm-5 row-cols-md-7 row-cols-lg-9 g-2">
                <div className="col"><Link href="/dresser/list" className="line-pill" title="CLASSIC"><img src={assetUrl('images/demo/product4.jpg')} alt="CLASSIC" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="THERAPY"><img src={assetUrl('images/demo/product5.jpg')} alt="THERAPY" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="COLOR SAVE"><img src={assetUrl('images/demo/product6.jpg')} alt="COLOR SAVE" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="COLOR INTENSE"><img src={assetUrl('images/demo/product7.png')} alt="COLOR INTENSE" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="SUNFLOWER"><img src={assetUrl('images/demo/product8.png')} alt="SUNFLOWER" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="BRILLIANCE"><img src={assetUrl('images/demo/product9.png')} alt="BRILLIANCE" /></Link></div>
              </div>
            </div>
      
            
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{borderBottom:"1.5px solid #E0E8EF"}}>
                <strong className="fs-14 fc-dark">Туслах материал</strong>
              </div>
              <div className="row row-cols-4 row-cols-sm-5 row-cols-md-7 row-cols-lg-9 g-2">
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Каталоги"><img src={assetUrl('images/demo/product13.png')} alt="Каталоги" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Хормогч Нөмрөг"><img src={assetUrl('images/demo/product2.jpg')} alt="Хормогч Нөмрөг" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Аяга багс"><img src={assetUrl('images/demo/product4.jpg')} alt="Аяга багс" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Сам"><img src={assetUrl('images/demo/product7.png')} alt="Сам" /></Link></div>
                <div className="col"><Link href="/dresser/list" className="line-pill" title="Бусад"><img src={assetUrl('images/demo/product10.png')} alt="Бусад" /></Link></div>
              </div>
            </div>
      
          </div>
        </section>
    </>
  );
}
