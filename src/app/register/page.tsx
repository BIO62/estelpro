import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function RegisterPage() {

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-7 col-lg-5">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <h5 className="fw-bold mb-1">Бүртгүүлэх</h5>
                    <p className="fc-secondary fs-13 mb-4">Шинэ бүртгэл үүсгэх</p>
                    <div className="d-flex flex-column gap-3">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="form-floating">
                            <input type="text" className="form-control rounded-3" id="regLastname" placeholder=" " />
                            <label htmlFor="regLastname" className="fc-secondary">Овог</label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input type="text" className="form-control rounded-3" id="regName" placeholder=" " />
                            <label htmlFor="regName" className="fc-secondary">Нэр</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-floating">
                        <input type="tel" className="form-control rounded-3" id="regPhone" placeholder=" " />
                        <label htmlFor="regPhone" className="fc-secondary">Утасны дугаар</label>
                      </div>
                      <div className="form-floating">
                        <input type="email" className="form-control rounded-3" id="regEmail" placeholder=" " />
                        <label htmlFor="regEmail" className="fc-secondary">Имэйл хаяг</label>
                      </div>
                      <div className="form-floating">
                        <input type="password" className="form-control rounded-3" id="regPass" placeholder=" " />
                        <label htmlFor="regPass" className="fc-secondary">Нууц үг</label>
                      </div>
                      <div className="form-floating">
                        <input type="password" className="form-control rounded-3" id="regPassConfirm" placeholder=" " />
                        <label htmlFor="regPassConfirm" className="fc-secondary">Нууц үг давтах</label>
                      </div>
                      <label className="d-flex align-items-start gap-2 cursor-pointer fs-13">
                        <input type="checkbox" className="form-check-input m-0 mt-1 flex-shrink-0" />
                        <span className="fc-secondary"><Link href="/terms" className="fc-main text-decoration-none">Үйлчилгээний нөхцөл</Link>-ийг зөвшөөрч байна</span>
                      </label>
                      <Link href="/verify" className="btn btn-main p-3 rounded-3 fw-semibold text-decoration-none text-center">Бүртгүүлэх</Link>
                      <p className="text-center fc-secondary fs-13 mb-0">Бүртгэл байгаа юу? <Link href="/login" className="fc-main text-decoration-none fw-semibold">Нэвтрэх</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
