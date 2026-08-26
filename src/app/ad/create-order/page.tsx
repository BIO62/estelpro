'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Check, Loader2, Plus, Sparkles, User, X } from 'lucide-react';

import {
  CREATE_ORDER_CURRENCIES,
  CREATE_ORDER_PAYMENTS,
  type CatalogProduct,
} from '@/lib/ad/create-order';
import {
  AIMAGS,
  BAGS_BY_DISTRICT,
  DISTRICTS_BY_AIMAG,
} from '@/lib/ad/locations';

export type CustomerResult = {
  id: string;
  rawId: string;
  type: 'salon' | 'consumer';
  code?: string;
  name: string;
  firstname?: string;
  lastname?: string;
  contactName?: string;
  salonName?: string;
  company?: string;
  phone: string;
  email: string;
  city?: string;
  district?: string;
  address?: string;
  discountPercent?: number;
  discountTier?: string;
};

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

const FREE_DELIVERY_THRESHOLD = 100000;
const STANDARD_DELIVERY_FEE = 7000;

export default function AdCreateOrderPage() {
  const router = useRouter();

  // Customer state
  const [memberQuery, setMemberQuery] = useState('');
  const [memberOpen, setMemberOpen] = useState(false);
  const [customerHits, setCustomerHits] = useState<CustomerResult[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null);

  // Customer form fields
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

  // Delivery price & automatic 100,000₮ rule
  const [deliveryPrice, setDeliveryPrice] = useState('7000');
  const [deliveryPriceManuallyEdited, setDeliveryPriceManuallyEdited] = useState(false);

  // Rows and product suggestion
  const [rows, setRows] = useState<LineItem[]>([]);
  const [suggestKey, setSuggestKey] = useState<number | null>(null);
  const [suggestQ, setSuggestQ] = useState('');
  const [productHits, setProductHits] = useState<CatalogProduct[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // Order payment & misc
  const [paymentId, setPaymentId] = useState('1');
  const [currencyId, setCurrencyId] = useState('1');
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSms, setSendSms] = useState(false);
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState('');

  // Custom modal for new product
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [newProductKey, setNewProductKey] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    type: 'product',
    name: '',
    price: '',
    sku: '',
    tax: '1',
  });

  const nextKey = useRef(1);
  const memberBoxRef = useRef<HTMLDivElement>(null);

  const districts = DISTRICTS_BY_AIMAG[aimag] ?? [];
  const bags = BAGS_BY_DISTRICT[district] ?? [];

  // 1. Live customer search by code, name, phone, or salon name
  useEffect(() => {
    if (!memberOpen) return;
    const ctrl = new AbortController();
    setCustomerLoading(true);
    const t = window.setTimeout(() => {
      const q = memberQuery.trim();
      fetch(`/api/ad/customers?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data: { customers?: CustomerResult[] }) => {
          setCustomerHits(data.customers ?? []);
          setCustomerLoading(false);
        })
        .catch(() => {
          setCustomerHits([]);
          setCustomerLoading(false);
        });
    }, 150);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [memberOpen, memberQuery]);

  // 2. Live product search by code, SKU, or name
  useEffect(() => {
    if (suggestKey == null) {
      setProductHits([]);
      setProductLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setProductLoading(true);
    const t = window.setTimeout(() => {
      const q = suggestQ.trim();
      fetch(`/api/ad/catalog?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data: { results?: CatalogProduct[] }) => {
          setProductHits(data.results ?? []);
          setProductLoading(false);
        })
        .catch(() => {
          setProductHits([]);
          setProductLoading(false);
        });
    }, 150);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [suggestKey, suggestQ]);

  // 3. Totals calculation
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
    return { price, nuat, discount, qty };
  }, [rows]);

  // 4. Automatic delivery fee rule (Free if >= 100,000₮, 7,000₮ if < 100,000₮)
  useEffect(() => {
    if (!deliveryPriceManuallyEdited) {
      if (totals.price >= FREE_DELIVERY_THRESHOLD) {
        setDeliveryPrice('0');
      } else {
        setDeliveryPrice(String(STANDARD_DELIVERY_FEE));
      }
    }
  }, [totals.price, deliveryPriceManuallyEdited]);

  const deliveryFeeNum = Number(String(deliveryPrice).replace(/,/g, '')) || 0;
  const grandTotal = totals.price + deliveryFeeNum;

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!memberBoxRef.current?.contains(e.target as Node)) setMemberOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pickMember = (c: CustomerResult) => {
    setSelectedCustomer(c);
    setMemberQuery(
      c.type === 'salon'
        ? `[${c.code}] ${c.salonName || c.name} (${c.contactName || c.phone})`
        : `${c.lastname ? c.lastname + ' ' : ''}${c.name} (${c.phone})`,
    );
    setMemberOpen(false);
    setFirstname(c.firstname || c.contactName || c.name);
    setLastname(c.lastname || '');
    setCompany(c.company || c.salonName || '');
    setPhone(c.phone || '');
    setEmail(c.email || '');
    setContractId(c.code || '');
    if (c.address) setAddress(c.address);
    if (c.city) setAimag(c.city.includes('Улаанбаатар') ? 'Улаанбаатар хот' : c.city);
    if (c.district) setDistrict(c.district);
    if (c.type === 'salon') {
      setIsCompany(true);
      // Auto-apply salon discount to existing product rows if any
      if (c.discountPercent && c.discountPercent > 0) {
        setRows((prev) =>
          prev.map((r) => (r.sale === 0 ? { ...r, sale: c.discountPercent!, saleType: 'perc' } : r)),
        );
      }
    }
  };

  const updateRow = (key: number, patch: Partial<LineItem>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const pickProduct = (key: number, p: CatalogProduct) => {
    const defaultSale = selectedCustomer?.discountPercent ?? 0;
    updateRow(key, {
      id: p.id,
      sku: p.sku || p.id,
      name: p.title,
      price: p.price,
      taxed: p.isTax,
      stock: p.stock,
      sale: defaultSale > 0 ? defaultSale : 0,
      saleType: 'perc',
    });
    setSuggestKey(null);
    setSuggestQ('');
  };

  const addRow = () => {
    const key = nextKey.current++;
    const defaultSale = selectedCustomer?.discountPercent ?? 0;
    setRows((prev) => [
      ...prev,
      {
        ...emptyRow(key),
        sale: defaultSale > 0 ? defaultSale : 0,
      },
    ]);
  };

  const removeRow = (key: number) => {
    if (!window.confirm('Устгахдаа итгэлтэй байна уу?')) return;
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
  };

  const onDistrictChange = (v: string) => {
    setDistrict(v);
    setBag('');
  };

  const onBagChange = (v: string) => {
    setBag(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setFlash('Утасны дугаар заавал оруулна уу');
      return;
    }
    if (!address.trim()) {
      setFlash('Хүргэлтийн хаяг заавал оруулна уу');
      return;
    }
    if (rows.length === 0 || rows.every((r) => !r.name)) {
      setFlash('Бүтээгдэхүүн нэмнэ үү');
      return;
    }
    setFlash('Захиалга амжилттай хадгалагдлаа');
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
          <div className="ad-co-panel__head">Харилцагч сонгох & Мэдээлэл</div>
          <div className="ad-co-panel__body">
            <div className="ad-co-user-top">
              <div className="ad-co-field" ref={memberBoxRef}>
                <label className="flex items-center justify-between">
                  <span>Харилцагч хайж сонгох (Код, нэр, дугаараар)</span>
                  {customerLoading ? <Loader2 className="size-3.5 animate-spin text-blue-600" /> : null}
                </label>
                <div className="ad-co-suggest">
                  <input
                    className="ad-order-input"
                    value={memberQuery}
                    placeholder="Код (20002..), салон, нэр эсвэл утсаар хайх..."
                    onFocus={() => setMemberOpen(true)}
                    onChange={(e) => {
                      setMemberQuery(e.target.value);
                      setMemberOpen(true);
                      setSelectedCustomer(null);
                    }}
                  />
                  {memberOpen && (
                    <ul className="ad-co-suggest__list shadow-xl rounded-b-lg border border-slate-200 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {customerLoading && customerHits.length === 0 ? (
                        <li className="ad-co-suggest__hint flex items-center gap-2 py-3 px-4 text-slate-500">
                          <Loader2 className="size-4 animate-spin text-blue-600" />
                          Харилцагчдыг хайж байна...
                        </li>
                      ) : customerHits.length === 0 ? (
                        <li className="ad-co-suggest__hint py-3 px-4 text-slate-500">
                          {memberQuery.trim() ? 'Тохирох харилцагч олдсонгүй' : 'Код, нэр эсвэл утсаа бичиж хайна уу'}
                        </li>
                      ) : (
                        customerHits.map((m) => (
                          <li key={m.id} className="hover:bg-blue-50 transition-colors">
                            <button
                              type="button"
                              onClick={() => pickMember(m)}
                              className="w-full text-left p-3 flex items-start gap-2.5"
                            >
                              {m.type === 'salon' ? (
                                <Building2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                              ) : (
                                <User className="size-4 text-slate-600 mt-0.5 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {m.code ? (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                                      {m.code}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                                      Хувь хүн
                                    </span>
                                  )}
                                  <strong className="text-sm text-slate-900 truncate">
                                    {m.type === 'salon' ? m.salonName || m.name : m.name}
                                  </strong>
                                  {m.discountPercent ? (
                                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                      -{m.discountPercent}%
                                    </span>
                                  ) : null}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                                  <span>Утас: <strong className="text-slate-700">{m.phone || '—'}</strong></span>
                                  {m.contactName && m.type === 'salon' ? (
                                    <span>Хариуцагч: {m.contactName}</span>
                                  ) : null}
                                  {m.city ? <span>{m.city}</span> : null}
                                </div>
                              </div>
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
                  Байгууллага / Салон
                </label>
                {isCompany ? (
                  <input
                    className="ad-order-input"
                    placeholder="Байгууллагын РД / ТТД..."
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
                    <label className="flex items-center justify-between">
                      <span>
                        Хүргэлтийн үнэ <span className="ad-co-req">(* заавал)</span>
                      </span>
                      {totals.price >= FREE_DELIVERY_THRESHOLD ? (
                        <span className="text-[11px] font-bold text-emerald-600">Үнэгүй хүргэлт (100k+)</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600">Автомат: 7,000₮</span>
                      )}
                    </label>
                    <input
                      className="ad-order-input font-medium"
                      value={deliveryPrice}
                      onChange={(e) => {
                        setDeliveryPrice(e.target.value);
                        setDeliveryPriceManuallyEdited(true);
                      }}
                    />
                  </div>
                  <div className="ad-co-field">
                    <label>
                      Салон / Гэрээний код <span className="ad-co-opt">(нэмэлт)</span>
                    </label>
                    <input
                      className="ad-order-input"
                      value={contractId}
                      onChange={(e) => setContractId(e.target.value)}
                      placeholder="Жишээ: 20002"
                    />
                  </div>
                  <div className="ad-co-field">
                    <label>
                      Байгууллага / Салоны нэр <span className="ad-co-opt">(нэмэлт)</span>
                    </label>
                    <input className="ad-order-input" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="ad-co-field">
                <label>
                  Хүргэлтийн хаяг <span className="ad-co-req">(* заавал)</span>
                </label>
                <textarea
                  className="ad-order-textarea"
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Дэлгэрэнгүй хаяг, байр, орц, тоот..."
                  required
                />
                <label className="ad-co-check mt-1">
                  <input type="checkbox" checked={syncCrm} onChange={(e) => setSyncCrm(e.target.checked)} />
                  CRM-д харилцагчийн мэдээллийг шинэчлэж хадгалах
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Product Items Table */}
        <section className="ad-co-panel">
          <div className="ad-co-panel__body">
            <div className="ad-inv-products-wrap">
              <table className="ad-inv-products ad-co-products">
                <thead>
                  <tr>
                    <th style={{ width: 340 }}>Бүтээгдэхүүн (Код эсвэл нэрээр)</th>
                    <th style={{ width: 75 }}>Ширхэг</th>
                    <th>Нэгж үнэ</th>
                    <th style={{ width: 150 }}>Хөнгөлөлт</th>
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
                            placeholder="Код (SKU), эсвэл бүтээгдэхүүний нэрээр хайх..."
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
                            <span className="ad-co-stock font-medium text-slate-500">
                              Код: <strong className="text-blue-700">{row.sku || row.id}</strong> · Үлдэгдэл: <strong className="text-emerald-700">{row.stock}</strong>
                            </span>
                          ) : null}
                          {suggestKey === row.key ? (
                            <ul className="ad-co-suggest__list ad-co-suggest__list--prod shadow-xl rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                              {productLoading && productHits.length === 0 ? (
                                <li className="ad-co-suggest__hint flex items-center gap-2 py-3 px-4 text-slate-500">
                                  <Loader2 className="size-4 animate-spin text-blue-600" />
                                  Бүтээгдэхүүн хайж байна...
                                </li>
                              ) : productHits.length === 0 ? (
                                <li className="ad-co-suggest__hint py-3 px-4 text-slate-500">
                                  {suggestQ.trim() ? 'Бүтээгдэхүүн олдсонгүй' : 'Код эсвэл нэрээ бичиж хайна уу'}
                                </li>
                              ) : (
                                productHits.map((p) => (
                                  <li key={p.id} className="hover:bg-blue-50 transition-colors">
                                    <button
                                      type="button"
                                      onClick={() => pickProduct(row.key, p)}
                                      className="w-full text-left p-2.5 flex items-start justify-between gap-2"
                                    >
                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                            {p.sku || p.id}
                                          </span>
                                          <strong className="text-sm text-slate-900">{p.title}</strong>
                                        </div>
                                        <span className="text-xs text-slate-500 block mt-0.5">
                                          Үлдэгдэл: <strong className="text-slate-700">{p.stock ?? 0}</strong>
                                        </span>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <strong className="text-sm font-bold text-blue-600">{fmt(p.price)} ₮</strong>
                                      </div>
                                    </button>
                                  </li>
                                ))
                              )}
                              <li>
                                <button
                                  type="button"
                                  className="ad-co-suggest__add py-2.5 px-3 w-full text-blue-600 font-semibold hover:bg-blue-50"
                                  onClick={() => openNewProduct(row.key)}
                                >
                                  <Plus className="size-3.5" /> Шинэ бүтээгдэхүүн үүсгэж нэмэх
                                </button>
                              </li>
                            </ul>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          className="ad-order-input text-center font-medium"
                          value={row.qty}
                          onChange={(e) => updateRow(row.key, { qty: Math.max(1, Number(e.target.value) || 1) })}
                        />
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input font-medium"
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
                            className="ad-order-input font-medium"
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
                          <input className="ad-order-input font-bold text-slate-900" readOnly value={fmt(lineTotal(row))} />
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
                        + Бүтээгдэхүүн, үйлчилгээ нэмэх
                      </button>
                    </td>
                    <td className="text-right font-bold">Барааны нийт үнэ:</td>
                    <td colSpan={3} className="font-semibold">{fmt(totals.price)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      <div className="inline-flex items-center gap-1.5">
                        <span>Хүргэлтийн төлбөр:</span>
                        {deliveryFeeNum === 0 && totals.price >= FREE_DELIVERY_THRESHOLD ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✨ 100,000₮-с дээш үнэгүй
                          </span>
                        ) : totals.price > 0 && totals.price < FREE_DELIVERY_THRESHOLD ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            100k хүрээгүй (+7,000₮)
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td colSpan={3} className={`font-semibold ${deliveryFeeNum === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {deliveryFeeNum === 0 ? '0.00 ₮ (Үнэгүй)' : `${fmt(deliveryFeeNum)} ₮`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold">
                      НӨАТ (10%):
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
                    <td colSpan={3}>{totals.qty} ширхэг</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="text-right font-bold text-base text-slate-900">
                      Төлөх нийт дүн:
                    </td>
                    <td colSpan={3} className="font-extrabold text-base text-blue-700">
                      {fmt(grandTotal)} ₮
                    </td>
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
                  <label>Нэмэлт тэмдэглэл</label>
                  <textarea
                    className="ad-order-textarea"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Захиалгын нэмэлт тайлбар, санамж..."
                  />
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
              Захиалга баталгаажуулж хадгалах
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
                    <label>SKU / Код</label>
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
