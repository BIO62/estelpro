'use client';

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { useWishlist } from '@/components/providers/WishlistProvider';

export default function WishlistPage() {
  const { items } = useWishlist();

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
            

            <div className="col-lg-9">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h1 className="fw-bold fs-5 mb-1">Хадгалсан бараа</h1>
                  <p className="fc-secondary fs-13 mb-0">
                    {items.length > 0 ? `${items.length} бараа хадгалагдсан` : 'Хадгалсан бараа байхгүй'}
                  </p>
                </div>
              </div>
              {items.length > 0 ? (
                <div className="row g-3">
                  {items.map((product) => (
                    <div className="col-6 col-sm-4" key={product.id}>
                      <ProductCard {...product} wished />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="fc-secondary fs-14">Зүрх дарж бараа хадгална уу.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
