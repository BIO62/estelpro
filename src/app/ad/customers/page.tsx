'use client';

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle, Mail, MapPin, Pencil, Phone, Plus, Search, Trash2, X } from 'lucide-react';

import type { AppUser } from '@/lib/users/repo';
import type { PublicUser } from '@/lib/auth/types';
import { isLeadershipRole } from '@/lib/auth/roles';
import { SALON_DISCOUNT_PERCENTS, salonDefaultPassword, tierIdForPercent } from '@/lib/auth/salon-discount';

type SalonItem = {
  id: string;
  salonCode: string;
  salonName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  district: string | null;
  address: string;
  discountTier?: string;
  discountPercent?: number;
};

type Tab = 'CLIENT' | 'CONSUMER';
type CreateSalonForm = {
  salonCode: string;
  salonName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  discountPercent: number;
};

const emptyCreateSalon = (): CreateSalonForm => ({
  salonCode: '',
  salonName: '',
  email: '',
  phone: '',
  city: 'Улаанбаатар',
  district: '',
  address: '',
  discountPercent: 15,
});

function fieldLabel(el: ReactNode, text: string) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-semibold text-muted-foreground">{text}</span>
      {el}
    </label>
  );
}

function inputClass() {
  return 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';
}

function modalActions({
  onCancel,
  submitLabel,
  saving,
}: {
  onCancel: () => void;
  submitLabel: string;
  saving: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Болих
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? 'Хадгалж байна...' : submitLabel}
      </button>
    </div>
  );
}

