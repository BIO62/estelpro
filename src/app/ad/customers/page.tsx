'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Mail, MapPin, Pencil, Phone, Search, Trash2 } from 'lucide-react';

import type { AppUser } from '@/lib/users/repo';
import type { PublicUser } from '@/lib/auth/types';
import { isLeadershipRole } from '@/lib/auth/roles';

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
};

type Tab = 'ALL' | 'SALON' | 'CONSUMER';

export default function AdCustomersPage() {
  const [tab, setTab] = useState<Tab>('ALL');
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

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [salonRes, userRes] = await Promise.all([
        fetch(`/api/auth/salon?search=${encodeURIComponent(search)}&page=${page}&limit=24`),
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
  }, [search, page]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('tab') as Tab | null;
    if (q === 'SALON' || q === 'CONSUMER' || q === 'ALL') setTab(q);
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => setIsDirector(isLeadershipRole(data.user?.role)));
  }, []);

  useEffect(() => {
    const t = window.setTimeout(load, 200);
    return () => window.clearTimeout(t);
  }, [load]);

  const isSalonRow = (c: SalonItem) => c.salonName.startsWith('1.') || c.email.includes('@salon.');

  const visibleSalons = useMemo(() => {
    if (tab === 'CONSUMER') return [];
    return salons.filter((c) => (tab === 'SALON' ? isSalonRow(c) : true));
  }, [salons, tab]);

  const visibleConsumers = tab === 'SALON' ? [] : consumers;

  const totalShown =
    tab === 'ALL' ? salonTotal + consumerTotal : tab === 'SALON' ? salonTotal : consumerTotal;

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
        contactName: editSalon.contactName,
        phone: editSalon.phone,
        email: editSalon.email,
        city: editSalon.city,
        district: editSalon.district,
        address: editSalon.address,
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
          <h1 className="text-2xl font-bold tracking-tight">Харилцагч & Салоны бүртгэл</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Салон {salonTotal.toLocaleString()} · Сайтын хэрэглэгч {consumerTotal.toLocaleString()}
          </p>
        </div>
        {isDirector ? <Link
          href="/ad/salons"
          className="self-start rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground sm:self-auto"
        >
          + Салоны код өгөх
        </Link> : null}
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1 text-xs font-semibold shadow-xs">
        <button type="button" onClick={() => { setTab('ALL'); setPage(1); }} className={`rounded px-3 py-1.5 ${tabClass(tab === 'ALL')}`}>
          Бүгд
        </button>
        <button type="button" onClick={() => { setTab('SALON'); setPage(1); }} className={`rounded px-3 py-1.5 ${tabClass(tab === 'SALON')}`}>
          Салонууд ({salonTotal})
        </button>
        <button type="button" onClick={() => { setTab('CONSUMER'); setPage(1); }} className={`rounded px-3 py-1.5 ${tabClass(tab === 'CONSUMER')}`}>
          Сайтын хэрэглэгч ({consumerTotal})
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Нэр, код, имэйл, утас..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm shadow-xs focus:border-primary focus:outline-none"
        />
      </div>

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {loading ? (
        <p className="py-20 text-center text-sm text-muted-foreground">Ачаалж байна...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleSalons.map((c) => (
            <article key={`s-${c.id}`} className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded bg-foreground px-2 py-0.5 font-mono text-xs font-bold text-background">{c.salonCode}</span>
                <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  {isSalonRow(c) ? 'САЛОН' : 'ХАРИЛЦАГЧ'}
                </span>
              </div>
              <h3 className="line-clamp-2 text-sm font-bold">{c.salonName}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.contactName}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{c.email}</span></div>
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5" /><span className="line-clamp-1">{c.address || c.city}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle className="h-3 w-3" />Идэвхтэй</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setEditSalon({ ...c })} className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                    <Pencil className="h-3.5 w-3.5" />Засах
                  </button>
                  {isDirector ? (
                    <button type="button" onClick={() => removeSalon(c)} className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
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
                <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">САЙТ</span>
                <span className="text-[10px] text-muted-foreground">{u.emailVerified ? 'OTP ✓' : 'OTP хүлээж байна'}</span>
              </div>
              <h3 className="text-sm font-bold">{u.lastName ? `${u.lastName} ` : ''}{u.name}</h3>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{u.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{u.phone || '—'}</div>
              </div>
              <div className="mt-4 flex justify-end gap-3 border-t border-border pt-3">
                <button type="button" onClick={() => setEditUser({ ...u })} className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                  <Pencil className="h-3.5 w-3.5" />Засах
                </button>
                {isDirector ? (
                  <button type="button" onClick={() => removeUser(u)} className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
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
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Өмнөх</button>
          <span>{page}</span>
          <button type="button" disabled={page * 24 >= totalShown} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Дараах</button>
        </div>
      ) : null}

      {editSalon ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveSalon} className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl bg-white p-5">
            <h3 className="text-lg font-bold">Салон засах</h3>
            {(['salonName', 'contactName', 'phone', 'email', 'city', 'district', 'address'] as const).map((field) => (
              <input
                key={field}
                required={field === 'salonName' || field === 'contactName' || field === 'email'}
                value={(editSalon[field] as string) || ''}
                onChange={(e) => setEditSalon({ ...editSalon, [field]: e.target.value })}
                placeholder={field}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditSalon(null)}>Болих</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Хадгалах</button>
            </div>
          </form>
        </div>
      ) : null}

      {editUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveUser} className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl bg-white p-5">
            <h3 className="text-lg font-bold">Хэрэглэгч засах</h3>
            <input required value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} placeholder="Нэр" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <input value={editUser.lastName || ''} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} placeholder="Овог" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <input value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} placeholder="Утас" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <input value={editUser.email} disabled className="w-full rounded-xl border bg-muted px-3 py-2 text-sm" />
            <input value={editUser.city || ''} onChange={(e) => setEditUser({ ...editUser, city: e.target.value })} placeholder="Хот" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <input value={editUser.district || ''} onChange={(e) => setEditUser({ ...editUser, district: e.target.value })} placeholder="Дүүрэг" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <input value={editUser.address || ''} onChange={(e) => setEditUser({ ...editUser, address: e.target.value })} placeholder="Хаяг" className="w-full rounded-xl border px-3 py-2 text-sm" />
            <textarea value={editUser.notes || ''} onChange={(e) => setEditUser({ ...editUser, notes: e.target.value })} placeholder="Тэмдэглэл" rows={2} className="w-full rounded-xl border px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditUser(null)}>Болих</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Хадгалах</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
