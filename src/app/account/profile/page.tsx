import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function ProfilePage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
                      <nav style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <Link href="/account/profile" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Хувийн мэдээлэл</Link>
                <Link href="/account/address" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хүргэлтийн хаяг</Link>
                <Link href="/account/orders" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Миний захиалгууд</Link>
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
                      <Link href="/account/profile" className="side-nav-item active">Хувийн мэдээлэл</Link>
                      <Link href="/account/address" className="side-nav-item">Хүргэлтийн хаяг</Link>
                      <Link href="/account/orders" className="side-nav-item">Миний захиалгууд</Link>
                      <Link href="/wishlist" className="side-nav-item">Хадгалсан бараа</Link>
                    </nav>
                    <div style={{borderTop:"1px solid rgba(0,0,0,.07)",marginTop:"8px",paddingTop:"8px"}}>
                      <button className="side-nav-item border-0 bg-transparent text-start w-100" style={{color:"#FF006E"}}>Системээс гарах</button>
                    </div>
                  </div>
                </div>
      
                
                <div className="col-lg-9">
                  <h1 className="fw-bold fs-5 mb-1">Хувийн мэдээлэл</h1>
                  <p className="fc-secondary fs-13 mb-4">Таны бүртгэлийн мэдээлэл</p>
      
                  <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{borderBottom:"1px solid rgba(0,0,0,.07)"}}>
                    <div className="d-flex align-items-center justify-content-center bg-main fc-white fw-bold rounded-5 flex-shrink-0" style={{width:"64px",height:"64px",fontSize:"24px"}}>Б</div>
                    <div>
                      <strong className="d-block mb-1">Батболд Дорж</strong>
                      <span className="fc-secondary fs-13">batbold@gmail.com</span>
                    </div>
                  </div>
      
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Нэр</label>
                      <input type="text" className="form-control rounded-3" value="Батболд" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Овог</label>
                      <input type="text" className="form-control rounded-3" value="Дорж" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Утасны дугаар</label>
                      <input type="tel" className="form-control rounded-3" value="+976 9911-2233" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">И-мэйл</label>
                      <input type="email" className="form-control rounded-3" value="batbold@gmail.com" />
                    </div>
                    <div className="col-12 mt-4">
                      <button className="btn btn-main px-4 py-2">Хадгалах</button>
                    </div>
                  </div>
      
                  <hr className="my-5" style={{opacity:".08"}} />
      
                  <h2 className="fw-semibold fs-6 mb-3">Нууц үг солих</h2>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Одоогийн нууц үг</label>
                      <input type="password" className="form-control rounded-3" placeholder="••••••••" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Шинэ нууц үг</label>
                      <input type="password" className="form-control rounded-3" placeholder="••••••••" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fs-13 fw-semibold">Шинэ нууц үг давтах</label>
                      <input type="password" className="form-control rounded-3" placeholder="••••••••" />
                    </div>
                    <div className="col-12 mt-2">
                      <button className="btn btn-outline-secondary px-4 py-2 rounded-3">Нууц үг солих</button>
                    </div>
                  </div>
                </div>
      
              </div>
            </div>
          </section>
    </>
  );
}
