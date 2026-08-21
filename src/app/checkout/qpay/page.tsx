'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function QpayPage() {

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-4">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <Link href="/checkout" className="d-inline-flex align-items-center gap-1 text-decoration-none fc-secondary fs-13 mb-3">
                      <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" />
                      Буцах
                    </Link>
                    <h5 className="fw-bold mb-4">Төлбөр төлөх</h5>
                    <div className="text-center mb-4">
                      <span className="d-block fs-11 fw-bold text-uppercase fc-secondary mb-2" style={{letterSpacing:".12em"}}>Нийт дүн</span>
                      <strong className="d-block fc-dark" style={{fontSize:"36px",letterSpacing:"-.02em"}}>51,000₮</strong>
                    </div>
                    
                    <div className="mb-4 mx-auto" style={{width:"200px",height:"200px"}}>
                      <img src={assetUrl('images/demo/qr-code.svg')} alt="QR код" style={{width:"200px",height:"200px"}} />
                    </div>
                    <p className="text-center fc-secondary fs-13 mb-3">Банкны апп нээх</p>
                    <div className="row row-cols-5 g-2 mb-4">
                      <div className="col"><img src={assetUrl('images/demo/khanbank.png')} alt="Хаан банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/golomt.png')} alt="Голомт банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/mbank.png')} alt="M банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/xac.png')} alt="ХАС банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/state.png')} alt="Төрийн банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/tdb.png')} alt="ХХБ" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/xac.png')} alt="ХАС банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/state.png')} alt="Төрийн банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/khanbank.png')} alt="Хаан банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/mbank.png')} alt="M банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/golomt.png')} alt="Голомт банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/mbank.png')} alt="M банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/tdb.png')} alt="ХХБ" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/golomt.png')} alt="Голомт банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/khanbank.png')} alt="Хаан банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/state.png')} alt="Төрийн банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/khanbank.png')} alt="Хаан банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/xac.png')} alt="ХАС банк" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/tdb.png')} alt="ХХБ" className="w-100 h-auto rounded-2" /></div>
                      <div className="col"><img src={assetUrl('images/demo/golomt.png')} alt="Голомт банк" className="w-100 h-auto rounded-2" /></div>
                    </div>
                    <button type="button" className="btn btn-main w-100 p-3 rounded-3 fs-13 fw-semibold">Төлбөр шалгах</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
