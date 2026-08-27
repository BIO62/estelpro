'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Printer } from 'lucide-react';

import { getOrderById, lineTotal, type AdOrder } from '@/lib/ad/orders';

function money(n: number) {
  return n.toLocaleString('en-US');
}

export default function AdOrderPrintPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdOrder | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getOrderById(params.id).then((row) => {
      setOrder(row);
      setReady(true);
    });
  }, [params.id]);

  if (!ready) return null;

  if (!order) {
    return (
      <div className="ad-print-page">
        <p>Захиалга олдсонгүй.</p>
      </div>
    );
  }

  const items = order.items ?? [];
  const subtotal = items.length ? items.reduce((sum, item) => sum + lineTotal(item), 0) : order.total;
  const nuat = Math.round(subtotal / 11);
  const vatLabel = order.vatType || 'Хувь хүн';
  const deliveryPrice =
    !order.deliveryFee || order.deliveryFee <= 0 ? 'Үнэгүй' : `${money(order.deliveryFee)} ₮`;

  return (
    <div className="ad-print-page">
      <div className="ad-print-sheet">
        <div className="ad-print-head">
          <div className="ad-print-brand">ESTEL</div>
          <div className="ad-print-meta">
            <div>
              Захиалгын <b>#{order.id}</b>
            </div>
            <div>Огноо: {order.date}</div>
          </div>
        </div>

        <div className="ad-print-info">
          <div className="ad-print-info__col">
            <div className="ad-print-block">
              <b>Харилцагч:</b>
              <div>
                Нэр: {order.customerName}
                {order.email ? `, Имэйл: ${order.email}` : ', Имэйл:'}
              </div>
              <div>Утас: {order.phone}</div>
            </div>
            <div className="ad-print-block">
              <b>Хүргэлт:</b>
              <div>Хаяг: {order.address || ''}</div>
            </div>
          </div>
          <div className="ad-print-info__col ad-print-info__col--right">
            <div>
              Төлөх хэлбэр: <b>{order.paymentMethod || 'Дансаар шилжүүлэх'}</b>
            </div>
            <div>
              НӨАТ: <b>{vatLabel}</b>
            </div>
            <div>
              Төрөл: {order.deliveryType || ''}
            </div>
            <div>Үнэ: {deliveryPrice}</div>
          </div>
        </div>

        <table className="ad-print-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Нэр</th>
              <th className="text-right">Үнэ</th>
              <th className="text-center">Тоо</th>
              <th className="text-right">Дүн</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5}>Бараа бүртгэгдээгүй</td>
              </tr>
            ) : (
              items.map((item) => {
                const pid = item.id || item.sku;
                const total = lineTotal(item);
                return (
                  <tr key={`${pid}-${item.name}`}>
                    <td>{pid}</td>
                    <td>
                      <div>{item.name}</div>
                      <div className="ad-print-sku">sku: {item.sku || ''}</div>
                      <div className="ad-print-sku">ERP ID:</div>
                      <a className="ad-print-view" href={pid ? `/products/${pid}` : '#'}>
                        Бүтээгдэхүүн үзэх
                      </a>
                    </td>
                    <td className="text-right">
                      {money(item.price)}
                      {item.discountPercent ? (
                        <div className="ad-print-disc">
                          {money(item.price)} ({item.discountPercent}%)
                        </div>
                      ) : null}
                    </td>
                    <td className="text-center">{item.qty.toFixed(2)}</td>
                    <td className="text-right">{money(total)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="ad-print-totals">
          <div>
            <span>Нийлбэр дүн</span>
            <b>{money(subtotal)} ₮</b>
          </div>
          <div>
            <span>НӨАТ</span>
            <b>{money(nuat)} ₮</b>
          </div>
          <div className="ad-print-totals__pay">
            <span>Төлөх дүн</span>
            <b>{money(subtotal)} ₮</b>
          </div>
        </div>

        {order.note ? <p className="ad-print-note">{order.note}</p> : null}

        <div className="ad-print-sign">
          <div className="ad-print-sign__title">Нэмэлт мэдээлэл:</div>
          <div className="ad-print-sign__row">
            Хүлээлгэж өгсөн: <span />
          </div>
          <div className="ad-print-sign__row">
            Хүлээн авсан: <span />
          </div>
        </div>

        <div className="ad-print-actions">
          <button type="button" className="ad-print-btn" onClick={() => window.print()}>
            <Printer className="size-4" />
            Хэвлэх
          </button>
        </div>
      </div>
    </div>
  );
}
