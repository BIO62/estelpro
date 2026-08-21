'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { assetUrl } from '@/lib/constants';
import { DRESSER_COOKIE } from '@/lib/catalog-audience';

export default function LoginDresserPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim() || !password.trim()) return;
    document.cookie = `${DRESSER_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    router.push('/dresser');
    router.refresh();
  }

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{ minHeight: 'calc(100vh - 120px)', background: '#fff' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-9 col-md-6 col-lg-4">
              <div className="bg-white rounded-4 p-4" style={{ boxShadow: '0 4px 32px rgba(0,0,0,.07)' }}>
                <h5 className="fw-bold mb-1">Салон нэвтрэх</h5>
                <p className="fc-secondary fs-13 mb-4">Үсчдийн каталогийг зөвхөн салоноор нэвтэрсэн үед харна</p>
                <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
                  <div className="form-floating">
                    <input type="text" className="form-control rounded-3" id="loginPhone" placeholder=" " value={code} onChange={(e) => setCode(e.target.value)} />
                    <label htmlFor="loginPhone" className="fc-secondary">Хэрэглэгчийн код</label>
                  </div>
                  <div className="form-floating">
                    <input type="password" className="form-control rounded-3" id="loginPass" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="loginPass" className="fc-secondary">Нууц үг</label>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="d-flex align-items-center gap-2 cursor-pointer fs-13">
                      <input type="checkbox" className="form-check-input m-0" />
                      <span className="fc-secondary">Нэвтрэх нэр сануулах</span>
                    </label>
                    <Link href="/forgot-password" className="fs-13 fc-main text-decoration-none">Нууц үг мартсан</Link>
                  </div>
                  <button type="submit" className="btn btn-main p-3 rounded-3 fw-semibold">Нэвтрэх</button>
                  <button type="button" className="btn border p-3 rounded-3 d-flex align-items-center justify-content-center gap-2">
                    <img src={assetUrl('images/gmail.png')} alt="" className="w-20 h-20" />
                    <span className="fw-medium fs-14">Gmail-р нэвтрэх</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
