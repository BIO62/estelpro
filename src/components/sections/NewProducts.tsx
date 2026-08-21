'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartIconButton from '@/components/ui/CartIconButton';
import { catalog } from '@/lib/products';

const tiles = [catalog[5], catalog[0], catalog[2], catalog[3]];

export default function NewProducts() {
  return (
    <section className="position-relative py-5">
      <div className="container position-relative">
        <h4 className="fw-bold fs-6 text-uppercase border-start ps-2 border-3 mb-3">Шинэ бүтээгдэхүүн</h4>

        <div className="row g-2 mb-4 d-sm-flex d-none">
          <div className="col-sm-6">
            <div className="product-media">
              <Link href={`/products/${tiles[0].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000.jpg')} alt="" className="w-100 h-auto ratio11 img-cover rounded-3" />
              </Link>
              <CartIconButton product={tiles[0]} />
            </div>
          </div>
          <div className="col-sm-3 col-6">
            <div className="row row-cols-1 g-2">
              {[
                { img: 'images/demo/1000x1000,.jpg', product: tiles[1] },
                { img: 'images/demo/1000x1000..jpg', product: tiles[2] },
              ].map((item) => (
                <div className="col" key={item.product.id}>
                  <div className="product-media">
                    <Link href={`/products/${item.product.id}`} className="d-block h-100 text-decoration-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl(item.img)} alt="" className="w-100 h-auto ratio11 img-cover rounded-3" />
                    </Link>
                    <CartIconButton product={item.product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-3 col-6">
            <div className="product-media h-100">
              <Link href={`/products/${tiles[3].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000 peptides.jpg')} alt="" className="w-100 h-100 ratio11 img-cover rounded-3" />
              </Link>
              <CartIconButton product={tiles[3]} />
            </div>
          </div>
        </div>

        <div className="d-flex d-sm-none gap-2 new-products-mob">
          <div className="d-flex flex-column gap-2">
            <div className="product-media new-prod-sq rounded-3 overflow-hidden">
              <Link href={`/products/${tiles[1].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000,.jpg')} alt="" className="w-100 h-100 img-cover" />
              </Link>
              <CartIconButton product={tiles[1]} />
            </div>
            <div className="product-media new-prod-tall rounded-3 overflow-hidden">
              <Link href={`/products/${tiles[2].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000..jpg')} alt="" className="w-100 h-100 img-cover" />
              </Link>
              <CartIconButton product={tiles[2]} />
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <div className="product-media new-prod-tall rounded-3 overflow-hidden">
              <Link href={`/products/${tiles[3].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000 peptides.jpg')} alt="" className="w-100 h-100 img-cover" />
              </Link>
              <CartIconButton product={tiles[3]} />
            </div>
            <div className="product-media new-prod-sq rounded-3 overflow-hidden">
              <Link href={`/products/${tiles[0].id}`} className="d-block h-100 text-decoration-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/demo/1000x1000.jpg')} alt="" className="w-100 h-100 img-cover" />
              </Link>
              <CartIconButton product={tiles[0]} />
            </div>
          </div>
        </div>

        <div className="text-center py-5">
          <h3 className="fw-bold mb-3">LUXURY PEPTIDES</h3>
          <p className="mb-4 mx-auto maxw-640">
            Үсний угийг бэхжүүлж, үс уналтын эсрэг арчилна.
          </p>
          <Link href="/products/1" className="btn btn-main btn-swipe d-inline-flex align-items-center">
            <span>Худалдаж авах</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