export default function AdCustomersPage() {
  const [tab, setTab] = useState<Tab>('CLIENT');
  const [salons, setSalons] = useState<SalonItem[]>([]);
  const [consumers, setConsumers] = useState<AppUser[]>([]);
  const [salonTotal, setSalonTotal] = useState(0);
  const [consumerTotal, setConsumerTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editSalon, setEditSalon] = useState<SalonItem | null>(null);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDirector, setIsDirector] = useState(false);
  const [sort, setSort] = useState<'code' | 'discount'>('discount');
  const [discountFilter, setDiscountFilter] = useState('');
  const [createSalon, setCreateSalon] = useState<CreateSalonForm | null>(null);
  const [createUser, setCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '', password: '' });
  const [createdPassword, setCreatedPassword] = useState('');
  const [createdSalonHint, setCreatedSalonHint] = useState('');

  const closeModals = useCallback(() => {
    setEditSalon(null);
    setEditUser(null);
    setCreateSalon(null);
    setCreateUser(false);
  }, []);

  useEffect(() => {
    const open = !!(editSalon || editUser || createSalon || createUser);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModals();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editSalon, editUser, createSalon, createUser, closeModals]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [salonRes, userRes] = await Promise.all([
        fetch(`/api/auth/salon?search=${encodeURIComponent(search)}&page=${page}&limit=24&sort=${sort}&discountPercent=${encodeURIComponent(discountFilter)}`),
        fetch(`/api/ad/users?status=ALL&q=${encodeURIComponent(search)}&page=${page}&limit=24`),
      ]);
      const salonData = await salonRes.json();
      const userData = await userRes.json();
      setSalons(salonData.salons || []);
      setSalonTotal(salonData.total || 0);
      setConsumers(userData.users || []);
      setConsumerTotal(userData.total || 0);
      if (userData.error && !userData.users?.length) setError(userData.error);
    } catch {
      setError('Ачаалж чадсангүй');
    }
    setLoading(false);
  }, [search, page, sort, discountFilter]);

  useEffect(() => {
    const q = (new URLSearchParams(window.location.search).get('tab') || '').toUpperCase();
    if (q === 'CLIENT' || q === 'SALON' || q === 'ALL') setTab('CLIENT');
    if (q === 'CONSUMER') setTab('CONSUMER');
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => setIsDirector(isLeadershipRole(data.user?.role)));
  }, []);

  useEffect(() => {
    const t = window.setTimeout(load, 200);
    return () => window.clearTimeout(t);
  }, [load]);

  const visibleSalons = tab === 'CONSUMER' ? [] : salons;

  const visibleConsumers = tab === 'CLIENT' ? [] : consumers;

  const totalShown = tab === 'CLIENT' ? salonTotal : consumerTotal;

  async function saveSalon(e: FormEvent) {
    e.preventDefault();
    if (!editSalon) return;
    setSaving(true);
    const res = await fetch('/api/ad/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'salon',
        id: editSalon.id,
        salonName: editSalon.salonName,
        contactName: editSalon.salonName,
        phone: editSalon.phone,
        email: editSalon.email,
        city: editSalon.city,
        district: editSalon.district,
        address: editSalon.address,
        discountTier: tierIdForPercent(editSalon.discountPercent || 15),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Хадгалж чадсангүй');
      return;
    }
    setEditSalon(null);
    load();
  }

  async function addSalon(e: FormEvent) {
    e.preventDefault();
    if (!createSalon) return;
    setSaving(true);
    const res = await fetch('/api/auth/salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salonCode: createSalon.salonCode,
        salonName: createSalon.salonName,
        name: createSalon.salonName,
        email: createSalon.email,
        phone: createSalon.phone,
        city: createSalon.city,
        district: createSalon.district,
        address: createSalon.address,
        discountTier: tierIdForPercent(createSalon.discountPercent),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Салон нэмэж чадсангүй');
      return;
    }
    setCreateSalon(null);
    setCreatedSalonHint(
      `Нэвтрэх: код ${createSalon.salonCode} · нууц үг ${salonDefaultPassword(createSalon.phone || '') || '(утас)'}`,
    );
    load();
  }

  async function addUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/ad/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Хэрэглэгч нэмэж чадсангүй');
      return;
    }
    setCreateUser(false);
    setNewUser({ name: '', lastName: '', email: '', phone: '', password: '' });
    setCreatedPassword(data.password || '');
    load();
  }

  async function saveUser(e: FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    const res = await fetch('/api/ad/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'consumer',
        id: editUser.id,
        name: editUser.name,
        lastName: editUser.lastName,
        phone: editUser.phone,
        address: editUser.address,
        city: editUser.city,
        district: editUser.district,
        notes: editUser.notes,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Хадгалж чадсангүй');
      return;
    }
    setEditUser(null);
    load();
  }

  async function removeSalon(salon: SalonItem) {
    if (!window.confirm(`${salon.salonName} салоныг устгах уу?`)) return;
    const res = await fetch('/api/auth/salon', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: salon.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Салон устгаж чадсангүй.');
      return;
    }
    load();
  }

  async function removeUser(user: AppUser) {
    if (!window.confirm(`${user.email} хэрэглэгчийг бүр мөсөн устгах уу?`)) return;
    const res = await fetch('/api/ad/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Хэрэглэгч устгаж чадсангүй.');
      return;
    }
    load();
  }

  const tabClass = (active: boolean) =>
    active ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground';

  return (
    <div className="space-y-5 text-foreground">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Харилцагч</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Харилцагч {salonTotal.toLocaleString()} · Сайтын хэрэглэгч {consumerTotal.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCreateSalon(emptyCreateSalon())}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> Харилцагч нэмэх
          </button>
          <button
            type="button"
            onClick={() => setCreateUser(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold transition hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Сайтын хэрэглэгч нэмэх
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1 text-xs font-semibold shadow-xs">
        <button type="button" onClick={() => { setTab('CLIENT'); setPage(1); }} className={`rounded-full px-4 py-1.5 ${tabClass(tab === 'CLIENT')}`}>
          Харилцагч ({salonTotal})
        </button>
        <button type="button" onClick={() => { setTab('CONSUMER'); setPage(1); }} className={`rounded-full px-4 py-1.5 ${tabClass(tab === 'CONSUMER')}`}>
          Сайтын хэрэглэгч ({consumerTotal})
        </button>
      </div>

      {tab === 'CLIENT' ? (
      <div className="flex flex-wrap gap-2">
        <select
          value={discountFilter}
          onChange={(e) => { setDiscountFilter(e.target.value); setPage(1); }}
          className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold"
        >
          <option value="">Хөнгөлөлт: бүгд</option>
          {SALON_DISCOUNT_PERCENTS.map((percent) => (
            <option key={percent} value={String(percent)}>{percent}%</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as 'code' | 'discount'); setPage(1); }}
          className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold"
        >
          <option value="discount">Эрэмбэ: хөнгөлөлт %</option>
          <option value="code">Эрэмбэ: код</option>
        </select>
      </div>
      ) : null}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Нэр, код, имэйл, утас..."
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm shadow-xs focus:border-primary focus:outline-none"
        />
      </div>

      {createdPassword ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          Түр нууц үг: <code className="font-mono font-bold">{createdPassword}</code>
        </p>
      ) : null}

      {createdSalonHint ? (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{createdSalonHint}</span>
          </p>
          <button type="button" onClick={() => setCreatedSalonHint('')} className="rounded-full p-1 text-emerald-700/70 hover:bg-emerald-100" aria-label="Хаах">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {loading ? (
        <p className="py-20 text-center text-sm text-muted-foreground">Ачаалж байна...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleSalons.map((c) => (
            <article key={`s-${c.id}`} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-foreground px-2.5 py-0.5 font-mono text-xs font-bold text-background">{c.salonCode}</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  {c.discountPercent ?? 0}%
                </span>
              </div>
              <h3 className="line-clamp-2 text-sm font-bold">{c.salonName}</h3>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{c.email}</span></div>
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5" /><span className="line-clamp-1">{c.address || c.city}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle className="h-3 w-3" />Идэвхтэй</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditSalon({ ...c })} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
                    <Pencil className="h-3.5 w-3.5" />Засах
                  </button>
                  {isDirector ? (
                    <button type="button" onClick={() => removeSalon(c)} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
                      <Trash2 className="h-3.5 w-3.5" />Устгах
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          {visibleConsumers.map((u) => (
            <article key={`u-${u.id}`} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">САЙТ</span>
                <span className="text-[10px] text-muted-foreground">{u.emailVerified ? 'OTP ✓' : 'OTP хүлээж байна'}</span>
              </div>
              <h3 className="text-sm font-bold">{u.lastName ? `${u.lastName} ` : ''}{u.name}</h3>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{u.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{u.phone || '—'}</div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={() => setEditUser({ ...u })} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
                  <Pencil className="h-3.5 w-3.5" />Засах
                </button>
                {isDirector ? (
                  <button type="button" onClick={() => removeUser(u)} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
                    <Trash2 className="h-3.5 w-3.5" />Устгах
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && visibleSalons.length === 0 && visibleConsumers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Олдсонгүй</p>
      ) : null}

      {totalShown > 24 ? (
        <div className="flex justify-between border-t border-border pt-4 text-xs">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full border border-border px-4 py-1.5 disabled:opacity-40">Өмнөх</button>
          <span>{page}</span>
          <button type="button" disabled={page * 24 >= totalShown} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-border px-4 py-1.5 disabled:opacity-40">Дараах</button>
        </div>
      ) : null}

      {editSalon ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <form onSubmit={saveSalon} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <button type="button" onClick={closeModals} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Хаах">
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-8 text-lg font-bold">Харилцагч засах</h3>
            {fieldLabel(
              <input required value={editSalon.salonName} onChange={(e) => setEditSalon({ ...editSalon, salonName: e.target.value })} className={inputClass()} />,
              'Салон болон харилцагч',
            )}
            {fieldLabel(
              <input value={editSalon.phone} onChange={(e) => setEditSalon({ ...editSalon, phone: e.target.value })} className={inputClass()} />,
              'Утас',
            )}
            {fieldLabel(
              <input required type="email" value={editSalon.email} onChange={(e) => setEditSalon({ ...editSalon, email: e.target.value })} className={inputClass()} />,
              'Имэйл',
            )}
            {fieldLabel(
              <input value={editSalon.city} onChange={(e) => setEditSalon({ ...editSalon, city: e.target.value })} className={inputClass()} />,
              'Хот',
            )}
            {fieldLabel(
              <input value={editSalon.district || ''} onChange={(e) => setEditSalon({ ...editSalon, district: e.target.value })} className={inputClass()} />,
              'Дүүрэг',
            )}
            {fieldLabel(
              <input value={editSalon.address} onChange={(e) => setEditSalon({ ...editSalon, address: e.target.value })} className={inputClass()} />,
              'Хаяг',
            )}
            {fieldLabel(
              <select
                value={String(editSalon.discountPercent ?? 15)}
                onChange={(e) => setEditSalon({ ...editSalon, discountPercent: Number(e.target.value) })}
                className={inputClass()}
              >
                {SALON_DISCOUNT_PERCENTS.map((percent) => (
                  <option key={percent} value={percent}>{percent}%</option>
                ))}
              </select>,
              'Хөнгөлөлт',
            )}
            {modalActions({ onCancel: closeModals, submitLabel: 'Хадгалах', saving })}
          </form>
        </div>
      ) : null}

      {createSalon ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <form onSubmit={addSalon} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <button type="button" onClick={closeModals} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Хаах">
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-8 text-lg font-bold">Харилцагч нэмэх</h3>
            <p className="text-xs text-muted-foreground">Нэвтрэх нууц үг = утасны дугаар (сүүлийн 8 орон).</p>
            {fieldLabel(<input required value={createSalon.salonCode} onChange={(e) => setCreateSalon({ ...createSalon, salonCode: e.target.value.toUpperCase() })} className={inputClass()} />, 'Салоны код')}
            {fieldLabel(<input required value={createSalon.salonName} onChange={(e) => setCreateSalon({ ...createSalon, salonName: e.target.value })} className={inputClass()} />, 'Салон болон харилцагч')}
            {fieldLabel(<input required type="email" value={createSalon.email} onChange={(e) => setCreateSalon({ ...createSalon, email: e.target.value })} className={inputClass()} />, 'Имэйл')}
            {fieldLabel(<input required value={createSalon.phone} onChange={(e) => setCreateSalon({ ...createSalon, phone: e.target.value })} className={inputClass()} />, 'Утас')}
            {fieldLabel(<input value={createSalon.city} onChange={(e) => setCreateSalon({ ...createSalon, city: e.target.value })} className={inputClass()} />, 'Хот')}
            {fieldLabel(<input value={createSalon.district} onChange={(e) => setCreateSalon({ ...createSalon, district: e.target.value })} className={inputClass()} />, 'Дүүрэг')}
            {fieldLabel(<input value={createSalon.address} onChange={(e) => setCreateSalon({ ...createSalon, address: e.target.value })} className={inputClass()} />, 'Хаяг')}
            {fieldLabel(
              <select value={String(createSalon.discountPercent)} onChange={(e) => setCreateSalon({ ...createSalon, discountPercent: Number(e.target.value) })} className={inputClass()}>
                {SALON_DISCOUNT_PERCENTS.map((percent) => (
                  <option key={percent} value={percent}>{percent}%</option>
                ))}
              </select>,
              'Хөнгөлөлт',
            )}
            {modalActions({ onCancel: closeModals, submitLabel: 'Нэмэх', saving })}
          </form>
        </div>
      ) : null}

      {createUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <form onSubmit={addUser} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <button type="button" onClick={closeModals} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Хаах">
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-8 text-lg font-bold">Сайтын хэрэглэгч нэмэх</h3>
            {fieldLabel(<input required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className={inputClass()} />, 'Нэр')}
            {fieldLabel(<input value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} className={inputClass()} />, 'Овог')}
            {fieldLabel(<input required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className={inputClass()} />, 'Имэйл')}
            {fieldLabel(<input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className={inputClass()} />, 'Утас')}
            {fieldLabel(<input value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className={inputClass()} placeholder="Хоосон бол автомат" />, 'Нууц үг')}
            {modalActions({ onCancel: closeModals, submitLabel: 'Нэмэх', saving })}
          </form>
        </div>
      ) : null}

      {editUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModals();
          }}
        >
          <form onSubmit={saveUser} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <button type="button" onClick={closeModals} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Хаах">
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-8 text-lg font-bold">Хэрэглэгч засах</h3>
            {fieldLabel(<input required value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className={inputClass()} />, 'Нэр')}
            {fieldLabel(<input value={editUser.lastName || ''} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} className={inputClass()} />, 'Овог')}
            {fieldLabel(<input value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} className={inputClass()} />, 'Утас')}
            {fieldLabel(<input value={editUser.email} disabled className={`${inputClass()} bg-muted`} />, 'Имэйл')}
            {fieldLabel(<input value={editUser.city || ''} onChange={(e) => setEditUser({ ...editUser, city: e.target.value })} className={inputClass()} />, 'Хот')}
            {fieldLabel(<input value={editUser.district || ''} onChange={(e) => setEditUser({ ...editUser, district: e.target.value })} className={inputClass()} />, 'Дүүрэг')}
            {fieldLabel(<input value={editUser.address || ''} onChange={(e) => setEditUser({ ...editUser, address: e.target.value })} className={inputClass()} />, 'Хаяг')}
            {fieldLabel(<textarea value={editUser.notes || ''} onChange={(e) => setEditUser({ ...editUser, notes: e.target.value })} rows={2} className={inputClass()} />, 'Тэмдэглэл')}
            {modalActions({ onCancel: closeModals, submitLabel: 'Хадгалах', saving })}
          </form>
        </div>
      ) : null}
    </div>
  );
}
