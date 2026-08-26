'use client';

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';

import type { AppUser } from '@/lib/users/repo';
import type { PublicUser } from '@/lib/auth/types';
import { isLeadershipRole } from '@/lib/auth/roles';
import { SALON_DISCOUNT_PERCENTS, salonDefaultPassword, tierBadgeLabel, tierIdForPercent } from '@/lib/auth/salon-discount';

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
  discountPercent: 0,
});

function placeLine(...parts: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const t = (part || '').trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out.join(', ') || '—';
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
        aria-label="Засах"
        title="Засах"
      >
        <SquarePen size={18} strokeWidth={2} className="shrink-0" />
      </button>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50"
          aria-label="Устгах"
          title="Устгах"
        >
          <Trash2 size={18} strokeWidth={2} className="shrink-0" />
        </button>
      ) : null}
    </div>
  );
}

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
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Болих
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
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
        fetch(`/api/auth/salon?search=${encodeURIComponent(search)}&page=${page}&limit=24&discountPercent=${encodeURIComponent(discountFilter)}`),
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
  }, [search, page, discountFilter]);

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
        discountTier: tierIdForPercent(editSalon.discountPercent || 0, editSalon.discountTier),
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> Харилцагч нэмэх
          </button>
          <button
            type="button"
            onClick={() => setCreateUser(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold transition hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Сайтын хэрэглэгч нэмэх
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs font-semibold">
        <button type="button" onClick={() => { setTab('CLIENT'); setPage(1); }} className={`rounded-md px-3 py-1.5 ${tabClass(tab === 'CLIENT')}`}>
          Харилцагч ({salonTotal})
        </button>
        <button type="button" onClick={() => { setTab('CONSUMER'); setPage(1); }} className={`rounded-md px-3 py-1.5 ${tabClass(tab === 'CONSUMER')}`}>
          Сайтын хэрэглэгч ({consumerTotal})
        </button>
      </div>

      {tab === 'CLIENT' ? (
      <div className="flex flex-wrap gap-2">
        <select
          value={discountFilter}
          onChange={(e) => { setDiscountFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold"
        >
          <option value="">Хөнгөлөлт: бүгд</option>
          {SALON_DISCOUNT_PERCENTS.map((percent) => (
            <option key={percent} value={String(percent)}>{percent}%</option>
          ))}
        </select>
      </div>
      ) : null}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Нэр, код, имэйл, утас..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {createdPassword ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          Түр нууц үг: <code className="font-mono font-bold">{createdPassword}</code>
        </p>
      ) : null}

      {createdSalonHint ? (
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
          {createdSalonHint}
        </div>
      ) : null}

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {loading ? (
        <p className="py-20 text-center text-sm text-muted-foreground">Ачаалж байна...</p>
      ) : tab === 'CLIENT' ? (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
              <thead className="border-b border-border bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Код</th>
                  <th className="px-4 py-3 font-semibold">Нэр</th>
                  <th className="px-4 py-3 font-semibold">Утас</th>
                  <th className="px-4 py-3 font-semibold">Хөнгөлөлт</th>
                  <th className="px-4 py-3 font-semibold">Байршил</th>
                  <th className="sticky right-0 z-[1] bg-slate-50 px-4 py-3 text-right font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {visibleSalons.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    onClick={() => setEditSalon({ ...c })}
                  >
                    <td className="px-4 py-3.5 font-mono text-[12px] font-semibold text-slate-700">{c.salonCode}</td>
                    <td className="max-w-[240px] px-4 py-3.5">
                      <span className="line-clamp-1 font-medium text-slate-900">{c.salonName}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{c.phone || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-slate-800">
                        {tierBadgeLabel(c.discountTier, c.discountPercent)}
                      </span>
                    </td>
                    <td className="max-w-[200px] px-4 py-3.5 text-slate-600">
                      <span className="line-clamp-1">{placeLine(c.city, c.district)}</span>
                    </td>
                    <td className="sticky right-0 z-[1] bg-white px-4 py-3.5 text-right hover:bg-slate-50">
                      <RowActions
                        onEdit={() => setEditSalon({ ...c })}
                        onDelete={isDirector ? () => removeSalon(c) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
              <thead className="border-b border-border bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Нэр</th>
                  <th className="px-4 py-3 font-semibold">Имэйл</th>
                  <th className="px-4 py-3 font-semibold">Утас</th>
                  <th className="px-4 py-3 font-semibold">Төлөв</th>
                  <th className="sticky right-0 z-[1] bg-slate-50 px-4 py-3 text-right font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {visibleConsumers.map((u) => {
                  const fullName = `${u.lastName ? `${u.lastName} ` : ''}${u.name}`.trim();
                  return (
                    <tr
                      key={u.id}
                      className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      onClick={() => setEditUser({ ...u })}
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-900">{fullName}</td>
                      <td className="max-w-[220px] truncate px-4 py-3.5 text-slate-700">{u.email}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{u.phone || '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium ${u.emailVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {u.emailVerified ? 'Баталгаажсан' : 'OTP хүлээж байна'}
                        </span>
                      </td>
                      <td className="sticky right-0 z-[1] bg-white px-4 py-3.5 text-right hover:bg-slate-50">
                        <RowActions
                          onEdit={() => setEditUser({ ...u })}
                          onDelete={isDirector ? () => removeUser(u) : undefined}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            <h3 className="text-lg font-bold">Харилцагч засах</h3>
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
            <h3 className="text-lg font-bold">Харилцагч нэмэх</h3>
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
            <h3 className="text-lg font-bold">Сайтын хэрэглэгч нэмэх</h3>
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
            <h3 className="text-lg font-bold">Хэрэглэгч засах</h3>
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
