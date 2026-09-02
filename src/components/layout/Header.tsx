'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assetUrl } from '@/lib/constants';
import CartBagIcon from '@/components/ui/CartBagIcon';
import { useCart } from '@/components/providers/CartProvider';
import type { PublicUser } from '@/lib/auth/types';
import { isStaffRole } from '@/lib/auth/roles';

export default function Header() {
  const router = useRouter();
  const { count } = useCart();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data: { user?: PublicUser | null }) => setUser(data.user || null))
      .catch(() => setUser(null));

    const close = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const isConsumer = user?.role === 'consumer';
  const isSalon = user?.role === 'salon' || user?.kind === 'salon';
  const isStaff = isStaffRole(user?.role);
  const accountHref = isSalon ? '/dresser' : isStaff ? '/ad' : '/account/profile';
  const accountLabel = isSalon ? 'Салоны хэсэг' : isStaff ? 'Админ хэсэг' : 'Хувийн мэдээлэл';

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setAccountOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="position-sticky top-0 zindex-6 header-glass">
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
          <Link href="/" className="header-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/logo.svg')} alt="" className="h-24" />
          </Link>
          <div className="d-flex position-relative" style={{ zIndex: 3 }}>
            <Link href="/wishlist" className="btn p-2 header-wish-btn" aria-label="Хадгалсан бараа">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/icons/heart.svg')} alt="" />
            </Link>
            <div ref={accountRef} className="position-relative">
              {user ? (
                <button
                  type="button"
                  className="btn p-2"
                  aria-label={isConsumer ? 'Миний бүртгэл' : isSalon ? 'Салоны бүртгэл' : 'Админ бүртгэл'}
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/icons/user.svg')} alt="" />
                </button>
              ) : (
                <Link href="/login" className="btn p-2" aria-label="Нэвтрэх">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/icons/user.svg')} alt="" />
                </Link>
              )}

              {user && accountOpen ? (
                <div
                  className="position-absolute end-0 bg-white border rounded-4 p-3"
                  style={{
                    top: 'calc(100% + 8px)',
                    width: 'min(320px, calc(100vw - 24px))',
                    boxShadow: '0 16px 48px rgba(0,0,0,.14)',
                  }}
                >
                  <div className="d-flex align-items-center gap-3 pb-3 mb-2 border-bottom">
                    <div
                      className="d-flex align-items-center justify-content-center bg-main fc-white fw-bold rounded-circle flex-shrink-0"
                      style={{ width: 42, height: 42 }}
                    >
                      {(user.name || user.email).slice(0, 1).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <strong className="d-block fs-14 text-truncate">{user.name || 'Хэрэглэгч'}</strong>
                      <span className="d-block fs-12 fc-secondary text-truncate">{user.email}</span>
                      {isSalon && user.discountPercent ? (
                        <span className="d-block fs-12 fw-semibold text-truncate" style={{ color: '#1170b7' }}>
                          {user.discountLabel || `${user.discountPercent}% хөнгөлөлт`}
                        </span>
                      ) : null}
                      {isSalon && user.discountPercent === 0 ? (
                        <span className="d-block fs-12 fw-semibold text-truncate" style={{ color: '#1170b7' }}>
                          0% хөнгөлөлт
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <Link
                    href={accountHref}
                    className="d-block rounded-3 px-3 py-2 text-decoration-none fc-dark fs-13"
                    onClick={() => setAccountOpen(false)}
                  >
                    {accountLabel}
                  </Link>
                  {isSalon ? (
                    <Link
                      href="/dresser/account"
                      className="d-block rounded-3 px-3 py-2 text-decoration-none fc-dark fs-13"
                      onClick={() => setAccountOpen(false)}
                    >
                      Нууц үг солих
                    </Link>
                  ) : null}
                  {isConsumer ? (
                    <>
                      <Link
                        href="/account/address"
                        className="d-block rounded-3 px-3 py-2 text-decoration-none fc-dark fs-13"
                        onClick={() => setAccountOpen(false)}
                      >
                        Хүргэлтийн хаяг
                      </Link>
                      <Link
                        href="/account/orders"
                        className="d-block rounded-3 px-3 py-2 text-decoration-none fc-dark fs-13"
                        onClick={() => setAccountOpen(false)}
                      >
                        Миний захиалгууд
                      </Link>
                      <Link
                        href="/wishlist"
                        className="d-block rounded-3 px-3 py-2 text-decoration-none fc-dark fs-13"
                        onClick={() => setAccountOpen(false)}
                      >
                        Хадгалсан бараа
                      </Link>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="btn w-100 text-start px-3 py-2 mt-2 border-top rounded-0 fs-13 text-danger"
                    onClick={logout}
                  >
                    Системээс гарах
                  </button>
                </div>
              ) : null}
            </div>
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
