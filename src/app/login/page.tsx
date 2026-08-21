import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function LoginPage() {

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-4">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <h5 className="fw-bold mb-1">Нэвтрэх</h5>
                    <p className="fc-secondary fs-13 mb-4">Бүртгүүлэх</p>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-floating">
                        <input type="text" className="form-control rounded-3" id="loginPhone" placeholder=" " />
                        <label htmlFor="loginPhone" className="fc-secondary">Утасны дугаар эсвэл Имэйл хаяг</label>
                      </div>
                      <div className="form-floating">
                        <input type="password" className="form-control rounded-3" id="loginPass" placeholder=" " />
                        <label htmlFor="loginPass" className="fc-secondary">Нууц үг</label>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <label className="d-flex align-items-center gap-2 cursor-pointer fs-13">
                          <input type="checkbox" className="form-check-input m-0" />
                          <span className="fc-secondary">Нэвтрэх нэр сануулах</span>
                        </label>
                        <Link href="/forgot-password" className="fs-13 fc-main text-decoration-none">Нууц үг мартсан</Link>
                      </div>
                      <button type="button" className="btn btn-main p-3 rounded-3 fw-semibold">Нэвтрэх</button>
                      <button type="button" className="btn border p-3 rounded-3 d-flex align-items-center justify-content-center gap-2">
                        <img src={assetUrl('images/gmail.png')} alt="" className="w-20 h-20" />
                        <span className="fw-medium fs-14">Gmail-р нэвтрэх</span>
                      </button>
                      <Link href="/register" className="btn p-3 rounded-3 w-100 text-center">
                        <span className="fs-14 text-decoration-underline">Бүртгүүлэх</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
