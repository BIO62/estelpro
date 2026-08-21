import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function OrderDetailPage() {

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
                  
                  <div className="d-flex align-items-start gap-3 mb-4 flex-wrap">
                    <div>
                      <h5 className="fw-bold mb-1">Захиалга #20240312</h5>
                      <span className="fc-secondary fs-13">2024.03.12 14:30 · 2 бараа</span>
                    </div>
                    <span className="ms-auto badge rounded-pill px-3 py-2 fs-12 fw-semibold flex-shrink-0" style={{background:"#FFF3E0",color:"#C05500"}}>Хүлээгдэж буй</span>
                  </div>
      
                  
                  <div className="bg-white rounded-4 p-4 mb-3">
                    <strong className="d-block fs-14 mb-3">Барааны жагсаалт</strong>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex gap-3 align-items-start">
                        <Link href="/products/1" className="flex-shrink-0">
                          <img src={assetUrl('images/demo/product1.jpg')} alt="" className="rounded-3 img-cover" style={{width:"64px",height:"64px",objectFit:"cover"}} />
                        </Link>
                        <div className="flex-grow-1 min-width-0">
                          <Link href="/products/1" className="d-block fc-dark text-decoration-none fw-semibold lh-sm mb-1">De Luxe Үсний будаг 60мл</Link>
                          <span className="fc-secondary fs-13">× 2</span>
                        </div>
                        <strong className="flex-shrink-0 fs-14">36,000₮</strong>
                      </div>
                      <hr className="my-0 opacity-10" />
                      <div className="d-flex gap-3 align-items-start">
                        <Link href="/products/1" className="flex-shrink-0">
                          <img src={assetUrl('images/demo/product2.jpg')} alt="" className="rounded-3 img-cover" style={{width:"64px",height:"64px",objectFit:"cover"}} />
                        </Link>
                        <div className="flex-grow-1">
                          <Link href="/products/1" className="d-block fc-dark text-decoration-none fw-semibold lh-sm mb-1">Curex Balance шампунь 250мл</Link>
                          <span className="fc-secondary fs-13">× 1</span>
                        </div>
                        <strong className="flex-shrink-0 fs-14">24,500₮</strong>
                      </div>
                    </div>
                  </div>
      
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="bg-white rounded-4 p-4 h-100">
                        <strong className="d-block fs-14 mb-3">Хүргэлтийн хаяг</strong>
                        <p className="fc-secondary fs-13 mb-1">Батболд Д.</p>
                        <p className="fc-secondary fs-13 mb-1">+976 9900 0000</p>
                        <p className="fc-secondary fs-13 mb-0">Улаанбаатар, Баянзүрх дүүрэг, 1-р хороо, Токиогийн гудамж 23</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-white rounded-4 p-4 h-100">
                        <strong className="d-block fs-14 mb-3">Төлбөрийн дүн</strong>
                        <div className="d-flex justify-content-between fs-13 mb-2">
                          <span className="fc-secondary">Барааны дүн</span>
                          <span>60,500₮</span>
                        </div>
                        <div className="d-flex justify-content-between fs-13 mb-3">
                          <span className="fc-secondary">Хүргэлт</span>
                          <span>5,000₮</span>
                        </div>
                        <hr className="opacity-10 my-0 mb-3" />
                        <div className="d-flex justify-content-between fw-bold mb-3">
                          <span>Нийт</span>
                          <span>65,500₮</span>
                        </div>
                        <Link href="/checkout" className="btn btn-main w-100 py-3 fw-semibold">Төлбөр төлөх</Link>
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
