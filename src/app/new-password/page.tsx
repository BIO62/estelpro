import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function NewPasswordPage() {

  return (
    <>
      <section className="pt-4 pt-sm-5 pb-5 d-flex align-items-start" style={{minHeight:"calc(100vh - 120px)",background:"#fff"}}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-4">
                  <div className="bg-white rounded-4 p-4" style={{boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
                    <h5 className="fw-bold mb-1">Нууц үг</h5>
                    <p className="fc-secondary fs-13 mb-4">Нууц үгээ тохируулна уу</p>
                    <div className="d-flex flex-column gap-3">
                      <div className="form-floating">
                        <input type="password" className="form-control rounded-3" id="newPass" placeholder=" " />
                        <label htmlFor="newPass" className="fc-secondary">Нууц үг</label>
                      </div>
                      <div className="form-floating">
                        <input type="password" className="form-control rounded-3" id="newPassConfirm" placeholder=" " />
                        <label htmlFor="newPassConfirm" className="fc-secondary">Нууц үг давтах</label>
                      </div>
                      <Link href="/login" className="btn btn-main p-3 rounded-3 fw-semibold text-decoration-none text-center">Хадгалах</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
