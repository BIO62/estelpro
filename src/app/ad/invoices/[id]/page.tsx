'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, ExternalLink, Send, X } from 'lucide-react';

import {
  INVOICE_MAIL_OPTIONS,
  INVOICE_PAYMENT_METHODS,
  INVOICE_STATUS_LABELS,
  getOrderById,
  getOrderByInvoiceId,
  type AdOrderItem,
  type AdOrderPayment,
  type InvoiceStatus,
} from '@/lib/ad/orders';
import { cn, formatPrice } from '@/lib/utils';

type InvTab = 'home' | 'payment' | 'options' | 'refund' | 'notes';

type EditableItem = AdOrderItem & {
  key: number;
  saleType: 'perc' | 'curr';
  taxed: boolean;
  productId?: string;
  barcode?: string;
};

function money(n: number) {
  return `${formatPrice(n).replace('₮', '').trim()}₮`;
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcLineTotal(item: EditableItem) {
  const raw = item.price * item.qty;
  const sale = item.discountPercent ?? 0;
  if (item.saleType === 'curr') return Math.max(0, raw - sale);
  return Math.max(0, raw - (raw * sale) / 100);
}

function toEditable(items: AdOrderItem[]): EditableItem[] {
  return items.map((item, i) => ({
    ...item,
    key: i + 1,
    saleType: 'perc' as const,
    taxed: true,
    productId: item.sku,
  }));
}

export default function AdInvoicePage() {
  const params = useParams<{ id: string }>();
  const invoiceId = params.id;
  const found = getOrderByInvoiceId(invoiceId) ?? getOrderById(invoiceId);

  const [tab, setTab] = useState<InvTab>('home');
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>(() =>
    found?.paymentStatus === 'paid' ? 'paid' : 'unpaid',
  );
  const [items, setItems] = useState<EditableItem[]>(() => toEditable(found?.items ?? []));
  const [payments, setPayments] = useState<AdOrderPayment[]>(() => found?.payments ?? []);
  const [note, setNote] = useState('');
  const [mailTpl, setMailTpl] = useState('1');
  const [invoiceDate, setInvoiceDate] = useState(() => found?.date?.slice(0, 10) || '2026-08-25');
  const [dueDate, setDueDate] = useState(() => {
    const d = found?.date?.slice(0, 10) || '2026-08-25';
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return next.toISOString().slice(0, 10);
  });
  const [tax1, setTax1] = useState('0');
  const [tax2, setTax2] = useState('0');
  const [payForm, setPayForm] = useState({
    month: '08',
    day: '25',
    year: '2026',
    paymentId: '1',
    amount: '',
    fee: '0',
  });
  const [refundForm, setRefundForm] = useState({
    transactionId: found?.payments?.[0]?.id ?? '',
    refundType: '0',
    amount: '',
  });
  const [refunds, setRefunds] = useState<{ id: string; type: string; amount: number; date: string }[]>([]);
  const [savedFlash, setSavedFlash] = useState('');

  const order = found;

  const totals = useMemo(() => {
    let price = 0;
    let nuat = 0;
    let discount = 0;
    for (const item of items) {
      const raw = item.price * item.qty;
      const total = calcLineTotal(item);
      price += total;
      discount += raw - total;
      if (item.taxed) nuat += total / 11;
    }
    return { price, nuat, discount, withNuat: price };
  }, [items]);

  if (!order) {
    return (
      <div className="ad-inv-missing">
        <p>Нэхэмжлэл олдсонгүй.</p>
        <Link href="/ad/orders" className="ad-order-btn ad-order-btn--default">
          Захиалгын жагсаалт руу буцах
        </Link>
      </div>
    );
  }

  const inv = order.invoiceId || invoiceId;
  const remain =
    invoiceStatus === 'paid'
      ? 0
      : Math.max(0, (totals.withNuat || order.total) - payments.reduce((s, p) => s + p.amount, 0));

  const flash = (msg: string) => {
    setSavedFlash(msg);
    window.setTimeout(() => setSavedFlash(''), 1800);
  };

  const updateItem = (key: number, patch: Partial<EditableItem>) => {
    setItems((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const removeItem = (key: number) => {
    if (!window.confirm('Устгахдаа итгэлтэй байна уу ?')) return;
    setItems((prev) => prev.filter((row) => row.key !== key));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: (prev.at(-1)?.key ?? 0) + 1,
        sku: '',
        name: '',
        price: 0,
        qty: 1,
        discountPercent: 0,
        saleType: 'perc',
        taxed: true,
      },
    ]);
  };

  const addPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(String(payForm.amount).replace(/,/g, ''));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const id = String(1000000 + payments.length + 1);
    const method = INVOICE_PAYMENT_METHODS.find((m) => m.value === payForm.paymentId)?.label ?? 'Дансаар шилжүүлэх';
    const date = `${payForm.year}-${payForm.month.padStart(2, '0')}-${payForm.day.padStart(2, '0')}`;
    setPayments((prev) => [...prev, { id, method, date, amount }]);
    setPayForm((p) => ({ ...p, amount: '', fee: '0' }));
    setInvoiceStatus('paid');
    flash('Гүйлгээ нэмэгдлээ');
    setTab('home');
  };

  const addRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(String(refundForm.amount).replace(/,/g, ''));
    if (!Number.isFinite(amount) || amount <= 0) return;
    setRefunds((prev) => [
      ...prev,
      {
        id: String(2000000 + prev.length + 1),
        type: refundForm.refundType === '1' ? 'Бэлэн мөнгөөр буцаах' : 'Дансаар буцаах',
        amount,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setRefundForm((f) => ({ ...f, amount: '' }));
    flash('Буцаалт бүртгэгдлээ');
  };

  const tabs: { id: InvTab; label: string }[] = [
    { id: 'home', label: 'Үндсэн мэдээлэл' },
    { id: 'payment', label: 'Гүйлгээ нэмэх' },
    { id: 'options', label: 'Тохиргоо' },
    { id: 'refund', label: 'Буцаалт' },
    { id: 'notes', label: 'Тэмдэглэл' },
  ];

  return (
    <div className="ad-inv">
      <div className="ad-inv-top">
        <h1 className="ad-inv-title">Нэхэмжлэх #{inv}</h1>
        <div className="ad-inv-top-actions">
          <a
            href={`https://quotes.greensoft.mn/1336/invoice/${inv}.pdf`}
            target="_blank"
            rel="noreferrer"
            className="ad-order-btn ad-order-btn--default"
          >
            <Download className="size-3.5" />
            Татаж авах
          </a>
          <Link href={`/ad/orders/${order.id}`} className="ad-order-btn ad-order-btn--default">
            <ArrowLeft className="size-3.5" />
            Захиалгын дэлгэрэнгүй руу буцах
          </Link>
        </div>
      </div>

      {savedFlash ? <div className="ad-inv-flash">{savedFlash}</div> : null}

      <section className="ad-inv-panel">
        <div className="ad-inv-panel__body">
          <ul className="ad-inv-tabs" role="tablist">
            {tabs.map((t) => (
              <li key={t.id} className={cn(tab === t.id && 'active')}>
                <button type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="ad-inv-tab-content">
            {tab === 'home' && (
              <div className="ad-inv-home">
                <div className="ad-inv-home__left">
                  <table className="ad-inv-kv">
                    <tbody>
                      <tr className="ad-inv-kv--noborder">
                        <th>Харилцагч</th>
                        <td>
                          <a href="#" className="ad-inv-link">
                            <ExternalLink className="size-3" />
                            Харилцагчийн мэдээлэл засах
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th>Захиалгын дугаар #</th>
                        <td>
                          <Link href={`/ad/orders/${order.id}`} className="ad-inv-link">
                            {order.id}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th>Нэхэмжлэх үүссэн огноо</th>
                        <td>{invoiceDate}</td>
                      </tr>
                      <tr>
                        <th>Дуусах огноо</th>
                        <td>{dueDate}</td>
                      </tr>
                      <tr>
                        <th>Нийт дүн</th>
                        <td>{money(totals.withNuat || order.total)} </td>
                      </tr>
                      <tr>
                        <th>Үлдэгдэл</th>
                        <td>
                          <span className="ad-inv-remain">₮ {remain.toLocaleString('en-US')}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="ad-inv-home__right">
                  <div className="ad-inv-status">{INVOICE_STATUS_LABELS[invoiceStatus]}</div>
                  <div>
                    Төлбөрийн нөхцөл: <b>{order.paymentMethod}</b>
                  </div>
                  <div className="ad-inv-status-actions">
                    <button
                      type="button"
                      className={cn('ad-order-btn ad-order-btn--success', invoiceStatus === 'paid' && 'is-disabled')}
                      disabled={invoiceStatus === 'paid'}
                      onClick={() => {
                        setInvoiceStatus('paid');
                        flash('Төлөгдсөн болголоо');
                      }}
                    >
                      Төлөгдсөн болгох
                    </button>
                    <button
                      type="button"
                      className={cn('ad-order-btn ad-order-btn--default', invoiceStatus === 'cancelled' && 'is-disabled')}
                      disabled={invoiceStatus === 'cancelled'}
                      onClick={() => {
                        setInvoiceStatus('cancelled');
                        flash('Цуцлагдлаа');
                      }}
                    >
                      Цуцлах
                    </button>
                    <button
                      type="button"
                      className={cn('ad-order-btn ad-order-btn--default', invoiceStatus === 'unpaid' && 'is-disabled')}
                      disabled={invoiceStatus === 'unpaid'}
                      onClick={() => {
                        setInvoiceStatus('unpaid');
                        flash('Төлөгдөөгүй болголоо');
                      }}
                    >
                      Төлөгдөөгүй болгох
                    </button>
                  </div>
                  <form
                    className="ad-inv-mail"
                    onSubmit={(e) => {
                      e.preventDefault();
                      flash('Имэйл илгээгдлээ');
                    }}
                  >
                    <select className="ad-order-select" value={mailTpl} onChange={(e) => setMailTpl(e.target.value)}>
                      {INVOICE_MAIL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="ad-order-btn ad-order-btn--default ad-order-btn--sm">
                      Илгээх <Send className="size-3" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {tab === 'payment' && (
              <form className="ad-inv-pay-form" onSubmit={addPayment}>
                <div className="ad-inv-pay-grid">
                  <table className="ad-inv-kv">
                    <tbody>
                      <tr className="ad-inv-kv--noborder">
                        <th>Гүйлгээ хийсэн огноо</th>
                        <td className="ad-inv-date-selects">
                          <select
                            value={payForm.month}
                            onChange={(e) => setPayForm((p) => ({ ...p, month: e.target.value }))}
                          >
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          /
                          <select value={payForm.day} onChange={(e) => setPayForm((p) => ({ ...p, day: e.target.value }))}>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          /
                          <select
                            value={payForm.year}
                            onChange={(e) => setPayForm((p) => ({ ...p, year: e.target.value }))}
                          >
                            {Array.from({ length: 10 }, (_, i) => String(2022 + i)).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th>Төлбөрийн хэлбэр</th>
                        <td>
                          <select
                            className="ad-order-select ad-inv-full"
                            value={payForm.paymentId}
                            onChange={(e) => setPayForm((p) => ({ ...p, paymentId: e.target.value }))}
                          >
                            {INVOICE_PAYMENT_METHODS.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="ad-inv-kv">
                    <tbody>
                      <tr className="ad-inv-kv--noborder">
                        <th>Дүн</th>
                        <td>
                          <input
                            className="ad-order-input"
                            value={payForm.amount}
                            onChange={(e) => setPayForm((p) => ({ ...p, amount: e.target.value }))}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Шимтгэл</th>
                        <td>
                          <input
                            className="ad-order-input"
                            value={payForm.fee}
                            onChange={(e) => setPayForm((p) => ({ ...p, fee: e.target.value }))}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="ad-inv-center">
                  <button type="submit" className="ad-order-btn ad-order-btn--success ad-order-btn--lg">
                    Гүйлгээ нэмэх
                  </button>
                </div>
              </form>
            )}

            {tab === 'options' && (
              <form
                className="ad-inv-options"
                onSubmit={(e) => {
                  e.preventDefault();
                  flash('Тохиргоо хадгалагдлаа');
                }}
              >
                <div className="ad-inv-options-grid">
                  <table className="ad-inv-kv">
                    <tbody>
                      <tr>
                        <th>Нэхэмжилсэн огноо</th>
                        <td>
                          <input
                            type="date"
                            className="ad-order-input"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="ad-inv-kv">
                    <tbody>
                      <tr>
                        <th>Төлөх огноо</th>
                        <td>
                          <input
                            type="date"
                            className="ad-order-input"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>Татвар</th>
                        <td className="ad-inv-tax-row">
                          НӨАТ(%):
                          <input
                            type="number"
                            className="ad-order-input ad-inv-tax-input"
                            value={tax1}
                            onChange={(e) => setTax1(e.target.value)}
                          />
                          Бусад(%):
                          <input
                            type="number"
                            className="ad-order-input ad-inv-tax-input"
                            value={tax2}
                            onChange={(e) => setTax2(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="ad-inv-center">
                  <button type="submit" className="ad-order-btn ad-order-btn--primary">
                    Хадгалах
                  </button>
                </div>
              </form>
            )}

            {tab === 'refund' && (
              <form onSubmit={addRefund}>
                <table className="ad-inv-kv ad-inv-kv--wide">
                  <tbody>
                    <tr>
                      <th>Transaction</th>
                      <td>
                        <select
                          className="ad-order-select ad-inv-full"
                          value={refundForm.transactionId}
                          onChange={(e) => setRefundForm((f) => ({ ...f, transactionId: e.target.value }))}
                        >
                          {payments.map((p) => (
                            <option key={p.id} value={p.id}>
                              ₮ {p.amount} {p.method}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>Буцаалтын хэлбэр</th>
                      <td>
                        <select
                          className="ad-order-select ad-inv-full"
                          value={refundForm.refundType}
                          onChange={(e) => setRefundForm((f) => ({ ...f, refundType: e.target.value }))}
                        >
                          <option value="0">Дансаар буцаах</option>
                          <option value="1">Бэлэн мөнгөөр буцаах</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>Дүн</th>
                      <td>
                        <input
                          className="ad-order-input"
                          value={refundForm.amount}
                          onChange={(e) => setRefundForm((f) => ({ ...f, amount: e.target.value }))}
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <button type="submit" className="ad-order-btn ad-order-btn--success">
                          Буцаалт бүртгэх
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {tab === 'notes' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  flash('Тэмдэглэл хадгалагдлаа');
                }}
              >
                <label className="ad-inv-note-label">Тэмдэглэл</label>
                <textarea
                  className="ad-order-textarea"
                  rows={5}
                  value={note}
                  maxLength={1000}
                  onChange={(e) => setNote(e.target.value)}
                />
                <p className="ad-inv-note-hint">
                  <span className="ad-inv-note-left">{1000 - note.length}</span> тэмдэгт бичих боломжтой.
                </p>
                <div className="ad-inv-center">
                  <button type="submit" className="ad-order-btn ad-order-btn--primary" disabled={note.length > 1000}>
                    Тэмдэглал хадгалах
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="ad-inv-panel">
        <div className="ad-inv-panel__head ad-inv-panel__head--yellow">
          Нэхэмжлэхэд багтаж буй бүтээгдэхүүн/үйлчилгээ
        </div>
        <div className="ad-inv-panel__body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              flash('Бүтээгдэхүүн хадгалагдлаа');
            }}
          >
            <div className="ad-inv-products-wrap">
              <table className="ad-inv-products">
                <thead>
                  <tr>
                    <th style={{ width: 300 }}>Тайлбар</th>
                    <th style={{ width: 70 }}>Ширхэг</th>
                    <th>Нэгж</th>
                    <th style={{ width: 160 }}>Хямдрал</th>
                    <th>Нийт</th>
                    <th>(НӨАТ)</th>
                    <th className="text-center">−</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.key}>
                      <td>
                        <span className="ad-inv-row-num">{idx + 1}</span>
                        <input
                          className="ad-order-input"
                          value={item.name}
                          placeholder="Нэр эсвэл sku кодоор хайх..."
                          onChange={(e) => updateItem(item.key, { name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="ad-order-input"
                          value={item.qty}
                          onChange={(e) => updateItem(item.key, { qty: Number(e.target.value) || 0 })}
                        />
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input"
                            value={fmt(item.price)}
                            onChange={(e) =>
                              updateItem(item.key, {
                                price: Number(String(e.target.value).replace(/,/g, '')) || 0,
                              })
                            }
                          />
                          <span>₮</span>
                        </div>
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input"
                            value={(item.discountPercent ?? 0).toFixed(2)}
                            onChange={(e) =>
                              updateItem(item.key, {
                                discountPercent: Number(String(e.target.value).replace(/,/g, '')) || 0,
                              })
                            }
                          />
                          <select
                            value={item.saleType}
                            onChange={(e) =>
                              updateItem(item.key, { saleType: e.target.value as 'perc' | 'curr' })
                            }
                          >
                            <option value="perc">%</option>
                            <option value="curr">₮</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input className="ad-order-input" readOnly value={fmt(calcLineTotal(item))} />
                          <span>₮</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={item.taxed}
                          onChange={(e) => updateItem(item.key, { taxed: e.target.checked })}
                        />
                        <div className="ad-inv-tax-label">НӨАТ</div>
                      </td>
                      <td className="text-center">
                        <button type="button" className="ad-inv-rm" onClick={() => removeItem(item.key)} aria-label="Устгах">
                          <X className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>
                      <button type="button" className="ad-inv-add-row" onClick={addItem}>
                        + Бүтээгдэхүүн, ажил үйлчилгээ нэмэх
                      </button>
                    </td>
                    <td className="text-right font-bold">Нийт үнэ:</td>
                    <td colSpan={3}>{fmt(totals.price)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      НӨАТ (10%)
                    </td>
                    <td colSpan={3}>{fmt(totals.nuat)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      Хямдрал:
                    </td>
                    <td colSpan={3}>{fmt(totals.discount)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      Захиалгын дүн:
                      <br />
                      <span className="ad-inv-tiny">Хүргэлтийн төлбөр ороогүй</span>
                    </td>
                    <td colSpan={3}>{fmt(totals.withNuat || order.total)} ₮</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="ad-inv-save-row">
              <button type="submit" className="ad-order-btn ad-order-btn--success">
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="ad-inv-panel">
        <div className="ad-inv-panel__head ad-inv-panel__head--yellow">Нэхэмжлэлтэй холбоотой гүйлгээнүүд</div>
        <div className="ad-inv-panel__body">
          <table className="ad-inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Төлбөрийн нөхцөл</th>
                <th>Дүн</th>
                <th>Fee</th>
                <th>Огноо</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6}>Гүйлгээ байхгүй</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <a href="#" className="ad-inv-link">
                        {p.id}
                      </a>
                    </td>
                    <td>{p.method}</td>
                    <td>{p.amount.toLocaleString('en-US')}</td>
                    <td>0</td>
                    <td>{p.date}</td>
                    <td>
                      <button
                        type="button"
                        className="ad-order-btn ad-order-btn--danger ad-order-btn--xs"
                        onClick={() => {
                          if (!window.confirm('Энэ гүйлгээг устгах уу? Сэргээх боломжгүй.')) return;
                          setPayments((prev) => prev.filter((x) => x.id !== p.id));
                        }}
                      >
                        −
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ad-inv-panel">
        <div className="ad-inv-panel__head">Буцаалт</div>
        <div className="ad-inv-panel__body">
          <table className="ad-inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Төрөл</th>
                <th>Дүн</th>
                <th>Огноо</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan={5}>Буцаалт байхгүй</td>
                </tr>
              ) : (
                refunds.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.type}</td>
                    <td>{r.amount.toLocaleString('en-US')}</td>
                    <td>{r.date}</td>
                    <td />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
