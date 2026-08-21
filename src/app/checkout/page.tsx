'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { useEffect } from 'react';

export default function CheckoutPage() {

  useEffect(() => {
    document.querySelectorAll('input[name="payMethod"]').forEach((radio) => {
      radio.addEventListener('change', function (this: HTMLInputElement) {
        document.querySelectorAll('.pay-panel').forEach((p) => p.classList.add('d-none'));
        const panel = document.getElementById('panel-' + this.value);
        if (panel) panel.classList.remove('d-none');
      });
    });
    let qpaySeconds = 299;
    const qpayEl = document.getElementById('payQpayTimer');
    const qpayInterval = setInterval(() => {
      qpaySeconds--;
      if (qpaySeconds < 0) { if (qpayEl) qpayEl.textContent = '00:00'; clearInterval(qpayInterval); return; }
      const m = String(Math.floor(qpaySeconds / 60)).padStart(2, '0');
      const s = String(qpaySeconds % 60).padStart(2, '0');
      if (qpayEl) qpayEl.textContent = m + ':' + s;
    }, 1000);
    (window as unknown as { selectBank?: (btn: HTMLElement, name: string, acc: string) => void }).selectBank = (btn, name, acc) => {
      document.querySelectorAll('.bank-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const bankName = document.getElementById('bankName');
      const bankAccNum = document.getElementById('bankAccNum');
      if (bankName) bankName.textContent = name;
      if (bankAccNum) bankAccNum.textContent = acc;
    };
    return () => clearInterval(qpayInterval);
  }, []);

  return (
    <>
      <section className="py-5" style={{background:"#fff",minHeight:"calc(100vh - 120px)"}}>
            <div className="container">
              <div className="row g-4 align-items-start">
      
                
                <div className="col-lg-7">
      
                  
                  <div className="bg-white rounded-4 p-4 mb-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="pay-step-dot pay-step-current" style={{width:"24px",height:"24px",fontSize:"11px"}}>1</div>
                      <h6 className="fw-bold mb-0">Хүргэлтийн хаяг</h6>
                    </div>
                    <div className="rounded-3 p-3 d-flex align-items-start gap-3" style={{background:"#F8FBFF",border:"1.5px solid #D0E6F7"}}>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong className="fs-14">Гэр</strong>
                          <span className="bg-main fc-white fs-11 fw-semibold px-2 rounded-5" style={{paddingTop:"2px",paddingBottom:"2px"}}>Үндсэн</span>
                        </div>
                        <p className="fs-13 fc-secondary mb-1">Батболд Дорж · +976 9911-2233</p>
                        <p className="fs-13 fc-dark mb-0">Сүхбаатар дүүрэг, 1-р хороо, Энхтайваны өргөн чөлөө 17</p>
                      </div>
                    </div>
                  </div>
      
                  
                  <div className="bg-white rounded-4 p-4 mb-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="pay-step-dot pay-step-current" style={{width:"24px",height:"24px",fontSize:"11px"}}>2</div>
                      <h6 className="fw-bold mb-0">Хүргэлтийн хугацаа</h6>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <label className="delivery-option d-flex align-items-center gap-3 p-3">
                        <input type="radio" name="delivery" checked style={{position:"absolute",opacity:"0",pointerEvents:"none"}} />
                        <div className="pay-radio"></div>
                        <div className="flex-grow-1">
                          <strong className="fs-14 d-block lh-sm">Стандарт хүргэлт</strong>
                          <span className="fs-12 fc-secondary">1–2 ажлын өдөр</span>
                        </div>
                        <span className="fw-semibold fs-14 flex-shrink-0">5,000₮</span>
                      </label>
                      <label className="delivery-option d-flex align-items-center gap-3 p-3">
                        <input type="radio" name="delivery" style={{position:"absolute",opacity:"0",pointerEvents:"none"}} />
                        <div className="pay-radio"></div>
                        <div className="flex-grow-1">
                          <strong className="fs-14 d-block lh-sm">UB Cab хүргэлт</strong>
                          <span className="fs-12 fc-secondary">Өнөөдөр 18:00 цагт</span>
                        </div>
                        <span className="fw-semibold fs-14 flex-shrink-0">Тооцоологдоно</span>
                      </label>
                    </div>
                  </div>
      
                  
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <div className="pay-step-dot pay-step-current" style={{width:"24px",height:"24px",fontSize:"11px"}}>3</div>
                      <h6 className="fw-bold mb-0">Төлбөрийн арга</h6>
                    </div>
      
                    
                    <div className="row g-2 mb-4">
                      <div className="col-4">
                        <label className="pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative">
                          <input type="radio" name="payMethod" value="qpay" checked />
                          <img src={assetUrl('images/demo/qpay.png')} alt="QPay" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                          <span className="fs-13 fw-semibold fc-dark">QPay</span>
                        </label>
                      </div>
                      <div className="col-4">
                        <label className="pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative">
                          <input type="radio" name="payMethod" value="storepay" />
                          <img src={assetUrl('images/storePay.png')} alt="StorePay" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                          <span className="fs-13 fw-semibold fc-dark">StorePay</span>
                        </label>
                      </div>
                      <div className="col-4">
                        <label className="pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative">
                          <input type="radio" name="payMethod" value="pocket" />
                          <img src={assetUrl('images/pocketZero.png')} alt="Pocket" style={{width:"40px",height:"40px",objectFit:"contain"}} />
                          <span className="fs-13 fw-semibold fc-dark">Pocket</span>
                        </label>
                      </div>
                    </div>
      
                    
                    <div id="panel-qpay" className="pay-panel">
                      <div className="d-flex flex-column flex-sm-row align-items-start gap-4 rounded-3 p-4" style={{background:"#F8FBFF",border:"1.5px solid #D0E6F7"}}>
                        <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-white p-2" style={{width:"180px",height:"180px",border:"1.5px solid #D0E6F7"}}>
                          <img src={assetUrl('images/demo/qr-code.svg')} alt="QR код" style={{width:"156px",height:"156px"}} />
                        </div>
                        <div className="d-flex flex-column gap-3">
                          <div>
                            <p className="fs-12 fc-secondary mb-1">Нийт төлөх дүн</p>
                            <strong className="fc-dark" style={{fontSize:"34px",letterSpacing:"-.02em",lineHeight:"1.1"}}>51,000₮</strong>
                          </div>
                          <div className="d-inline-flex align-items-center gap-2 rounded-3 px-3 py-2" style={{background:"#FFF9E6",width:"fit-content"}}>
                            <span className="fs-13" style={{color:"#856404"}}>Хүчинтэй: <strong id="payQpayTimer">04:59</strong></span>
                          </div>
                          <p className="fs-12 fc-secondary mb-0">QPay апп нээж, QR код уншуулна уу</p>
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary rounded-3 px-3 py-2 fs-13">Дахин авах</button>
                            <Link href="/checkout/qpay" className="btn btn-main rounded-3 px-3 py-2 fs-13">Q Pay</Link>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    
                    <div id="panel-pocket" className="pay-panel d-none">
                      <div className="rounded-3 p-4 d-flex align-items-start gap-3" style={{background:"#F5F0FF",border:"1.5px solid #D4BBFF"}}>
                        <img src={assetUrl('images/pocketZero.png')} alt="Pocket" className="flex-shrink-0 rounded-3" style={{width:"48px",height:"48px",objectFit:"contain"}} />
                        <div>
                          <strong className="fs-14 d-block mb-1">Pocket апп-р төлөх</strong>
                          <p className="fs-13 fc-secondary mb-0">Pocket апп нээж QR кодыг уншуулах эсвэл утасны дугаараар шилжүүлнэ үү.</p>
                        </div>
                      </div>
                    </div>
      
                    
                    <div id="panel-storepay" className="pay-panel d-none">
                      <div className="rounded-3 p-4" style={{background:"#FFF5F9",border:"1.5px solid #FFD6E8"}}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <img src={assetUrl('images/storePay.png')} alt="StorePay" className="flex-shrink-0 rounded-3" style={{width:"48px",height:"48px",objectFit:"contain"}} />
                          <div>
                            <strong className="fs-15 d-block">StorePay</strong>
                            <span className="fs-12 fc-secondary">Одоо аваад, хожим төлөх</span>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 mb-3">
                          <div className="d-flex align-items-start gap-2 fs-13 fc-secondary">
                            <span>30 хоногийн дотор, 0% хүүгүй төлнө</span>
                          </div>
                          <div className="d-flex align-items-start gap-2 fs-13 fc-secondary">
                            <span>Нэмэлт хураамж, шимтгэл байхгүй</span>
                          </div>
                          <div className="d-flex align-items-start gap-2 fs-13 fc-secondary">
                            <span>StorePay апп-д урьдчилан бүртгүүлсэн байх шаардлагатай</span>
                          </div>
                        </div>
                        <p className="fs-12 fc-secondary mb-0">Захиалга баталгаажсаны дараа StorePay апп-р нэвтэрч баталгаажуулна уу.</p>
                      </div>
                    </div>
      
                    <button className="btn btn-main w-100 p-3 rounded-3 fw-semibold mt-3" style={{fontSize:"15px"}}>Төлбөр шалгах</button>
      
                  </div>
                </div>
      
                
                <div className="col-lg-5">
                  <div className="bg-white rounded-4 p-4 sticky-top" style={{top:"88px",boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
                    <h6 className="fw-bold mb-4">Захиалгын хураангуй</h6>
      
                    
                    <div className="d-flex flex-column gap-3 mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <img src={assetUrl('images/demo/product1.jpg')} alt="" className="rounded-3 flex-shrink-0" style={{width:"56px",height:"56px",objectFit:"cover"}} />
                        <div className="flex-grow-1" style={{minWidth:"0"}}>
                          <p className="fs-13 fw-semibold fc-dark mb-0 lh-sm" style={{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:"2",WebkitBoxOrient:"vertical"}}>ESTEL De Luxe Крем будаг 60 мл</p>
                          <span className="fs-12 fc-secondary">×1</span>
                        </div>
                        <strong className="fs-14 flex-shrink-0">17,000₮</strong>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <img src={assetUrl('images/demo/product2.jpg')} alt="" className="rounded-3 flex-shrink-0" style={{width:"56px",height:"56px",objectFit:"cover"}} />
                        <div className="flex-grow-1" style={{minWidth:"0"}}>
                          <p className="fs-13 fw-semibold fc-dark mb-0 lh-sm" style={{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:"2",WebkitBoxOrient:"vertical"}}>Sensation Аммиакгүй будаг 60 мл</p>
                          <span className="fs-12 fc-secondary">×1</span>
                        </div>
                        <strong className="fs-14 flex-shrink-0">17,000₮</strong>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <img src={assetUrl('images/demo/product3.jpg')} alt="" className="rounded-3 flex-shrink-0" style={{width:"56px",height:"56px",objectFit:"cover"}} />
                        <div className="flex-grow-1" style={{minWidth:"0"}}>
                          <p className="fs-13 fw-semibold fc-dark mb-0 lh-sm" style={{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:"2",WebkitBoxOrient:"vertical"}}>ESTEL Professional Окси крем 150 мл</p>
                          <span className="fs-12 fc-secondary">×1</span>
                        </div>
                        <strong className="fs-14 flex-shrink-0">17,000₮</strong>
                      </div>
                    </div>
      
                    <hr style={{opacity:".07",margin:"0 0 16px"}} />
      
                    
                    <div className="d-flex flex-column gap-2 mb-4">
                      <div className="d-flex justify-content-between">
                        <span className="fs-13 fc-secondary">Барааны нийт</span>
                        <span className="fs-13 fc-dark">54,000₮</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="fs-13 fc-secondary">Хүргэлтийн төлбөр</span>
                        <span className="fs-13 fc-dark">5,000₮</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="fs-13 fc-secondary">Хямдрал</span>
                        <span className="fs-13" style={{color:"#2D9B4E"}}>−6,000₮</span>
                      </div>
                    </div>
      
                    <hr style={{opacity:".07",margin:"0 0 16px"}} />
      
                    <div className="d-flex justify-content-between align-items-baseline mb-4">
                      <span className="fw-bold fs-14">Нийт төлөх</span>
                      <strong className="fc-dark" style={{fontSize:"24px",letterSpacing:"-.02em"}}>53,000₮</strong>
                    </div>
      
                  </div>
                </div>
      
              </div>
            </div>
          </section>
    </>
  );
}
