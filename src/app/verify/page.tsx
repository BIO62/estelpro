'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { useEffect } from 'react';

export default function VerifyPage() {

  useEffect(() => {
    document.querySelectorAll('.otp-box').forEach((inp, idx, all) => {
      inp.addEventListener('input', function (this: HTMLInputElement) {
        this.value = this.value.replace(/\D/g, '');
        if (this.value && idx < all.length - 1) (all[idx + 1] as HTMLInputElement).focus();
      });
      inp.addEventListener('keydown', function (this: HTMLInputElement, e) {
        if ((e as KeyboardEvent).key === 'Backspace' && !this.value && idx > 0) (all[idx - 1] as HTMLInputElement).focus();
      });
    });
    let t = 90;
    const tEl = document.getElementById('otpTimer');
    const ti = setInterval(() => {
      t--;
      if (t <= 0) { clearInterval(ti); if (tEl) tEl.textContent = '00:00'; return; }
      if (tEl) tEl.textContent = (Math.floor(t / 60) < 10 ? '0' : '') + Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60);
    }, 1000);
    return () => clearInterval(ti);
  }, []);

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-4">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <Link href="/forgot-password" className="d-inline-flex align-items-center gap-1 text-decoration-none fc-secondary fs-13 mb-4">
                      <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" />
                      Буцах
                    </Link>
                    <h5 className="fw-bold mb-1">Баталгаажуулах</h5>
                    <p className="fc-secondary fs-13 mb-4">99XXXXXX дугаарт 6 оронтой код илгээлээ</p>
                    <div className="d-flex gap-2 justify-content-between mb-4" id="otpInputs">
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                      <input type="text" inputMode="numeric" maxLength={1} className="form-control text-center fw-bold fs-4 rounded-3 p-0 otp-box" style={{width:"48px",height:"56px"}} />
                    </div>
                    <div className="text-center mb-4">
                      <span className="fc-secondary fs-13">Дахин код авах: </span>
                      <span className="fw-semibold fc-main fs-13" id="otpTimer">01:30</span>
                    </div>
                    <Link href="/new-password" className="btn btn-main p-3 rounded-3 fw-semibold w-100 text-decoration-none text-center d-block">Баталгаажуулах</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
