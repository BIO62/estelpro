'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, History, Printer, Send, Truck } from 'lucide-react';

import { AdOrderStatusModal } from '@/components/ad/ad-order-status-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MANAGERS,
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_LABELS,
  getOrderById,
  getProgressCount,
  lineTotal,
  type AdOrder,
  type OrderStatus,
} from '@/lib/ad/orders';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const EMAIL_TEMPLATES = [
  'Шинэ захиалгын мэдээлэл',
  'Захиалга хүргэлтэнд гарсан',
  'Захиалга амжилттай',
  'Захиалга цуцлагдсан',
];

const SMS_TEMPLATES = [
  (id: string) => `Sain bn uu tand #${id} dugaartai zahialga uuslee.`,
  (id: string) => `Tanii #${id} dugaartai zahialga hurgeltend garlaa.`,
  (id: string) => `Tanii #${id} dugaartai zahialga amjilttai hurgegdlee. Tand bayarlalaa.`,
  (id: string) => `Tanii #${id} dugaartai zahialga tsutslagdlaa.`,
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
  const found = getOrderById(params.id);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sideTab, setSideTab] = useState<'history' | 'sms'>('history');
  const [sms, setSms] = useState('');
  const [note, setNote] = useState('');
  const [managerLabel, setManagerLabel] = useState<string | null>(null);

  const order: AdOrder | undefined = useMemo(() => {
    if (!found) return undefined;
    return { ...found, status: status ?? found.status };
  }, [found, status]);

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

  const progress = getProgressCount(order);
  const items = order.items ?? [];
  const invoiceTotal = items.length ? items.reduce((sum, item) => sum + lineTotal(item), 0) : order.total;
  const paid = order.payments?.reduce((sum, p) => sum + p.amount, 0) ?? (order.paymentStatus === 'paid' ? order.total : 0);
  const assigned = managerLabel ?? order.manager ?? '';

  return (
    <div className="ad-od">
      <div className="ad-od-top">
        <h1 className="ad-od-title">Захиалгын дугаар # {order.id}</h1>
        <div className="ad-od-top-actions">
          <button type="button" className="ad-order-btn ad-order-btn--default" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Захиалгыг хэвлэх
          </button>
          <button type="button" className="ad-order-btn ad-order-btn--default" onClick={() => window.print()}>
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
                        <button type="button" className="ad-order-btn ad-order-btn--info ad-order-btn--sm">
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
                  { label: 'Төлбөрийн нөхцөл', value: order.paymentMethod },
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
                href={`/ad/invoices/${order.invoiceId || order.id}`}
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
                  items.map((item) => (
                    <tr key={item.sku}>
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
                {(order.payments ?? []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <span className="ad-od-pay-label">{p.method}</span>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--block">
                    Захиалгыг менежерт хувиарлах
                    <span className="ad-od-caret" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ad-order-dropdown w-64">
                  {MANAGERS.filter((m) => m.value).map((m) => (
                    <DropdownMenuItem key={m.value} onClick={() => setManagerLabel(m.label)}>
                      {m.label} -т хувиарлах
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {assigned ? (
                <p className="ad-od-help">
                  Энэ захиалга <strong>{assigned}</strong> хэрэглэгчид хувиарлагдсан байна.
                </p>
              ) : null}

              <strong>Хариуцсан хүргэлтийн ажилтан</strong>
              <button type="button" className="ad-order-btn ad-order-btn--info ad-order-btn--block">
                <Truck className="size-3.5" />
                Хүргэлтийн ажилтанд хувиарлах
              </button>

              <div className="ad-od-title-action">Төлөв өөрчилж хадгалах</div>
              <button type="button" className="ad-order-btn ad-order-btn--success ad-order-btn--block" onClick={() => setStatusOpen(true)}>
                Захиалгын статус өөрчлөх
              </button>

              <div className="ad-od-title-action">N-мэйл илгээх</div>
              <div className="ad-od-inline-send">
                <select className="ad-order-select">
                  {EMAIL_TEMPLATES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--sm">
                  Илгээх <Send className="size-3" />
                </button>
              </div>
            </div>
          </DetailPanel>

          <div className="ad-od-tabs">
            <div className="ad-od-tabs__list">
              <button
                type="button"
                className={cn('ad-od-tabs__tab', sideTab === 'history' && 'ad-od-tabs__tab--active')}
                onClick={() => setSideTab('history')}
              >
                Үйлдлийн түүх
              </button>
              <button
                type="button"
                className={cn('ad-od-tabs__tab', sideTab === 'sms' && 'ad-od-tabs__tab--active')}
                onClick={() => setSideTab('sms')}
              >
                SMS илгээх
              </button>
            </div>
            {sideTab === 'history' ? (
              <div className="ad-od-tabs__panel">
                <ul className="ad-od-timeline">
                  {(order.timeline ?? []).map((item, i) => (
                    <li key={i}>
                      <div className="ad-od-bubble">{item.text}</div>
                      <div className="ad-od-exact">{item.meta}</div>
                    </li>
                  ))}
                </ul>
                <div className="ad-od-title-action">Тэмдэгдэл нэмэх</div>
                <label className="ad-modal-check">
                  <input type="checkbox" /> Захиалгын хуудас дээр гарах тэмдэглэл
                </label>
                <textarea className="ad-order-textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--block">
                  Бичих <Send className="size-3" />
                </button>
              </div>
            ) : (
              <div className="ad-od-tabs__panel">
                <div className="ad-od-title-action">SMS илгээх</div>
                <textarea className="ad-order-textarea" rows={3} value={sms} onChange={(e) => setSms(e.target.value)} />
                <p className="ad-modal-hint">160 тэмдэгт байх ёстой</p>
                <button type="button" className="ad-order-btn ad-order-btn--success ad-order-btn--block">
                  Илгээх
                </button>
                <div className="ad-od-sms-list">
                  {SMS_TEMPLATES.map((tpl, i) => (
                    <button key={i} type="button" className="ad-od-sms-tpl" onClick={() => setSms(tpl(order.id))}>
                      {tpl(order.id)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      <AdOrderStatusModal
        open={statusOpen}
        order={order}
        onClose={() => setStatusOpen(false)}
        onSave={setStatus}
      />
    </div>
  );
}
