import Link from 'next/link';
import { assetUrl } from '@/lib/constants';

export default function AcademyBanner() {
  return (
    <section className="academy-banner">
      <div className="container-fluid p-0 position-relative">
        <div className="d-sm-block d-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl('images/demo/bottomDesktopImage.webp')} alt="" className="w-100 h-auto img-cover d-block" />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center ps-lg-5 ps-4 fc-white">
            <h3 className="fw-bold d-block mb-3">Сургалтын Академи</h3>
            <p className="mb-3">Here we create opportunities for learning and inspiration</p>
            <Link href="/academy" className="btn btn-main mt-3">
              <span>Тун удахгүй</span>
            </Link>
          </div>
        </div>
        <div className="d-sm-none d-block position-relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl('images/demo/bottomDesktopImage.webp')} alt="" className="w-100 h-320 img-cover d-block" />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center text-center justify-content-center fc-white px-3">
            <h3 className="fw-bold d-block mb-3">Сургалтын Академи</h3>
            <p className="mb-3">Here we create opportunities for learning and inspiration</p>
            <Link href="/academy" className="btn btn-main mt-3">
              <span>Тун удахгүй</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
