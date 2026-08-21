'use client';

import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import CartBagIcon from '@/components/ui/CartBagIcon';
import { useCart } from '@/components/providers/CartProvider';

export default function Header() {
  const { count } = useCart();
  return (
    <header className="position-sticky top-0 zindex-6">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <button
              type="button"
              className="btn p-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#mainMenuCanvas"
              aria-controls="mainMenuCanvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/nav.svg')} alt="" />
            </button>
            <button
              type="button"
              className="btn p-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#mainMenuCanvas"
              aria-controls="mainMenuCanvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/search.svg')} alt="" />
            </button>
          </div>
          <Link href="/" className="d-block py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/logo.svg')} alt="" className="h-24" />
          </Link>
          <div className="d-flex">
            <Link href="/wishlist" className="btn p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/heart.svg')} alt="" />
            </Link>
            <button
              type="button"
              className="btn p-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#loginCanvas"
              aria-controls="loginCanvas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/user.svg')} alt="" />
            </button>
            <button
              type="button"
              className="btn p-2 position-relative header-cart-btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartCanvas"
              aria-controls="cartCanvas"
            >
              <CartBagIcon className="header-cart-icon" />
              {count > 0 && (
                <span className="fs-10 fw-bold fc-white bg-dark w-20 h-20 d-flex align-items-center justify-content-center position-absolute top-0 end-0 rounded-5">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
