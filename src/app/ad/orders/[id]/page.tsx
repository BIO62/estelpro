'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, History, ImagePlus, Printer, Send, X } from 'lucide-react';

import { AdOrderStatusModal } from '@/components/ad/ad-order-status-modal';
import {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_LABELS,
  appendOrderTimeline,
  getOrderById,
  getProgressCount,
  lineTotal,
  listOrdersByCustomer,
  patchStoredOrder,
  staffDisplayName,
  type AdOrder,
} from '@/lib/ad/orders';
import type { PublicUser } from '@/lib/auth/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const EMAIL_TEMPLATES = [
  'Шинэ захиалгын мэдээлэл',
  'Захиалга хүргэлтэнд гарсан',
  'Захиалга амжилттай',
  'Захиалга цуцлагдсан',
];

function money(n: number) {
  return `${formatPrice(n).replace('₮', '').trim()} ₮`;
}

function DetailPanel({
  title,
  right,
  children,
  headingClass,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  headingClass?: string;
}) {
  return (
    <section className="ad-od-panel">
      <div className={cn('ad-od-panel__head', headingClass)}>
        <span>{title}</span>
        {right}
      </div>
      <div className="ad-od-panel__body">{children}</div>
    </section>
  );
}

function KvTable({ rows }: { rows: { label: React.ReactNode; value: React.ReactNode }[] }) {
  return (
    <table className="ad-od-kv">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <th>{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdOrder | undefined>();
  const [ready, setReady] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [emailTpl, setEmailTpl] = useState(EMAIL_TEMPLATES[0]);
  const [note, setNote] = useState('');
  const [onSheet, setOnSheet] = useState(false);
  const [noteImage, setNoteImage] = useState<{ name: string; data: string } | null>(null);
  const [noteError, setNoteError] = useState('');
  const [clientIp, setClientIp] = useState('local');
  const [staffUser, setStaffUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    setOrder(getOrderById(params.id));
    setReady(true);
  }, [params.id]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: { user?: PublicUser | null }) => setStaffUser(data.user || null));
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d: { ip?: string }) => {
        if (d.ip) setClientIp(d.ip);
      })
      .catch(() => {});
  }, []);

  if (!ready) return null;

  if (!order) {
    return (
      <div className="ad-od-missing">
        <p>Захиалга олдсонгүй.</p>
        <Link href="/ad/orders" className="ad-order-btn ad-order-btn--default">
          Жагсаалт руу буцах
        </Link>
      </div>
    );
  }

  const isTrashed = !!order.deletedAt;
  const actor = staffDisplayName(staffUser);
  const managerName = order.manager || actor;
  const customerOrders = listOrdersByCustomer(order);
  const progress = getProgressCount(order);
  const items = order.items ?? [];
  const invoiceTotal = items.length ? items.reduce((sum, item) => sum + lineTotal(item), 0) : order.total;
  const payMethod = order.paymentMethod?.trim() || 'Дансаар шилжүүлэх';
  const payRows =
    order.payments && order.payments.length > 0
      ? order.payments
      : [{ id: '—', method: payMethod, date: order.date, amount: 0 }];
  const paid = order.payments?.reduce((sum, p) => sum + p.amount, 0) ?? (order.paymentStatus === 'paid' ? order.total : 0);

  const logAction = (text: string, extra?: { image?: string; onSheet?: boolean; kind?: 'note' | 'system' }) => {
    const next = appendOrderTimeline(order.id, text, actor, { ip: clientIp, ...extra });
    if (next) setOrder(next);
  };

  return (
    <div className={cn('ad-od', isTrashed && 'ad-od--trashed')}>
      {isTrashed ? (
        <>
          <div className="ad-od-trashed-veil" />
          <div className="ad-od-trashed-stamp">Устгагдсан захиалга</div>
        </>
      ) : null}
      <div className="ad-od-top">
        <h1 className="ad-od-title">Захиалгын дугаар # {order.id}</h1>
        <div className="ad-od-top-actions">
          <button
            type="button"
            className="ad-order-btn ad-order-btn--default"
            onClick={() => window.open(`/ad/orders/${order.id}/print`, '_blank', 'noopener,noreferrer')}
          >
            <Printer className="size-3.5" />
            Захиалга хэвлэх (Нарийн)
          </button>
          <Link href="/ad/orders" className="ad-order-btn ad-order-btn--default">
            <ArrowLeft className="size-3.5" />
            Захиалгын жагсаалт руу буцах
          </Link>
        </div>
      </div>

      <div className="ad-od-progress-wrap">
        <ul className="ad-od-progress">
          {ORDER_PROGRESS_STEPS.map((step, i) => (
            <li key={step} className={cn(i < progress && 'active')}>
              {step}
              {i === 0 ? <span>{order.date}</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="ad-od-grid">
        <div className="ad-od-main">
          <div className="ad-od-two">
            <DetailPanel title="Захиалгын ерөнхий мэдээлэл">
              <KvTable
                rows={[
                  { label: 'Захиалга хийсэн огноо', value: order.date },
                  {
                    label: 'Нэр',
                    value: (
                      <div className="ad-od-name-cell">
                        <a href="#">{order.customerName}</a>
                        <a href="#" className="ad-od-link">
                          CRM харилцагчийн профайл үзэх
                        </a>
                        <button
                          type="button"
                          className="ad-order-btn ad-order-btn--info ad-order-btn--sm"
                          onClick={() => setHistoryOpen(true)}
                        >
                          <History className="size-3" />
                          Захиалгын түүх харах
                        </button>
                      </div>
                    ),
                  },
                  { label: 'Утас', value: order.phone },
                  { label: 'И-мэйл', value: order.email || '' },
                  { label: 'Төлөв', value: ORDER_STATUS_LABELS[order.status] },
                ]}
              />
            </DetailPanel>

            <DetailPanel title="Хүргэлтийн хаягийн мэдээлэл">
              <KvTable
                rows={[
                  { label: 'Хүргэлтийн төрөл:', value: order.deliveryType || '' },
                  { label: 'Үнэ:', value: `${order.deliveryFee ? money(order.deliveryFee) : 'Үнэгүй₮'}` },
                  { label: 'Хаяг:', value: order.address || '' },
                  { label: 'Төлбөрийн нөхцөл', value: order.paymentMethod || 'Дансаар шилжүүлэх' },
                  { label: 'НӨАТ', value: order.vatType || 'хувь хүн' },
                ]}
              />
            </DetailPanel>
          </div>

          <DetailPanel
            title="Нэхэмжлэл"
            headingClass="ad-od-panel__head--navy"
            right={
              <span className={cn('ad-od-badge', order.paymentStatus === 'paid' ? 'ad-od-badge--paid' : 'ad-od-badge--unpaid')}>
                {order.paymentStatus === 'paid' ? 'Төлсөн' : 'Төлөөгүй'}
              </span>
            }
          >
            <div className="ad-od-invoice-toolbar">
              <div className="ad-od-invoice-toolbar__left">
                <button type="button" className="ad-order-btn ad-order-btn--success ad-order-btn--sm" disabled={order.paymentStatus === 'paid'}>
                  Төлөгдсөн болгох
                </button>
                <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--sm">
                  Цуцлах
                </button>
                <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--sm">
                  Төлөгдөөгүй болгох
                </button>
              </div>
              <div className="ad-od-invoice-toolbar__mail">
                <select className="ad-order-select">
                  <option>Шинэ нэхэмжлэл үүссэн тухай</option>
                  <option>Нэхэмжлэл төлөх сануулга</option>
                  <option>Төлбөр хүлээн авсан тухай</option>
                  <option>Нэхэмжлэл цуцлагдсан</option>
                </select>
                <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--sm">
                  Илгээх <Send className="size-3" />
                </button>
              </div>
              <Link
                href={`/ad/orders/${order.id}/edit`}
                className="ad-order-btn ad-order-btn--warning ad-order-btn--sm"
              >
                Нэхэмжлэх засах
              </Link>
            </div>

            <table className="ad-od-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Нэр</th>
                  <th className="text-right">Үнэ</th>
                  <th>Тоо ширхэг</th>
                  <th className="text-right">Дүн</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Бараа бүртгэгдээгүй</td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={`${item.id || item.sku}-${i}`}>
                      <td>
                        <a href="#" className="ad-od-link">
                          {item.sku}
                        </a>
                      </td>
                      <td>{item.name}</td>
                      <td className="text-right">{item.price.toLocaleString('en-US')}</td>
                      <td className="text-center">{item.qty.toFixed(2)}</td>
                      <td className="text-right">
                        {lineTotal(item).toLocaleString('en-US')}
                        {item.discountPercent ? (
                          <span className="ad-od-discount">
                            <br />
                            хямдрал {item.discountPercent.toFixed(2)}%
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
                <tr>
                  <th colSpan={3}>
                    <button type="button" className="ad-order-btn ad-order-btn--warning ad-order-btn--sm">
                      Хасалт хийх
                    </button>
                  </th>
                  <th className="text-center">Нийлбэр дүн</th>
                  <td className="text-right ad-od-sum">{money(invoiceTotal)}</td>
                </tr>
                <tr>
                  <th colSpan={3} />
                  <th className="text-center">Үлдэгдэл дүн</th>
                  <td className="text-right ad-od-remain">{money(Math.max(0, invoiceTotal - paid))}</td>
                </tr>
              </tbody>
            </table>
          </DetailPanel>

          <DetailPanel title="Төлбөр төлөлт" headingClass="ad-od-panel__head--navy">
            <table className="ad-od-table">
              <thead>
                <tr>
                  <th>Дугаар#</th>
                  <th>Төлбөрийн хэлбэр</th>
                  <th>Огноо</th>
                  <th>Дүн</th>
                </tr>
              </thead>
              <tbody>
                {payRows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <span className="ad-od-pay-label">{p.method || payMethod}</span>
                    </td>
                    <td>{p.date}</td>
                    <td className="text-right">{money(p.amount).replace(' ', '')}</td>
                  </tr>
                ))}
                <tr>
                  <td />
                  <td />
                  <td className="text-right">Нийт:</td>
                  <td className="text-right ad-od-remain">{money(paid).replace(' ', '')}</td>
                </tr>
              </tbody>
            </table>
          </DetailPanel>
        </div>

        <aside className="ad-od-side">
          <DetailPanel title="Захиалгыг удирдах">
            <div className="ad-od-manage">
              <strong>Хариуцсан менежер</strong>
              <p className="ad-od-help ">
                Энэ захиалга <strong className='text-purple-500'>{managerName}</strong> -д хувиарлагдсан байна.
              </p>

              <div className="ad-od-title-action">Төлөв өөрчилж хадгалах</div>
              <button
                type="button"
                className="ad-order-btn ad-order-btn--success ad-order-btn--block"
                onClick={() => setStatusOpen(true)}
              >
                Захиалгын статус өөрчлөх
              </button>

              <div className="ad-od-title-action">И-мэйл илгээх</div>
              <div className="ad-od-inline-send">
                <select className="ad-order-select" value={emailTpl} onChange={(e) => setEmailTpl(e.target.value)}>
                  {EMAIL_TEMPLATES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ad-order-btn ad-order-btn--default ad-order-btn--sm"
                  onClick={() =>
                    logAction(`(#${actor}) хэрэглэгч #${order.id} захиалгад "${emailTpl}" и-мэйл илгээлээ.`)
                  }
                >
                  Илгээх <Send className="size-3" />
                </button>
              </div>
            </div>
          </DetailPanel>

          <DetailPanel title="Үйлдлийн түүх">
            <div className="ad-od-feed">
            <ul className="ad-od-timeline">
              {(order.timeline ?? []).map((item, i) => (
                <li key={i}>
                  <div className={cn('ad-od-bubble', item.kind === 'note' && 'ad-od-bubble--note')}>
                    {item.text}
                    {item.image ? (
                      <a href={item.image} target="_blank" rel="noopener noreferrer" className="ad-od-bubble__img-wrap">
                        <img src={item.image} alt="" className="ad-od-bubble__img" />
                      </a>
                    ) : null}
                  </div>
                  <div className="ad-od-exact">{item.meta}</div>
                </li>
              ))}
            </ul>
            </div>
            <div className="ad-od-composer">
            <div className="ad-od-composer__title">Тэмдэгдэл нэмэх</div>
            <label className="ad-modal-check">
              <input type="checkbox" checked={onSheet} onChange={(e) => setOnSheet(e.target.checked)} /> Захиалгын хуудас
              дээр гарах тэмдэглэл
            </label>
            <textarea
                className="ad-order-textarea ad-od-composer__text"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Тэмдэглэл бичих..."
              />
              {noteImage ? (
                <div className="ad-od-upload-preview">
                  <img src={noteImage.data} alt="" />
                  <div>
                    <strong>{noteImage.name}</strong>
                    <button type="button" onClick={() => setNoteImage(null)}>
                      <X className="size-3.5" />
                      Хасах
                    </button>
                  </div>
                </div>
              ) : (
                <label className="ad-od-upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,.jpg,.jpeg,.png,.gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      if (!/^image\/(jpeg|png|gif)$/i.test(file.type)) {
                        setNoteError('JPG, PNG, GIF зөвхөн');
                        return;
                      }
                      if (file.size > 1_500_000) {
                        setNoteError('Зураг 1.5MB-аас бага байх ёстой');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        setNoteImage({ name: file.name, data: String(reader.result || '') });
                        setNoteError('');
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <ImagePlus className="size-5" />
                  <span>
                    <b>Зураг нэмэх</b>
                    <small>JPG, PNG, GIF · 1.5MB хүртэл</small>
                  </span>
                </label>
              )}
              {noteError ? <span className="ad-od-note-file__err">{noteError}</span> : null}
            <button
              type="button"
              className="ad-order-btn ad-order-btn--default ad-order-btn--block"
              onClick={() => {
                const text = note.trim();
                if (!text && !noteImage) return;
                logAction(text || 'Зураг нэмэв', {
                  kind: 'note',
                  onSheet,
                  image: noteImage?.data,
                });
                setNote('');
                setNoteImage(null);
                setOnSheet(false);
                setNoteError('');
              }}
            >
              Бичих <Send className="size-3" />
            </button>
            </div>
          </DetailPanel>

          <section className="ad-od-extra">
            <div className="ad-od-extra__head">Нэмэлт мэдээлэл</div>
            <div className="ad-od-extra__body">
              <p className="ad-modal-hint" style={{ margin: 0 }}>
                Нэмэлт мэдээлэл байхгүй.
              </p>
            </div>
          </section>
        </aside>
      </div>

      {isTrashed ? null : (
        <AdOrderStatusModal
          open={statusOpen}
          order={order}
          onClose={() => setStatusOpen(false)}
          onSave={(status) => {
            const next = patchStoredOrder(order.id, { status });
            if (next) setOrder(next);
            appendOrderTimeline(
              order.id,
              `(#${actor}) хэрэглэгч (#${order.id}) дугаартай захиалгын төлөвийг "${ORDER_STATUS_LABELS[status]}" болгож өөрчиллөө.`,
              actor,
            );
            const refreshed = getOrderById(order.id);
            if (refreshed) setOrder(refreshed);
          }}
        />
      )}

      {historyOpen ? (
        <div className="admin-scope ad-modal-overlay" onClick={() => setHistoryOpen(false)} role="presentation">
          <div className="ad-modal ad-modal--wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="ad-modal__header">
              <h4>Харилцагчийн захиалгын түүх</h4>
            </div>
            <div className="ad-modal__body">
              <table className="ad-cust-hist">
                <thead>
                  <tr>
                    <th>Захиалгын #</th>
                    <th>Огноо</th>
                    <th>Нийт дүн</th>
                    <th>Төлбөр</th>
                    <th>Төлөв</th>
                    <th>Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6}>Захиалга олдсонгүй</td>
                    </tr>
                  ) : (
                    customerOrders.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.date}</td>
                        <td>{money(o.total)}</td>
                        <td>
                          <span className={cn('ad-cust-hist__pay', o.paymentStatus === 'paid' && 'is-paid')}>
                            {o.paymentStatus === 'paid' ? 'Төлсөн' : 'Төлөөгүй'}
                          </span>
                        </td>
                        <td>{ORDER_STATUS_LABELS[o.status]}</td>
                        <td>
                          <Link href={`/ad/orders/${o.id}`} className="ad-order-btn ad-order-btn--info ad-order-btn--sm" onClick={() => setHistoryOpen(false)}>
                            Харах
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="ad-modal__footer">
              <button type="button" className="ad-order-btn ad-order-btn--default" onClick={() => setHistoryOpen(false)}>
                Хаах
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
