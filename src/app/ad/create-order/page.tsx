'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, X } from 'lucide-react';

import {
  CREATE_ORDER_PAYMENTS,
  type CatalogProduct,
} from '@/lib/ad/create-order';
import {
  appendOrderTimeline,
  formatOrderDate,
  getOrderById,
  patchStoredOrder,
  saveStoredOrder,
  staffDisplayName,
  type AdOrder,
} from '@/lib/ad/orders';
import {
  AIMAGS,
  BAGS_BY_DISTRICT,
  DISTRICTS_BY_AIMAG,
} from '@/lib/ad/locations';
import { tierBadgeLabel } from '@/lib/auth/salon-discount';
import type { PublicUser } from '@/lib/auth/types';

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
  qty: number | '';
  price: number | '';
  sale: number | '';
  saleType: 'perc' | 'curr';
  taxed: boolean;
  stock?: number;
};

function num(v: number | '' | undefined) {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function lineTotal(row: LineItem) {
  const raw = num(row.price) * num(row.qty);
  const sale = num(row.sale);
  if (row.saleType === 'curr') return Math.max(0, raw - sale);
  return Math.max(0, raw - (raw * sale) / 100);
}

function parseDecimalInput(raw: string): number | '' | null {
  const v = raw.replace(/,/g, '').trim();
  if (v === '' || v === '.') return '';
  if (!/^\d*\.?\d*$/.test(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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

function customerInputLabel(c: CustomerResult) {
  if (c.type === 'salon') {
    const name = (c.salonName || c.name).trim();
    return c.code ? `[${c.code}] ${name}` : name;
  }
  return [c.lastname, c.name].filter(Boolean).join(' ').trim() || c.name;
}

export function AdOrderCompose({ editId }: { editId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(editId);

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
  const [editingCell, setEditingCell] = useState<{ key: number; field: 'price' | 'sale' } | null>(null);

  // Order payment & misc
  const [paymentId, setPaymentId] = useState('1');
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState('');
  const [staffUser, setStaffUser] = useState<PublicUser | null>(null);
  const [hydrated, setHydrated] = useState(!editId);

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

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: { user?: PublicUser | null }) => setStaffUser(data.user || null));
  }, []);

  useEffect(() => {
    if (!editId) return;
    void getOrderById(editId).then((order) => {
      if (!order) {
        setHydrated(true);
        return;
      }
      setMemberQuery(order.customerName);
      setPhone(order.phone || '');
      setEmail(order.email || '');
      setFirstname(order.firstName || '');
      setLastname(order.lastName || '');
      setAddress(order.address || '');
      setNote(order.note || '');
      setDeliveryPrice(String(order.deliveryFee ?? 0));
      setDeliveryPriceManuallyEdited(true);
      setIsCompany((order.vatType || '').toLowerCase().includes('байгууллага'));
      const pay = CREATE_ORDER_PAYMENTS.find((p) => p.label === order.paymentMethod);
      setPaymentId(pay?.value || '1');
      const loaded = (order.items ?? []).map((item, i) => ({
        key: i + 1,
        id: item.id || item.sku || '',
        sku: item.sku,
        name: item.name,
        qty: item.qty,
        price: item.price,
        sale: item.discountPercent ?? 0,
        saleType: 'perc' as const,
        taxed: true,
      }));
      setRows(loaded);
      nextKey.current = loaded.length + 1;
      setHydrated(true);
    });
  }, [editId]);

  // 1. Live customer search by code, name, phone, or salon name
  useEffect(() => {
    if (!memberOpen) return;
    const ctrl = new AbortController();
    setCustomerLoading(true);
    const t = window.setTimeout(() => {
      const q = (selectedCustomer?.code || memberQuery.trim());
      fetch(`/api/ad/customers?kind=salon&q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
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
  }, [memberOpen, memberQuery, selectedCustomer]);

  // 2. Live product search by code, SKU, or name
  useEffect(() => {
    if (suggestKey == null) {
      setProductHits([]);
      setProductLoading(false);
      return;
    }
    const q = suggestQ.trim();
    if (q.length < 1) {
      setProductHits([]);
      setProductLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setProductLoading(true);
    const t = window.setTimeout(() => {
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
      const raw = num(row.price) * num(row.qty);
      const total = lineTotal(row);
      price += total;
      discount += raw - total;
      qty += num(row.qty);
      if (row.taxed) nuat += total / 11;
    }
    return { price, nuat, discount, qty };
  }, [rows]);

  // 4. Automatic delivery fee rule (Free if >= 100,000₮, 7,000₮ if < 100,000₮)
  useEffect(() => {
    if (!hydrated) return;
    if (!deliveryPriceManuallyEdited) {
      if (totals.price >= FREE_DELIVERY_THRESHOLD) {
        setDeliveryPrice('0');
      } else {
        setDeliveryPrice(String(STANDARD_DELIVERY_FEE));
      }
    }
  }, [totals.price, deliveryPriceManuallyEdited, hydrated]);

  const deliveryFeeNum = Number(String(deliveryPrice).replace(/,/g, '')) || 0;
  const grandTotal = totals.price + deliveryFeeNum;

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!memberBoxRef.current?.contains(t)) setMemberOpen(false);
      if (!(t instanceof Element) || !t.closest('.ad-co-prod-cell')) setSuggestKey(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pickMember = (c: CustomerResult) => {
    setSelectedCustomer(c);
    setMemberQuery(customerInputLabel(c));
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    const paymentLabel =
      CREATE_ORDER_PAYMENTS.find((p) => p.value === (paymentId || '1'))?.label || 'Дансаар шилжүүлэх';
    const fullAddress = [aimag, district, bag, address].filter(Boolean).join(', ');
    const displayName = [lastname, firstname].filter(Boolean).join(' ') || company || phone;
    const items = rows
      .filter((r) => r.name)
      .map((r) => ({
        id: r.id,
        sku: r.sku || r.id,
        name: r.name,
        price: num(r.price),
        qty: Math.max(1, num(r.qty)),
        discountPercent: r.saleType === 'perc' ? num(r.sale) : undefined,
      }));

    const actor = staffDisplayName(staffUser);

    if (isEdit && editId) {
      const existing = await getOrderById(editId);
      if (!existing) {
        setFlash('Захиалга олдсонгүй');
        return;
      }
      await patchStoredOrder(existing.id, {
        customerName: company ? `${displayName} ${company}`.trim() : displayName,
        lastName: lastname,
        firstName: firstname,
        email,
        phone,
        paymentMethod: paymentLabel,
        address: fullAddress,
        deliveryFee: deliveryFeeNum,
        vatType: isCompany ? 'байгууллага' : 'Хувь хүн',
        total: grandTotal,
        note: note.trim(),
        items,
      });
      await appendOrderTimeline(
        existing.id,
        `(#${actor}) хэрэглэгч #${existing.id} захиалгын барааг шинэчиллээ.`,
        actor,
        { kind: 'system' },
      );
      setFlash(`Захиалга #${existing.id} хадгалагдлаа`);
      window.setTimeout(() => router.push(`/ad/orders/${existing.id}`), 600);
      return;
    }

    const date = formatOrderDate();
    const created = await saveStoredOrder({
      customerName: company ? `${displayName} ${company}`.trim() : displayName,
      lastName: lastname,
      firstName: firstname,
      email,
      phone,
      source: 'manual',
      paymentMethod: paymentLabel,
      manager: actor,
      address: fullAddress,
      deliveryFee: deliveryFeeNum,
      deliveryType: '',
      vatType: isCompany ? 'байгууллага' : 'Хувь хүн',
      invoiceId: undefined,
      total: grandTotal,
      paymentStatus: 'unpaid',
      status: 'pending_payment',
      date,
      note: note.trim(),
      items,
      timeline: [
        {
          text: `(#${actor}) хэрэглэгч захиалга үүсгэлээ.`,
          meta: `${actor} / ${date}`,
        },
      ],
    });
    setFlash(`Захиалга #${created.id} үүслээ`);
    window.setTimeout(() => router.push(`/ad/orders/${created.id}`), 600);
  };

  return (
    <div className="ad-co">
      <div className="ad-co-top">
        <h1 className="ad-co-title">{isEdit ? 'Нэхэмжлэх засах' : 'Шинэ захиалга үүсгэх'}</h1>
        <Link
          href={isEdit && editId ? `/ad/orders/${editId}` : '/ad/orders'}
          className="ad-order-btn ad-order-btn--default"
        >
          <ArrowLeft className="size-3.5" />
          {isEdit ? 'Захиалга руу буцах' : 'Захиалгын жагсаалт руу буцах'}
        </Link>
      </div>

      {flash ? <div className="ad-co-flash">{flash}</div> : null}

      <form onSubmit={handleSubmit}>
        <section className="ad-co-panel">
          <div className="ad-co-panel__head">Харилцагч сонгох & Мэдээлэл</div>
          <div className="ad-co-panel__body">
            <div className="ad-co-user-top">
              <div className="ad-co-field" ref={memberBoxRef}>
                <label>
                  Харилцагч хайж сонгох (Код, нэр, дугаараар)
                </label>
                <div className="ad-co-suggest">
                  <input
                    className="ad-order-input"
                    value={memberQuery}
                    placeholder="Код, салон, нэр эсвэл утсаар хайх..."
                    onFocus={() => setMemberOpen(true)}
                    onChange={(e) => {
                      setMemberQuery(e.target.value);
                      setMemberOpen(true);
                      setSelectedCustomer(null);
                    }}
                  />
                  {memberOpen && (
                    <ul className="ad-co-suggest__list ad-co-member-list">
                      {customerLoading && customerHits.length === 0 ? (
                        <li className="ad-co-member-empty">
                          <Loader2 className="size-4 animate-spin" />
                          Харилцагчдыг хайж байна...
                        </li>
                      ) : customerHits.length === 0 ? (
                        <li className="ad-co-member-empty">
                          {memberQuery.trim() ? 'Тохирох харилцагч олдсонгүй' : 'Код, нэр эсвэл утсаа бичиж хайна уу'}
                        </li>
                      ) : (
                        customerHits.map((m) => {
                          const title = m.type === 'salon' ? m.salonName || m.name : [m.lastname, m.name].filter(Boolean).join(' ') || m.name;
                          const meta = [m.phone || null, [m.city, m.district].filter(Boolean).join(', ') || null].filter(Boolean);
                          const disc = m.type === 'salon' ? tierBadgeLabel(m.discountTier, m.discountPercent) : '';
                          return (
                            <li key={m.id}>
                              <button
                                type="button"
                                onClick={() => pickMember(m)}
                                className={selectedCustomer?.id === m.id ? 'is-selected' : undefined}
                              >
                                <i
                                  className={`ad-co-member-icon ${m.type === 'salon' ? 'icon-home' : 'icon-user'}`}
                                  aria-hidden
                                />
                                <span className="ad-co-member-body">
                                  <span className="ad-co-member-title">
                                    <strong>{title}</strong>
                                    {m.code ? <em>{m.code}</em> : <em className="is-muted">Хувь хүн</em>}
                                    {m.type === 'salon' && disc ? <b>{disc}</b> : null}
                                  </span>
                                  {meta.length ? <span className="ad-co-member-meta">{meta.join(' · ')}</span> : null}
                                </span>
                              </button>
                            </li>
                          );
                        })
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

                <div className="ad-co-grid">
                  <div className="ad-co-field">
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
            <div className="ad-inv-products-wrap ad-co-products-wrap">
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
                              if (row.name.trim()) {
                                setSuggestKey(row.key);
                                setSuggestQ(row.name);
                              }
                            }}
                            onChange={(e) => {
                              const v = e.target.value;
                              updateRow(row.key, { name: v, id: '' });
                              if (v.trim()) {
                                setSuggestKey(row.key);
                                setSuggestQ(v);
                              } else {
                                setSuggestKey(null);
                                setSuggestQ('');
                                setProductHits([]);
                              }
                            }}
                            onBlur={() => {
                              window.setTimeout(() => setSuggestKey(null), 150);
                            }}
                          />
                          {row.stock != null && row.id ? (
                            <span className="ad-co-stock font-medium text-slate-500">
                              Үлдэгдэл: <strong className="text-emerald-700">{row.stock}</strong>
                            </span>
                          ) : null}
                          {suggestKey === row.key && suggestQ.trim() ? (
                            <ul className="ad-co-suggest__list ad-co-prod-list">
                              {productLoading && productHits.length === 0 ? (
                                <li className="ad-co-prod-empty">Бүтээгдэхүүн хайж байна...</li>
                              ) : productHits.length === 0 ? (
                                <li className="ad-co-prod-empty">Бүтээгдэхүүн олдсонгүй</li>
                              ) : (
                                productHits.map((p) => (
                                  <li key={p.id}>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pickProduct(row.key, p)}>
                                      {p.image ? (
                                        <img className="ad-co-prod-thumb" src={p.image} alt="" />
                                      ) : (
                                        <i className="ad-co-prod-icon icon-handbag" aria-hidden />
                                      )}
                                      <span className="ad-co-prod-body">
                                        <strong className="ad-co-prod-name">{p.title}</strong>
                                        <span className="ad-co-prod-meta">Үлдэгдэл: {p.stock ?? 0}</span>
                                      </span>
                                      <span className="ad-co-prod-price">{fmt(p.price)} ₮</span>
                                    </button>
                                  </li>
                                ))
                              )}
                              <li>
                                <button type="button" className="ad-co-prod-add" onMouseDown={(e) => e.preventDefault()} onClick={() => openNewProduct(row.key)}>
                                  <i className="icon-plus" aria-hidden />
                                  Шинэ бүтээгдэхүүн үүсгэж нэмэх
                                </button>
                              </li>
                            </ul>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="ad-order-input text-center font-medium"
                          value={row.qty}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^\d]/g, '');
                            updateRow(row.key, { qty: v === '' ? '' : Number(v) });
                          }}
                          onBlur={() => {
                            if (num(row.qty) < 1) updateRow(row.key, { qty: 1 });
                          }}
                        />
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input font-medium"
                            inputMode="decimal"
                            value={
                              editingCell?.key === row.key && editingCell.field === 'price'
                                ? row.price
                                : row.price === ''
                                  ? ''
                                  : fmt(num(row.price))
                            }
                            onFocus={() => setEditingCell({ key: row.key, field: 'price' })}
                            onChange={(e) => {
                              const next = parseDecimalInput(e.target.value);
                              if (next === null) return;
                              updateRow(row.key, { price: next });
                            }}
                            onBlur={() => {
                              if (row.price === '') updateRow(row.key, { price: 0 });
                              setEditingCell(null);
                            }}
                          />
                          <span>₮</span>
                        </div>
                      </td>
                      <td>
                        <div className="ad-inv-input-addon">
                          <input
                            className="ad-order-input font-medium"
                            inputMode="decimal"
                            value={
                              editingCell?.key === row.key && editingCell.field === 'sale'
                                ? row.sale
                                : row.sale === ''
                                  ? ''
                                  : Number(num(row.sale).toFixed(2))
                            }
                            onFocus={() => setEditingCell({ key: row.key, field: 'sale' })}
                            onChange={(e) => {
                              const next = parseDecimalInput(e.target.value);
                              if (next === null) return;
                              updateRow(row.key, { sale: next });
                            }}
                            onBlur={() => {
                              if (row.sale === '') updateRow(row.key, { sale: 0 });
                              setEditingCell(null);
                            }}
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
                          <input className="ad-order-input ad-money font-bold text-slate-900" readOnly value={fmt(lineTotal(row))} />
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
                    <td className="text-right ">Барааны нийт үнэ:</td>
                    <td colSpan={3} className="font-semibold">{fmt(totals.price)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right ">
                      <div className="inline-flex items-center gap-1.5">
                        <span>Хүргэлтийн төлбөр:</span>
                        {deliveryFeeNum === 0 && totals.price >= FREE_DELIVERY_THRESHOLD ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✨ 100,000₮-с дээш үнэгүй
                          </span>
                        ) : totals.price > 0 && totals.price < FREE_DELIVERY_THRESHOLD ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            100,000₮ хүрээгүй (+7,000₮)
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td colSpan={3} className={`font-semibold ${deliveryFeeNum === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {deliveryFeeNum === 0 ? '0.00 ₮ (Үнэгүй)' : `${fmt(deliveryFeeNum)} ₮`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right ">
                      НӨАТ (10%):
                    </td>
                    <td colSpan={3}>{fmt(totals.nuat)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">
                      Хямдрал:
                    </td>
                    <td colSpan={3}>{fmt(totals.discount)} ₮</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right ">
                      Тоо ширхэг:
                    </td>
                    <td colSpan={3}>{totals.qty} ширхэг</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="text-right text-base text-slate-900 ">
                        Нийт дүн:
                    </td>
                    <td colSpan={3} className="text-base text-slate-900">
                      {fmt(grandTotal)} ₮
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="ad-co-bottom">
              <div>
                <div className="ad-co-field">
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
              </div>
            </div>

            <button type="submit" className="ad-order-btn ad-order-btn--success ad-co-submit">
              {isEdit ? 'Барааг шинэчилж хадгалах' : 'Захиалга баталгаажуулж хадгалах'}
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

export default function AdCreateOrderPage() {
  return <AdOrderCompose />;
}
