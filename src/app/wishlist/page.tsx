import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { wishlistProducts } from '@/lib/products';

export default function WishlistPage() {
  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
        <div className="container">
          <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Link href="/account/profile" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хувийн мэдээлэл</Link>
            <Link href="/account/address" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хүргэлтийн хаяг</Link>
            <Link href="/account/orders" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Миний захиалгууд</Link>
            <Link href="/wishlist" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Хадгалсан бараа</Link>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-3 d-none d-lg-block">
              <div className="sticky-top" style={{ top: '88px' }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                  <div className="d-flex align-items-center justify-content-center bg-main fc-white fw-bold rounded-5 flex-shrink-0" style={{ width: '44px', height: '44px', fontSize: '18px' }}>Б</div>
                  <div style={{ minWidth: '0' }}>
                    <strong className="d-block fs-14 lh-sm text-truncate">Батболд</strong>
                    <span className="fs-12 fc-secondary d-block text-truncate">batbold@gmail.com</span>
                  </div>
                </div>
                <span className="d-block fs-11 fw-bold text-uppercase fc-secondary mb-3" style={{ letterSpacing: '.12em' }}>Миний бүртгэл</span>
                <nav className="d-flex flex-column">
                  <Link href="/account/profile" className="side-nav-item">Хувийн мэдээлэл</Link>
                  <Link href="/account/address" className="side-nav-item">Хүргэлтийн хаяг</Link>
                  <Link href="/account/orders" className="side-nav-item">Миний захиалгууд</Link>
                  <Link href="/wishlist" className="side-nav-item active">Хадгалсан бараа</Link>
                </nav>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.07)', marginTop: '8px', paddingTop: '8px' }}>
                  <button className="side-nav-item border-0 bg-transparent text-start w-100" style={{ color: '#FF006E' }}>Гарах</button>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h1 className="fw-bold fs-5 mb-1">Хадгалсан бараа</h1>
                  <p className="fc-secondary fs-13 mb-0">6 бараа хадгалагдсан</p>
                </div>
              </div>
              <div className="row g-3">
                {wishlistProducts.map((product) => (
                  <div className="col-6 col-sm-4" key={product.id}>
                    <ProductCard {...product} wished />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
