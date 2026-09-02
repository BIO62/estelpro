'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { assetUrl } from '@/lib/constants';
import { formatPrice } from '@/lib/cart';
import { useCart } from '@/components/providers/CartProvider';
import type { PublicUser } from '@/lib/auth/types';

const FREE_DELIVERY = 80_000;
const STANDARD_FEE = 5_000;
const UBCAB_FEE = 8_000;
const QPAY_SECONDS = 299;

type DeliveryId = 'standard' | 'ubcab';
type PayMethod = 'qpay' | 'storepay' | 'pocket';

export default function CheckoutPage() {
  const { items, subtotal, discount, total, ready } = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>('standard');
  const [payMethod, setPayMethod] = useState<PayMethod>('qpay');
  const [user, setUser] = useState<PublicUser | null>(null);
  const [qpaySeconds, setQpaySeconds] = useState(QPAY_SECONDS);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data: { user?: PublicUser | null }) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (payMethod !== 'qpay') return undefined;
    setQpaySeconds(QPAY_SECONDS);
    const timer = window.setInterval(() => {
      setQpaySeconds((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [payMethod]);

  const standardFee = subtotal >= FREE_DELIVERY ? 0 : STANDARD_FEE;
  const deliveryFee = delivery === 'ubcab' ? UBCAB_FEE : standardFee;
  const payTotal = total + deliveryFee;
  useEffect(() => {
    try {
      sessionStorage.setItem('estel-checkout', JSON.stringify({ delivery, payTotal }));
    } catch {
      /* ignore */
    }
  }, [delivery, payTotal]);
  const qpayClock = `${String(Math.floor(qpaySeconds / 60)).padStart(2, '0')}:${String(qpaySeconds % 60).padStart(2, '0')}`;
  const contactName = [user?.name, user?.lastName].filter(Boolean).join(' ').trim();
  const addressLine = useMemo(
    () => [user?.district, user?.city, user?.address].filter(Boolean).join(', '),
    [user],
  );

  if (!ready) {
    return (
      <section className="py-5" style={{ background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
        <div className="container py-5 text-center fc-secondary">Ачааллаж байна…</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-5" style={{ background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
        <div className="container py-5 text-center">
          <p className="fw-semibold mb-1">Сагс хоосон байна</p>
          <p className="fc-secondary mb-4">Захиалга өгөхийн тулд бараа сагсална уу.</p>
          <Link href="/list" className="btn btn-main rounded-3 px-4 py-2">
            Бараа үзэх
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5" style={{ background: '#fff', minHeight: 'calc(100vh - 120px)' }}>
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-lg-7">
            <div className="bg-white rounded-4 p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="pay-step-dot pay-step-current" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
                  1
                </div>
                <h6 className="fw-bold mb-0">Хүргэлтийн хаяг</h6>
              </div>
              {addressLine ? (
                <div className="rounded-3 p-3 d-flex align-items-start gap-3" style={{ background: '#F8FBFF', border: '1.5px solid #D0E6F7' }}>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong className="fs-14">{user?.city || 'Хаяг'}</strong>
                      <span className="bg-main fc-white fs-11 fw-semibold px-2 rounded-5" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
                        Үндсэн
                      </span>
                    </div>
                    <p className="fs-13 fc-secondary mb-1">
                      {[contactName, user?.phone].filter(Boolean).join(' · ') || user?.email}
                    </p>
                    <p className="fs-13 fc-dark mb-0">{addressLine}</p>
                    <Link href="/account/address" className="fs-12 mt-2 d-inline-block">
                      Хаяг солих
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-3 p-3" style={{ background: '#F8FBFF', border: '1.5px dashed #D0E6F7' }}>
                  <p className="fs-13 fc-secondary mb-2">Хүргэлтийн хаяг оруулаагүй байна.</p>
                  <Link href={user ? '/account/address' : '/login?next=/checkout'} className="btn btn-main rounded-3 px-3 py-2 fs-13">
                    {user ? 'Хаяг нэмэх' : 'Нэвтэрч хаяг оруулах'}
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-4 p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="pay-step-dot pay-step-current" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
                  2
                </div>
                <h6 className="fw-bold mb-0">Хүргэлтийн хугацаа</h6>
              </div>
              <div className="d-flex flex-column gap-2">
                <label className={`delivery-option d-flex align-items-center gap-3 p-3${delivery === 'standard' ? ' is-active' : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={delivery === 'standard'}
                    onChange={() => setDelivery('standard')}
                  />
                  <div className="pay-radio" />
                  <div className="flex-grow-1">
                    <strong className="fs-14 d-block lh-sm">Стандарт хүргэлт</strong>
                    <span className="fs-12 fc-secondary">1–2 ажлын өдөр</span>
                  </div>
                  <span className="fw-semibold fs-14 flex-shrink-0">
                    {standardFee === 0 ? 'Үнэгүй' : formatPrice(standardFee)}
                  </span>
                </label>
                <label className={`delivery-option d-flex align-items-center gap-3 p-3${delivery === 'ubcab' ? ' is-active' : ''}`}>
                  <input
                    type="radio"
                    name="delivery"
                    value="ubcab"
                    checked={delivery === 'ubcab'}
                    onChange={() => setDelivery('ubcab')}
                  />
                  <div className="pay-radio" />
                  <div className="flex-grow-1">
                    <strong className="fs-14 d-block lh-sm">UB Cab хүргэлт</strong>
                    <span className="fs-12 fc-secondary">Өнөөдөр 18:00 цагт</span>
                  </div>
                  <span className="fw-semibold fs-14 flex-shrink-0">{formatPrice(UBCAB_FEE)}</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-4 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="pay-step-dot pay-step-current" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
                  3
                </div>
                <h6 className="fw-bold mb-0">Төлбөрийн арга</h6>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-4">
                  <label className={`pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative${payMethod === 'qpay' ? ' is-active' : ''}`}>
                    <input type="radio" name="payMethod" value="qpay" checked={payMethod === 'qpay'} onChange={() => setPayMethod('qpay')} />
                    <img src={assetUrl('images/demo/qpay.png')} alt="QPay" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <span className="fs-13 fw-semibold fc-dark">QPay</span>
                  </label>
                </div>
                <div className="col-4">
                  <label className={`pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative${payMethod === 'storepay' ? ' is-active' : ''}`}>
                    <input type="radio" name="payMethod" value="storepay" checked={payMethod === 'storepay'} onChange={() => setPayMethod('storepay')} />
                    <img src={assetUrl('images/storePay.png')} alt="StorePay" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <span className="fs-13 fw-semibold fc-dark">StorePay</span>
                  </label>
                </div>
                <div className="col-4">
                  <label className={`pay-method-card d-flex flex-column align-items-center gap-2 p-3 w-100 position-relative${payMethod === 'pocket' ? ' is-active' : ''}`}>
                    <input type="radio" name="payMethod" value="pocket" checked={payMethod === 'pocket'} onChange={() => setPayMethod('pocket')} />
                    <img src={assetUrl('images/pocketZero.png')} alt="Pocket" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <span className="fs-13 fw-semibold fc-dark">Pocket</span>
                  </label>
                </div>
              </div>

              {payMethod === 'qpay' && (
                <div className="pay-panel">
                  <div className="d-flex flex-column flex-sm-row align-items-start gap-4 rounded-3 p-4" style={{ background: '#F8FBFF', border: '1.5px solid #D0E6F7' }}>
                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-white p-2" style={{ width: '180px', height: '180px', border: '1.5px solid #D0E6F7' }}>
                      <img src={assetUrl('images/demo/qr-code.svg')} alt="QR код" style={{ width: '156px', height: '156px' }} />
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <p className="fs-12 fc-secondary mb-1">Нийт төлөх дүн</p>
                        <strong className="fc-dark" style={{ fontSize: '34px', letterSpacing: '-.02em', lineHeight: '1.1' }}>
                          {formatPrice(payTotal)}
                        </strong>
                      </div>
                      <div className="d-inline-flex align-items-center gap-2 rounded-3 px-3 py-2" style={{ background: '#FFF9E6', width: 'fit-content' }}>
                        <span className="fs-13" style={{ color: '#856404' }}>
                          Хүчинтэй: <strong>{qpayClock}</strong>
                        </span>
                      </div>
                      <p className="fs-12 fc-secondary mb-0">QPay апп нээж, QR код уншуулна уу</p>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary rounded-3 px-3 py-2 fs-13" onClick={() => setQpaySeconds(QPAY_SECONDS)}>
                          Дахин авах
                        </button>
                        <Link href="/checkout/qpay" className="btn btn-main rounded-3 px-3 py-2 fs-13">
                          Q Pay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'pocket' && (
                <div className="pay-panel">
                  <div className="rounded-3 p-4 d-flex align-items-start gap-3" style={{ background: '#F5F0FF', border: '1.5px solid #D4BBFF' }}>
                    <img src={assetUrl('images/pocketZero.png')} alt="Pocket" className="flex-shrink-0 rounded-3" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    <div>
                      <strong className="fs-14 d-block mb-1">Pocket апп-р төлөх</strong>
                      <p className="fs-13 fc-secondary mb-2">Нийт төлөх: <strong className="fc-dark">{formatPrice(payTotal)}</strong></p>
                      <p className="fs-13 fc-secondary mb-0">Pocket апп нээж QR кодыг уншуулах эсвэл утасны дугаараар шилжүүлнэ үү.</p>
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'storepay' && (
                <div className="pay-panel">
                  <div className="rounded-3 p-4" style={{ background: '#FFF5F9', border: '1.5px solid #FFD6E8' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img src={assetUrl('images/storePay.png')} alt="StorePay" className="flex-shrink-0 rounded-3" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      <div>
                        <strong className="fs-15 d-block">StorePay</strong>
                        <span className="fs-12 fc-secondary">Одоо аваад, хожим төлөх · {formatPrice(payTotal)}</span>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      <span className="fs-13 fc-secondary">30 хоногийн дотор, 0% хүүгүй төлнө</span>
                      <span className="fs-13 fc-secondary">Нэмэлт хураамж, шимтгэл байхгүй</span>
                      <span className="fs-13 fc-secondary">StorePay апп-д урьдчилан бүртгүүлсэн байх шаардлагатай</span>
                    </div>
                    <p className="fs-12 fc-secondary mb-0">Захиалга баталгаажсаны дараа StorePay апп-р нэвтэрч баталгаажуулна уу.</p>
                  </div>
                </div>
              )}

              <button type="button" className="btn btn-main w-100 p-3 rounded-3 fw-semibold mt-3" style={{ fontSize: '15px' }}>
                Төлбөр шалгах — {formatPrice(payTotal)}
              </button>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="bg-white rounded-4 p-4 sticky-top" style={{ top: '88px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
              <h6 className="fw-bold mb-4">Захиалгын хураангуй</h6>

              <div className="d-flex flex-column gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.key} className="d-flex align-items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assetUrl(item.image)} alt="" className="rounded-3 flex-shrink-0" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <p
                        className="fs-13 fw-semibold fc-dark mb-0 lh-sm"
                        style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                      >
                        {item.name}
                      </p>
                      <span className="fs-12 fc-secondary">×{item.qty}</span>
                    </div>
                    <strong className="fs-14 flex-shrink-0">{formatPrice(item.price * item.qty)}</strong>
                  </div>
                ))}
              </div>

              <hr style={{ opacity: '.07', margin: '0 0 16px' }} />

              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="fs-13 fc-secondary">Барааны нийт</span>
                  <span className="fs-13 fc-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fs-13 fc-secondary">Хүргэлтийн төлбөр</span>
                  <span className="fs-13 fc-dark">{deliveryFee === 0 ? 'Үнэгүй' : formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between">
                    <span className="fs-13 fc-secondary">Хямдрал</span>
                    <span className="fs-13" style={{ color: '#2D9B4E' }}>
                      −{formatPrice(discount)}
                    </span>
                  </div>
                )}
              </div>

              <hr style={{ opacity: '.07', margin: '0 0 16px' }} />

              <div className="d-flex justify-content-between align-items-baseline mb-0">
                <span className="fw-bold fs-14">Нийт төлөх</span>
                <strong className="fc-dark" style={{ fontSize: '24px', letterSpacing: '-.02em' }}>
                  {formatPrice(payTotal)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
