import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function ForgotPasswordPage() {

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-4">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <Link href="/login" className="d-inline-flex align-items-center gap-1 text-decoration-none fc-secondary fs-13 mb-4">
                      <img src={assetUrl('images/icons/chevronLeftSmall.svg')} alt="" className="w-16 h-16" />
                      Буцах
                    </Link>
                    <h5 className="fw-bold mb-1">Нууц үг сэргээх</h5>
                    <p className="fc-secondary fs-13 mb-4">Бүртгэлтэй утасны дугаар эсвэл имэйл хаягаа оруулна уу. Баталгаажуулах код илгээнэ.</p>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-floating">
                        <input type="text" className="form-control rounded-3" id="forgotPhone" placeholder=" " />
                        <label htmlFor="forgotPhone" className="fc-secondary">Утасны дугаар эсвэл Имэйл</label>
                      </div>
                      <Link href="/verify" className="btn btn-main p-3 rounded-3 fw-semibold text-decoration-none text-center">Код илгээх</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
