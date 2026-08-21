import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function AddressPage() {

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
            <div className="container">
                      <nav style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <Link href="/account/profile" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хувийн мэдээлэл</Link>
                <Link href="/account/address" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Хүргэлтийн хаяг</Link>
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
                      <Link href="/account/profile" className="side-nav-item">Хувийн мэдээлэл</Link>
                      <Link href="/account/address" className="side-nav-item active">Хүргэлтийн хаяг</Link>
                      <Link href="/account/orders" className="side-nav-item">Миний захиалгууд</Link>
                      <Link href="/wishlist" className="side-nav-item">Хадгалсан бараа</Link>
                    </nav>
                    <div style={{borderTop:"1px solid rgba(0,0,0,.07)",marginTop:"8px",paddingTop:"8px"}}>
                      <button className="side-nav-item border-0 bg-transparent text-start w-100" style={{color:"#FF006E"}}>Системээс гарах</button>
                    </div>
                  </div>
                </div>
      
                
                <div className="col-lg-9">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h1 className="fw-bold fs-5 mb-1">Хүргэлтийн хаяг</h1>
                      <p className="fc-secondary fs-13 mb-0">Хадгалсан хаягууд</p>
                    </div>
                    <button className="btn btn-main px-3 py-2 fs-14" data-bs-toggle="modal" data-bs-target="#addAddressModal">+ Хаяг нэмэх</button>
                  </div>
      
                  <div className="d-flex flex-column gap-3">
      
                    <div className="border rounded-4 p-4">
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <strong className="fs-14">Гэр</strong>
                            <span className="bg-main fc-white fs-11 fw-semibold px-2 rounded-5" style={{paddingTop:"2px",paddingBottom:"2px"}}>Үндсэн</span>
                          </div>
                          <p className="fc-secondary fs-13 mb-1">Батболд Дорж</p>
                          <p className="fc-secondary fs-13 mb-1">+976 9911-2233</p>
                          <p className="fc-secondary fs-13 mb-0">Сүхбаатар дүүрэг, 1-р хороо, Энхтайваны өргөн чөлөө 17</p>
                        </div>
                        <div className="d-flex gap-2 flex-shrink-0">
                          <button className="btn btn-sm btn-outline-secondary rounded-3 fs-13" data-bs-toggle="modal" data-bs-target="#addAddressModal">Засах</button>
                          <button className="btn btn-sm btn-outline-danger rounded-3 fs-13">Устгах</button>
                        </div>
                      </div>
                    </div>
      
                    <div className="border rounded-4 p-4">
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div>
                          <strong className="d-block fs-14 mb-2">Оффис</strong>
                          <p className="fc-secondary fs-13 mb-1">Батболд Дорж</p>
                          <p className="fc-secondary fs-13 mb-1">+976 9911-2233</p>
                          <p className="fc-secondary fs-13 mb-0">Баянзүрх дүүрэг, 13-р хороо, Соманг плаза 3-р давхар</p>
                        </div>
                        <div className="d-flex gap-2 flex-shrink-0">
                          <button className="btn btn-sm btn-outline-secondary rounded-3 fs-13" data-bs-toggle="modal" data-bs-target="#addAddressModal">Засах</button>
                          <button className="btn btn-sm btn-outline-danger rounded-3 fs-13">Устгах</button>
                        </div>
                      </div>
                    </div>
      
                  </div>
                </div>
      
              </div>
            </div>
          </section>
      
          
          <div className="modal fade" id="addAddressModal" tabIndex={-1} aria-labelledby="addAddressModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0" style={{boxShadow:"0 8px 48px rgba(0,0,0,.12)"}}>
                <div className="modal-header border-0 pb-0 px-4 pt-4">
                  <h5 className="modal-title fw-bold" id="addAddressModalLabel">Хаяг нэмэх</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body px-4 py-3">
                  <div className="d-flex flex-column gap-3">
      
                    <div className="form-floating">
                      <input type="text" className="form-control rounded-3" id="addrLabel" placeholder=" " />
                      <label htmlFor="addrLabel">Хаягийн нэр (жишээ: Гэр, Оффис)</label>
                    </div>
      
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="form-floating">
                          <input type="text" className="form-control rounded-3" id="addrLastname" placeholder=" " />
                          <label htmlFor="addrLastname">Овог</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-floating">
                          <input type="text" className="form-control rounded-3" id="addrFirstname" placeholder=" " />
                          <label htmlFor="addrFirstname">Нэр</label>
                        </div>
                      </div>
                    </div>
      
                    <div className="form-floating">
                      <input type="tel" className="form-control rounded-3" id="addrPhone" placeholder=" " />
                      <label htmlFor="addrPhone">Утасны дугаар</label>
                    </div>
      
                    <div className="form-floating">
                      <select className="form-select rounded-3" id="addrDistrict">
                        <option value="" selected disabled></option>
                        <option>Баянзүрх дүүрэг</option>
                        <option>Баянгол дүүрэг</option>
                        <option>Сүхбаатар дүүрэг</option>
                        <option>Чингэлтэй дүүрэг</option>
                        <option>Хан-Уул дүүрэг</option>
                        <option>Сонгинохайрхан дүүрэг</option>
                        <option>Налайх дүүрэг</option>
                        <option>Багануур дүүрэг</option>
                        <option>Багахангай дүүрэг</option>
                      </select>
                      <label htmlFor="addrDistrict">Дүүрэг</label>
                    </div>
      
                    <div className="form-floating">
                      <input type="text" className="form-control rounded-3" id="addrKhoroo" placeholder=" " />
                      <label htmlFor="addrKhoroo">Хороо</label>
                    </div>
      
                    <div className="form-floating">
                      <textarea className="form-control rounded-3" id="addrDetail" placeholder=" " style={{height:"88px",resize:"none"}}></textarea>
                      <label htmlFor="addrDetail">Гудамж, байшин, орц, давхар, тоот</label>
                    </div>
      
                    <label className="d-flex align-items-center gap-2 cursor-pointer" style={{userSelect:"none"}}>
                      <input type="checkbox" className="form-check-input m-0 flex-shrink-0" id="addrDefault" style={{width:"18px",height:"18px"}} />
                      <span className="fs-14 fc-dark">Үндсэн хаяг болгох</span>
                    </label>
      
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2">
                  <button type="button" className="btn btn-outline-secondary rounded-3 px-4 py-2 fs-14" data-bs-dismiss="modal">Болих</button>
                  <button type="button" className="btn btn-main rounded-3 px-4 py-2 fs-14 flex-grow-1">Хадгалах</button>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}
