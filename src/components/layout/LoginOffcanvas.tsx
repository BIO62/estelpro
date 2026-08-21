import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function LoginOffcanvas() {
  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="loginCanvas" aria-labelledby="loginCanvasLabel">
      <div className="offcanvas-header border-bottom">
        <h4 className="offcanvas-title fw-bold" id="loginCanvasLabel">
          Нэвтрэх
        </h4>
        <button type="button" className="btn p-2" data-bs-dismiss="offcanvas" aria-label="Close">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl('images/icons/times.svg')} alt="" className="w-20 h-20" />
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="d-flex gap-2 mb-4">
          <Link href="/login" className="btn btn-main flex-grow-1" data-bs-dismiss="offcanvas">
            Нэвтрэх
          </Link>
          <Link href="/register" className="btn btn-outline flex-grow-1" data-bs-dismiss="offcanvas">
            Бүртгүүлэх
          </Link>
        </div>
        <form className="d-flex flex-column gap-3">
          <div className="form-floating">
            <input type="text" className="form-control rounded-3" id="loginPhoneDrawer" placeholder=" " />
            <label htmlFor="loginPhoneDrawer">Утасны дугаар эсвэл Имэйл хаяг</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control rounded-3" id="loginPassDrawer" placeholder=" " />
            <label htmlFor="loginPassDrawer">Нууц үг</label>
          </div>
          <div className="form-check d-flex align-items-center gap-2">
            <input className="form-check-input m-0" type="checkbox" id="rememberDrawer" />
            <label className="form-check-label fs-14" htmlFor="rememberDrawer">
              Нэвтрэх нэр сануулах
            </label>
          </div>
          <Link href="/login" className="btn btn-main w-100" data-bs-dismiss="offcanvas">
            Нэвтрэх
          </Link>
          <Link href="/login" className="btn btn-outline w-100 d-flex align-items-center justify-content-center gap-2" data-bs-dismiss="offcanvas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/icons/google.svg')} alt="" className="w-20 h-20" />
            Gmail-р нэвтрэх
          </Link>
          <Link href="/register" className="btn btn-light w-100" data-bs-dismiss="offcanvas">
            Бүртгүүлэх
          </Link>
        </form>
      </div>
    </div>
  );
}
