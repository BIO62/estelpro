import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function OrdersPage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
                      <nav style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <Link href="/account/profile" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хувийн мэдээлэл</Link>
                <Link href="/account/address" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хүргэлтийн хаяг</Link>
                <Link href="/account/orders" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Миний захиалгууд</Link>
                <Link href="/wishlist" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хадгалсан бараа</Link>
              </nav>
            </div>
          </div>
      
          <section className="py-5">
            <div className="container">
              <div className="row g-5 align-items-start">
      
                
                <div className="col-lg-3 d-none d-lg-block">
                  <div className="sticky-top" style={{top:"88px"}}>
                    <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
                      <div className="d-flex align-items-center justify-content-center bg-main fc-white fw-bold rounded-5 flex-shrink-0" style={{width:"44px",height:"44px",fontSize:"18px"}}>Б</div>
                      <div style={{minWidth:"0"}}>
                        <strong className="d-block fs-14 lh-sm text-truncate">Батболд</strong>
                        <span className="fs-12 fc-secondary d-block text-truncate">batbold@gmail.com</span>
                      </div>
                    </div>
                    <span className="d-block fs-11 fw-bold text-uppercase fc-secondary mb-3" style={{letterSpacing:".12em"}}>Миний бүртгэл</span>
                    <nav className="d-flex flex-column">
                      <Link href="/account/profile" className="side-nav-item">Хувийн мэдээлэл</Link>
                      <Link href="/account/address" className="side-nav-item">Хүргэлтийн хаяг</Link>
                      <Link href="/account/orders" className="side-nav-item active">Миний захиалгууд</Link>
                      <Link href="/wishlist" className="side-nav-item">Хадгалсан бараа</Link>
                    </nav>
                    <div style={{borderTop:"1px solid rgba(0,0,0,.07)",marginTop:"8px",paddingTop:"8px"}}>
                      <button className="side-nav-item border-0 bg-transparent text-start w-100" style={{color:"#FF006E"}}>Системээс гарах</button>
                    </div>
                  </div>
                </div>
      
                
                <div className="col-lg-9">
                  <h1 className="fw-bold fs-5 mb-4">Миний захиалгууд</h1>
      
                  <div className="d-flex gap-2 flex-wrap mb-4">
                    <button className="btn btn-main btn-sm px-3 rounded-pill fs-13">Бүгд</button>
                    <button className="btn btn-light btn-sm px-3 rounded-pill fs-13 fc-secondary">Хүлээгдэж буй</button>
                    <button className="btn btn-light btn-sm px-3 rounded-pill fs-13 fc-secondary">Баталгаажсан</button>
                    <button className="btn btn-light btn-sm px-3 rounded-pill fs-13 fc-secondary">Хүргэгдсэн</button>
                    <button className="btn btn-light btn-sm px-3 rounded-pill fs-13 fc-secondary">Цуцлагдсан</button>
                  </div>
      
                  <div className="d-flex flex-column gap-3">
      
                    <div className="border rounded-4 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-light flex-wrap gap-2">
                        <div><span className="fs-13 fc-secondary">Захиалга №</span><strong className="fs-13 ms-1">#20240715-001</strong></div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fs-12 fc-secondary">2024.07.15 09:42</span>
                          <span className="badge rounded-pill fw-semibold" style={{background:"#E8F4FD",color:"#1170B7"}}>Хүргэгдсэн</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 d-flex align-items-center gap-3">
                        <div className="d-flex gap-1 flex-shrink-0">
                          <img src={assetUrl('images/demo/product1.jpg')} alt="" className="rounded-3" style={{width:"48px",height:"48px",objectFit:"cover"}} />
                          <img src={assetUrl('images/demo/product2.jpg')} alt="" className="rounded-3" style={{width:"48px",height:"48px",objectFit:"cover"}} />
                        </div>
                        <div className="flex-grow-1">
                          <span className="fs-13 d-none d-sm-block">ESTEL De Luxe — Үсний будаг 5/0</span>
                          <span className="fs-12 fc-secondary d-none d-sm-block">болон 1 бараа</span>
                        </div>
                        <strong className="fs-14 fc-main flex-shrink-0">48,000₮</strong>
                      </div>
                      <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{borderTop:"1px solid rgba(0,0,0,.07)"}}>
                        <span className="fs-13 fc-secondary">Нийт: <strong className="fc-dark">48,000₮</strong></span>
                        <Link href="/account/orders/1" className="btn btn-outline-secondary btn-sm rounded-3 fs-13">Дэлгэрэнгүй</Link>
                      </div>
                    </div>
      
                    <div className="border rounded-4 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-light flex-wrap gap-2">
                        <div><span className="fs-13 fc-secondary">Захиалга №</span><strong className="fs-13 ms-1">#20240720-002</strong></div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fs-12 fc-secondary">2024.07.20 14:17</span>
                          <span className="badge rounded-pill fw-semibold" style={{background:"#FFF3E0",color:"#E65100"}}>Баталгаажсан</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 d-flex align-items-center gap-3">
                        <div className="d-flex gap-1 flex-shrink-0">
                          <img src={assetUrl('images/demo/product2.jpg')} alt="" className="rounded-3" style={{width:"48px",height:"48px",objectFit:"cover"}} />
                          <img src={assetUrl('images/demo/product3.jpg')} alt="" className="rounded-3" style={{width:"48px",height:"48px",objectFit:"cover"}} />
                          <img src={assetUrl('images/demo/product4.jpg')} alt="" className="rounded-3" style={{width:"48px",height:"48px",objectFit:"cover"}} />
                          <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold fs-12 fc-secondary" style={{width:"48px",height:"48px",background:"#F2F2F2"}}>+2</div>
                        </div>
                        <div className="flex-grow-1">
                          <span className="fs-13 d-none d-sm-block">Matrix Biolage — Шампунь 400мл</span>
                          <span className="fs-12 fc-secondary d-none d-sm-block">болон 4 бараа</span>
                        </div>
                        <strong className="fs-14 fc-main flex-shrink-0">32,000₮</strong>
                      </div>
                      <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{borderTop:"1px solid rgba(0,0,0,.07)"}}>
                        <span className="fs-13 fc-secondary">Нийт: <strong className="fc-dark">32,000₮</strong></span>
                        <Link href="/account/orders/1" className="btn btn-outline-secondary btn-sm rounded-3 fs-13">Дэлгэрэнгүй</Link>
                      </div>
                    </div>
      
                    <div className="border rounded-4 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-light flex-wrap gap-2">
                        <div><span className="fs-13 fc-secondary">Захиалга №</span><strong className="fs-13 ms-1">#20240725-003</strong></div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fs-12 fc-secondary">2024.07.25 11:05</span>
                          <span className="badge rounded-pill fw-semibold" style={{background:"#F3E5F5",color:"#7B1FA2"}}>Хүлээгдэж буй</span>
                        </div>
                      </div>
                      <div className="px-4 py-3 d-flex align-items-center gap-3">
                        <img src={assetUrl('images/demo/product3.jpg')} alt="" className="rounded-3 flex-shrink-0" style={{width:"56px",height:"56px",objectFit:"cover"}} />
                        <div className="flex-grow-1">
                          <span className="fs-13 d-none d-sm-block">Kérastase Nutritive — Маск 200мл</span>
                          <span className="fs-12 fc-secondary">×1 ширхэг</span>
                        </div>
                        <strong className="fs-14 fc-main flex-shrink-0">89,000₮</strong>
                      </div>
                      <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{borderTop:"1px solid rgba(0,0,0,.07)"}}>
                        <span className="fs-13 fc-secondary">Нийт: <strong className="fc-dark">89,000₮</strong></span>
                        <Link href="/account/orders/1" className="btn btn-outline-secondary btn-sm rounded-3 fs-13">Дэлгэрэнгүй</Link>
                      </div>
                    </div>
      
                  </div>
                </div>
      
              </div>
            </div>
          </section>
    </>
  );
}
