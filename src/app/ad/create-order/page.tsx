'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';

import {
  CREATE_ORDER_CURRENCIES,
  CREATE_ORDER_PAYMENTS,
  searchMembers,
  type CatalogProduct,
  type DemoMember,
} from '@/lib/ad/create-order';
import {
  AIMAGS,
  BAGS_BY_DISTRICT,
  DISTRICTS_BY_AIMAG,
  getDeliveryPrice,
} from '@/lib/ad/locations';

type LineItem = {
  key: number;
  id: string;
  sku: string;
  name: string;
  qty: number;
  price: number;
  sale: number;
  saleType: 'perc' | 'curr';
  taxed: boolean;
  stock?: number;
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function lineTotal(row: LineItem) {
  const raw = row.price * row.qty;
  if (row.saleType === 'curr') return Math.max(0, raw - row.sale);
  return Math.max(0, raw - (raw * row.sale) / 100);
}

function emptyRow(key: number): LineItem {
  return {
    key,
    id: '',
    sku: '',
    name: '',
    qty: 1,
    price: 0,
    sale: 0,
    saleType: 'perc',
    taxed: true,
  };
}

export default function AdCreateOrderPage() {
  const router = useRouter();
  const [memberQuery, setMemberQuery] = useState('');
  const [memberOpen, setMemberOpen] = useState(false);
  const [member, setMember] = useState<DemoMember | null>(null);
  const [isCompany, setIsCompany] = useState(false);
  const [companyRd, setCompanyRd] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [company, setCompany] = useState('');
  const [contractId, setContractId] = useState('');
  const [address, setAddress] = useState('');
  const [syncCrm, setSyncCrm] = useState(true);
  const [aimag, setAimag] = useState('Улаанбаатар хот');
  const [district, setDistrict] = useState('');
  const [bag, setBag] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState('');
  const [rows, setRows] = useState<LineItem[]>([]);
  const [suggestKey, setSuggestKey] = useState<number | null>(null);
  const [suggestQ, setSuggestQ] = useState('');
  const [paymentId, setPaymentId] = useState('1');
  const [currencyId, setCurrencyId] = useState('1');
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSms, setSendSms] = useState(false);
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState('');
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [newProductKey, setNewProductKey] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    type: 'product',
    name: '',
    price: '',
    sku: '',
    tax: '1',
  });
  const [productHits, setProductHits] = useState<CatalogProduct[]>([]);
  const nextKey = useRef(1);
  const memberBoxRef = useRef<HTMLDivElement>(null);

  const districts = DISTRICTS_BY_AIMAG[aimag] ?? [];
  const bags = BAGS_BY_DISTRICT[district] ?? [];
  const memberHits = searchMembers(memberQuery);

  useEffect(() => {
    if (suggestKey == null) {
      setProductHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      const q = suggestQ.trim();
      fetch(`/api/ad/catalog?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data: { results?: CatalogProduct[] }) => setProductHits(data.results ?? []))
        .catch(() => setProductHits([]));
    }, 200);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [suggestKey, suggestQ]);

  const totals = useMemo(() => {
    let price = 0;
    let nuat = 0;
    let discount = 0;
    let qty = 0;
    for (const row of rows) {
      const raw = row.price * row.qty;
      const total = lineTotal(row);
      price += total;
      discount += raw - total;
      qty += row.qty;
      if (row.taxed) nuat += total / 11;
    }
    return { price, nuat, discount, qty, withNuat: price };
  }, [rows]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!memberBoxRef.current?.contains(e.target as Node)) setMemberOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pickMember = (m: DemoMember) => {
    setMember(m);
    setMemberQuery(`${m.lastname} ${m.firstname}`.trim() || m.company || m.phone);
    setMemberOpen(false);
    setFirstname(m.firstname);
    setLastname(m.lastname);
    setCompany(m.company);
    setPhone(m.phone);
    setEmail(m.email);
    setAddress(m.address_1);
  };

  const updateRow = (key: number, patch: Partial<LineItem>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const pickProduct = (key: number, p: CatalogProduct) => {
    updateRow(key, {
      id: p.id,
      sku: p.sku,
      name: p.title,
      price: p.price,
      taxed: p.isTax,
      stock: p.stock,
    });
    setSuggestKey(null);
    setSuggestQ('');
  };

  const addRow = () => {
    const key = nextKey.current++;
    setRows((prev) => [...prev, emptyRow(key)]);
  };

  const removeRow = (key: number) => {
    if (!window.confirm('Устгахдаа итгэлтэй байна уу ?')) return;
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  const openNewProduct = (key: number) => {
    const row = rows.find((r) => r.key === key);
    setNewProductKey(key);
    setNewProduct({
      type: 'product',
      name: row?.name || suggestQ,
      price: '',
      sku: '',
      tax: '1',
    });
    setSuggestKey(null);
    setNewProductOpen(true);
  };

  const saveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductKey == null) return;
    const price = Number(String(newProduct.price).replace(/,/g, '')) || 0;
    const id = `local-${Date.now()}`;
    pickProduct(newProductKey, {
      id,
      sku: newProduct.sku || id,
      title: newProduct.name,
      price,
      isTax: newProduct.tax === '1',
      stock: 0,
    });
    setNewProductOpen(false);
    setFlash('Бүтээгдэхүүн нэмэгдлээ');
    window.setTimeout(() => setFlash(''), 1600);
  };

  const onAimagChange = (v: string) => {
    setAimag(v);
    setDistrict('');
    setBag('');
    setDeliveryPrice('');
  };

  const onDistrictChange = (v: string) => {
    setDistrict(v);
    setBag('');
    setDeliveryPrice('');
  };

  const onBagChange = (v: string) => {
    setBag(v);
    setDeliveryPrice(String(getDeliveryPrice(district, v)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setFlash('Утас заавал');
      return;
    }
    if (!address.trim()) {
      setFlash('Хаяг заавал');
      return;
    }
    if (rows.length === 0 || rows.every((r) => !r.name)) {
      setFlash('Бүтээгдэхүүн нэмнэ үү');
      return;
    }
    setFlash('Захиалга хадгалагдлаа');
    window.setTimeout(() => router.push('/ad/orders'), 900);
  };

  return (
    <div className="ad-co">
      <div className="ad-co-top">
        <h1 className="ad-co-title">Шинэ захиалга үүсгэх</h1>
        <Link href="/ad/orders" className="ad-order-btn ad-order-btn--default">
          <ArrowLeft className="size-3.5" />
          Захиалгын жагсаалт руу буцах
        </Link>
      </div>

      {flash ? <div className="ad-co-flash">{flash}</div> : null}

      <form onSubmit={handleSubmit}>
        <section className="ad-co-panel">
          <div className="ad-co-panel__head">Хэрэглэгч сонгох</div>
          <div className="ad-co-panel__body">
            <div className="ad-co-user-top">
              <div className="ad-co-field" ref={memberBoxRef}>
                <label>Харилцагч сонгох</label>
                <div className="ad-co-suggest">
                  <input
                    className="ad-order-input"
                    value={memberQuery}
                    placeholder="Харилцагч сонгох"
                    onFocus={() => setMemberOpen(true)}
                    onChange={(e) => {
                      setMemberQuery(e.target.value);
                      setMemberOpen(true);
                      setMember(null);
                    }}
                  />
                  {memberOpen && (
                    <ul className="ad-co-suggest__list">
                      {memberQuery.trim().length < 3 ? (
                        <li className="ad-co-suggest__hint">Хамгийн багадаа 3 үсэг шаардлагатай</li>
                      ) : memberHits.length === 0 ? (
                        <li className="ad-co-suggest__hint">Олдсонгүй</li>
                      ) : (
                        memberHits.map((m) => (
                          <li key={m.id}>
                            <button type="button" onClick={() => pickMember(m)}>
                              <strong>
                                {m.lastname} {m.firstname}
                              </strong>
                              {m.company ? ` · ${m.company}` : ''}
                              <span>{m.phone}</span>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="ad-co-tax-type">
                <label className="ad-co-radio">
                  <input
                    type="radio"
                    name="is_tax"
                    checked={!isCompany}
                    onChange={() => setIsCompany(false)}
                  />
                  Хувь хүн
                </label>
                <label className="ad-co-radio">
                  <input
                    type="radio"
                    name="is_tax"
                    checked={isCompany}
                    onChange={() => setIsCompany(true)}
                  />
                  Байгууллага
                </label>
                {isCompany ? (
                  <input
                    className="ad-order-input"
                    placeholder="Компанийн РД..."
                    value={companyRd}
                    onChange={(e) => setCompanyRd(e.target.value)}
                  />
                ) : null}
              </div>
            </div>

            <hr className="ad-co-hr" />

            <div className="ad-co-grid-4">
              <div className="ad-co-field">
                <label>
                  Утас <span className="ad-co-req">(* заавал)</span>
                </label>
                <input className="ad-order-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="ad-co-field">
                <label>
                  И-Мэйл <span className="ad-co-opt">(нэмэлт)</span>
                </label>
                <input className="ad-order-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="ad-co-field">
                <label>
                  Нэр <span className="ad-co-opt">(нэмэлт)</span>
                </label>
                <input className="ad-order-input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
              </div>
              <div className="ad-co-field">
                <label>
                  Овог <span className="ad-co-opt">(нэмэлт)</span>
                </label>
                <input className="ad-order-input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
              </div>
            </div>

            <div className="ad-co-addr-row">
              <div className="ad-co-addr-left">
                <div className="ad-co-loc-grid">
                  <select className="ad-order-select" value={aimag} onChange={(e) => onAimagChange(e.target.value)}>
                    <option value="">Аймаг, хот сонгох</option>
                    {AIMAGS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <select
                    className="ad-order-select"
                    value={district}
                    onChange={(e) => onDistrictChange(e.target.value)}
                  >
                    <option value="">Сум, дүүрэг сонгох</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select className="ad-order-select" value={bag} onChange={(e) => onBagChange(e.target.value)}>
                    <option value="">Баг, хороо сонгох</option>
                    {bags.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ad-co-grid-3">
                  <div className="ad-co-field">
                    <label>
                      Хүргэлтийн үнэ <span className="ad-co-req">(* заавал)</span>
                    </label>
                    <input
                      className="ad-order-input"
                      value={deliveryPrice}
                      onChange={(e) => setDeliveryPrice(e.target.value)}
                    />
                  </div>
                  <div className="ad-co-field">
                    <label>
                      Гэрээний дугаар <span className="ad-co-opt">(нэмэлт)</span>
                    </label>
                    <input
                      className="ad-order-input"
                      value={contractId}
                      onChange={(e) => setContractId(e.target.value)}
                    />
                  </div>
                  <div className="ad-co-field">
                    <label>
                      Байгууллагын нэр <span className="ad-co-opt">(нэмэлт)</span>
                    </label>
                    <input className="ad-order-input" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="ad-co-field">
                <label>
                  Хаяг <span className="ad-co-req">(* заавал)</span>
                </label>
                <textarea
                  className="ad-order-textarea"
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <label className="ad-co-check">
                  <input type="checkbox" checked={syncCrm} onChange={(e) => setSyncCrm(e.target.checked)} />
                  CRM-д харилцагчийн мэдээллийг шинэчлэж хуулах
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="ad-co-panel">
          <div className="ad-co-panel__body">
            <div className="ad-inv-products-wrap">
              <table className="ad-inv-products ad-co-products">
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
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td>
                        <div className="ad-co-prod-cell">
                          <input
                            className="ad-order-input"
                            value={row.name}
                            placeholder="Нэр эсвэл sku кодоор хайх..."
                            onFocus={() => {
                              setSuggestKey(row.key);
                              setSuggestQ(row.name);
                            }}
                            onChange={(e) => {
                              updateRow(row.key, { name: e.target.value, id: '' });
                              setSuggestKey(row.key);
                              setSuggestQ(e.target.value);
                            }}
                          />
                          {row.stock != null && row.id ? (
                            <span className="ad-co-stock">нийт үлдэгдэл: {row.stock}</span>
                          ) : null}
                          {suggestKey === row.key ? (
                            <ul className="ad-co-suggest__list ad-co-suggest__list--prod">
                              {productHits.map((p) => (
                                <li key={p.id}>
                                  <button type="button" onClick={() => pickProduct(row.key, p)}>
                                    {p.title}
                                    <span>үнэ: {fmt(p.price)}</span>
                                  </button>
                                </li>
                              ))}
                              <li>
                                <button type="button" className="ad-co-suggest__add" onClick={() => openNewProduct(row.key)}>
                                  <Plus className="size-3.5" /> Шинээр нэмэх
                                </button>
                              </li>
                            </ul>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <input
                          className="ad-order-input"
                          value={row.qty}
                          onChange={(e) => updateRow(row.key, { qty: Number(e.target.value) || 0 })}
                        />
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input"
                            value={fmt(row.price)}
                            onChange={(e) =>
                              updateRow(row.key, {
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
                            value={row.sale.toFixed(2)}
                            onChange={(e) =>
                              updateRow(row.key, {
                                sale: Number(String(e.target.value).replace(/,/g, '')) || 0,
                              })
                            }
                          />
                          <select
                            value={row.saleType}
                            onChange={(e) => updateRow(row.key, { saleType: e.target.value as 'perc' | 'curr' })}
                          >
                            <option value="perc">%</option>
                            <option value="curr">₮</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input className="ad-order-input" readOnly value={fmt(lineTotal(row))} />
                          <span>₮</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={row.taxed}
                          onChange={(e) => updateRow(row.key, { taxed: e.target.checked })}
                        />
                        <div className="ad-inv-tax-label">НӨАТ</div>
                      </td>
                      <td className="text-center">
                        <button type="button" className="ad-inv-rm" onClick={() => removeRow(row.key)} aria-label="Устгах">
                          <X className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>
                      <button type="button" className="ad-inv-add-row" onClick={addRow}>
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
                      Тоо ширхэг:
                    </td>
                    <td colSpan={3}>{fmt(totals.qty)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      Нийт дүн:
                    </td>
                    <td colSpan={3}>{fmt(totals.withNuat)} ₮</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="ad-co-bottom">
              <div>
                <label className="ad-co-check">
                  <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                  Захиалгын и-мэйл илгээх
                </label>
                <label className="ad-co-check">
                  <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                  Захиалгын SMS илгээх
                </label>
                <div className="ad-co-field" style={{ marginTop: '0.5rem' }}>
                  <label>Нэмэлт мэдээлэл</label>
                  <textarea className="ad-order-textarea" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
              <div className="ad-co-pay-grid">
                <div className="ad-co-field">
                  <label>Төлбөрийн хэлбэр</label>
                  <select className="ad-order-select" value={paymentId} onChange={(e) => setPaymentId(e.target.value)}>
                    {CREATE_ORDER_PAYMENTS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-co-field">
                  <label>Төлбөрийн нэгж</label>
                  <select
                    className="ad-order-select"
                    value={currencyId}
                    onChange={(e) => setCurrencyId(e.target.value)}
                  >
                    {CREATE_ORDER_CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="ad-order-btn ad-order-btn--success ad-co-submit">
              Хадгалах
            </button>
          </div>
        </section>
      </form>

      {newProductOpen ? (
        <div className="admin-scope ad-modal-overlay" onClick={() => setNewProductOpen(false)} role="presentation">
          <div className="ad-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="ad-modal__header">
              <h4>Шинэ бүтээгдэхүүн нэмэх</h4>
              <button type="button" className="ad-modal__close" onClick={() => setNewProductOpen(false)} aria-label="Хаах">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={saveNewProduct}>
              <div className="ad-modal__body">
                <div className="ad-co-tax-type">
                  <label className="ad-co-radio">
                    <input
                      type="radio"
                      checked={newProduct.type === 'product'}
                      onChange={() => setNewProduct((p) => ({ ...p, type: 'product' }))}
                    />
                    Бараа
                  </label>
                  <label className="ad-co-radio">
                    <input
                      type="radio"
                      checked={newProduct.type === 'service'}
                      onChange={() => setNewProduct((p) => ({ ...p, type: 'service' }))}
                    />
                    Үйлчилгээ
                  </label>
                </div>
                <div className="ad-co-field">
                  <label>Гарчиг</label>
                  <input
                    className="ad-order-input"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Бүтээгдэхүүн нэр"
                  />
                </div>
                <div className="ad-co-grid-2">
                  <div className="ad-co-field">
                    <label>Үнэ</label>
                    <input
                      className="ad-order-input"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                      placeholder="Бүтээгдэхүүн үнэ"
                    />
                  </div>
                  <div className="ad-co-field">
                    <label>SKU</label>
                    <input
                      className="ad-order-input"
                      required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct((p) => ({ ...p, sku: e.target.value }))}
                      placeholder="Бүтээгдэхүүн SKU"
                    />
                  </div>
                </div>
                <div className="ad-co-tax-type">
                  <label className="ad-co-radio">
                    <input
                      type="radio"
                      checked={newProduct.tax === '1'}
                      onChange={() => setNewProduct((p) => ({ ...p, tax: '1' }))}
                    />
                    НӨАТ орсон
                  </label>
                  <label className="ad-co-radio">
                    <input
                      type="radio"
                      checked={newProduct.tax === '0'}
                      onChange={() => setNewProduct((p) => ({ ...p, tax: '0' }))}
                    />
                    НӨАТ ороогүй
                  </label>
                </div>
              </div>
              <div className="ad-modal__footer">
                <button type="button" className="ad-order-btn ad-order-btn--default" onClick={() => setNewProductOpen(false)}>
                  Болих
                </button>
                <button type="submit" className="ad-order-btn ad-order-btn--success">
                  Хадгалах
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
