'use client';

import { FormEvent, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';

import type { AppUser } from '@/lib/users/repo';
import type { PublicUser } from '@/lib/auth/types';
import { canViewSiteUsers, isLeadershipRole } from '@/lib/auth/roles';
import { SALON_DISCOUNT_PERCENTS, salonDefaultPassword, tierBadgeLabel, tierIdForPercent } from '@/lib/auth/salon-discount';
import { AIMAGS, districtsForCity, matchAimag } from '@/lib/ad/locations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  city: 'Улаанбаатар хот',
  district: '',
  address: '',
  discountPercent: 0,
});

function CityDistrictFields({
  city,
  district,
  onChange,
}: {
  city: string;
  district: string;
  onChange: (next: { city: string; district: string }) => void;
}) {
  const cityValue = matchAimag(city);
  const options = districtsForCity(cityValue);
  const extraCity = cityValue && !(AIMAGS as readonly string[]).includes(cityValue) ? cityValue : '';
  const districtValue = options.includes(district) ? district : '';
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Хот / аймаг">
        <select
          value={cityValue}
          onChange={(e) => onChange({ city: e.target.value, district: '' })}
          className={selectClass}
        >
          {extraCity ? <option value={extraCity}>{extraCity}</option> : null}
          {AIMAGS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </Field>
      <Field label="Дүүрэг / сум">
        <select
          value={districtValue}
          onChange={(e) => onChange({ city: cityValue, district: e.target.value })}
          className={selectClass}
        >
          <option value="">Сонгох</option>
          {options.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const selectClass =
  'h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50';

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
      className="inline-flex shrink-0 items-center gap-1"
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

function modalActions({
  submitLabel,
  saving,
}: {
  submitLabel: string;
  saving: boolean;
}) {
  return (
    <div className="flex justify-end pt-2">
      <Button type="submit" disabled={saving}>
        {saving ? 'Хадгалж байна...' : submitLabel}
      </Button>
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
  const [seeSiteUsers, setSeeSiteUsers] = useState(false);
  const [meReady, setMeReady] = useState(false);
  const [discountFilter, setDiscountFilter] = useState('');
  const [createSalon, setCreateSalon] = useState<CreateSalonForm | null>(null);
  const [createdSalonHint, setCreatedSalonHint] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'salon'; item: SalonItem }
    | { type: 'consumer'; item: AppUser }
    | null
  >(null);

  const closeModals = useCallback(() => {
    setEditSalon(null);
    setEditUser(null);
    setCreateSalon(null);
  }, []);

  useEffect(() => {
    const open = !!(editSalon || editUser || createSalon);
    if (!open || deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModals();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editSalon, editUser, createSalon, deleteTarget, closeModals]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const salonRes = await fetch(
        `/api/auth/salon?search=${encodeURIComponent(search)}&page=${page}&limit=24&discountPercent=${encodeURIComponent(discountFilter)}`,
      );
      const salonData = await salonRes.json();
      setSalons(salonData.salons || []);
      setSalonTotal(salonData.total || 0);
      if (seeSiteUsers) {
        const userRes = await fetch(`/api/ad/users?status=ALL&q=${encodeURIComponent(search)}&page=${page}&limit=24`);
        const userData = await userRes.json();
        setConsumers(userData.users || []);
        setConsumerTotal(userData.total || 0);
        if (userData.error && !userData.users?.length) setError(userData.error);
      } else {
        setConsumers([]);
        setConsumerTotal(0);
      }
    } catch {
      setError('Ачаалж чадсангүй');
    }
    setLoading(false);
  }, [search, page, discountFilter, seeSiteUsers]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => {
        const role = data.user?.role;
        const allowSiteUsers = canViewSiteUsers(role);
        setIsDirector(isLeadershipRole(role));
        setSeeSiteUsers(allowSiteUsers);
        const q = (new URLSearchParams(window.location.search).get('tab') || '').toUpperCase();
        if (allowSiteUsers && q === 'CONSUMER') setTab('CONSUMER');
        else if (q === 'CLIENT' || q === 'SALON' || q === 'ALL' || !allowSiteUsers) setTab('CLIENT');
        setMeReady(true);
      })
      .catch(() => setMeReady(true));
  }, []);

  useEffect(() => {
    if (!meReady) return;
    const t = window.setTimeout(load, 200);
    return () => window.clearTimeout(t);
  }, [load, meReady]);

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

  async function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'salon') {
      const res = await fetch('/api/auth/salon', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Салон устгаж чадсангүй.');
        setDeleteTarget(null);
        return;
      }
    } else {
      const res = await fetch('/api/ad/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Хэрэглэгч устгаж чадсангүй.');
        setDeleteTarget(null);
        return;
      }
    }
    setDeleteTarget(null);
    load();
  }

  const tabClass = (active: boolean) =>
    active ? 'rounded-xl bg-primary text-primary-foreground shadow-xs' : 'rounded-xl text-muted-foreground hover:text-foreground';

  const visibleSalons = tab === 'CONSUMER' ? [] : salons;
  const visibleConsumers = tab === 'CLIENT' ? [] : consumers;
  const totalShown = tab === 'CLIENT' ? salonTotal : consumerTotal;

  const deleteTitle = deleteTarget?.type === 'salon' ? 'Харилцагч устгах уу?' : 'Хэрэглэгч устгах уу?';
  const deleteName =
    deleteTarget?.type === 'salon'
      ? deleteTarget.item.salonName
      : deleteTarget
        ? `${deleteTarget.item.lastName ? `${deleteTarget.item.lastName} ` : ''}${deleteTarget.item.name}`.trim() || deleteTarget.item.email
        : '';

  return (
    <div className="space-y-5 text-foreground">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Харилцагч</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setCreateSalon(emptyCreateSalon())}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> Харилцагч нэмэх
          </button>
        </div>
      </div>

      {seeSiteUsers ? (
      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1 text-xs font-semibold">
        <button type="button" onClick={() => { setTab('CLIENT'); setPage(1); }} className={`px-3 py-1.5 ${tabClass(tab === 'CLIENT')}`}>
          Харилцагч ({salonTotal})
        </button>
        <button type="button" onClick={() => { setTab('CONSUMER'); setPage(1); }} className={`px-3 py-1.5 ${tabClass(tab === 'CONSUMER')}`}>
          Сайтын хэрэглэгч ({consumerTotal})
        </button>
      </div>
      ) : null}

      {tab === 'CLIENT' ? (
      <div className="flex flex-wrap gap-2">
        <select
          value={discountFilter}
          onChange={(e) => { setDiscountFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
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

      {createdSalonHint ? (
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
          {createdSalonHint}
        </div>
      ) : null}

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {loading ? (
        <p className="py-20 text-center text-sm text-muted-foreground">Ачаалж байна...</p>
      ) : tab === 'CLIENT' ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead className="border-b border-border bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Код</th>
                  <th className="px-4 py-3 font-semibold">Нэр</th>
                  <th className="px-4 py-3 font-semibold">Утас</th>
                  <th className="px-4 py-3 font-semibold">Хөнгөлөлт</th>
                  <th className="px-4 py-3 font-semibold">Байршил</th>
                  <th className="w-px whitespace-nowrap px-4 py-3 text-right font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {visibleSalons.map((c) => (
                  <tr
                    key={c.id}
                    className="group cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() => setEditSalon({ ...c })}
                  >
                    <td className="px-4 py-3.5 font-mono text-[12px] font-semibold text-slate-700 group-hover:bg-slate-50">{c.salonCode}</td>
                    <td className="max-w-[240px] px-4 py-3.5 group-hover:bg-slate-50">
                      <span className="line-clamp-1 font-medium text-slate-900">{c.salonName}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 group-hover:bg-slate-50">{c.phone || '—'}</td>
                    <td className="px-4 py-3.5 group-hover:bg-slate-50">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-slate-800">
                        {tierBadgeLabel(c.discountTier, c.discountPercent)}
                      </span>
                    </td>
                    <td className="max-w-[200px] px-4 py-3.5 text-slate-600 group-hover:bg-slate-50">
                      <span className="line-clamp-1">{placeLine(c.city, c.district)}</span>
                    </td>
                    <td className="w-px whitespace-nowrap px-4 py-3.5 text-right group-hover:bg-slate-50">
                      <RowActions
                        onEdit={() => setEditSalon({ ...c })}
                        onDelete={isDirector ? () => setDeleteTarget({ type: 'salon', item: c }) : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead className="border-b border-border bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Нэр</th>
                  <th className="px-4 py-3 font-semibold">Имэйл</th>
                  <th className="px-4 py-3 font-semibold">Утас</th>
                  <th className="px-4 py-3 font-semibold">Төлөв</th>
                  <th className="w-px whitespace-nowrap px-4 py-3 text-right font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {visibleConsumers.map((u) => {
                  const fullName = `${u.lastName ? `${u.lastName} ` : ''}${u.name}`.trim();
                  return (
                    <tr
                      key={u.id}
                      className="group cursor-pointer border-b border-slate-100 last:border-0"
                      onClick={() => setEditUser({ ...u })}
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-900 group-hover:bg-slate-50">{fullName}</td>
                      <td className="max-w-[220px] truncate px-4 py-3.5 text-slate-700 group-hover:bg-slate-50">{u.email}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 group-hover:bg-slate-50">{u.phone || '—'}</td>
                      <td className="px-4 py-3.5 group-hover:bg-slate-50">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium ${u.emailVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {u.emailVerified ? 'Баталгаажсан' : 'OTP хүлээж байна'}
                        </span>
                      </td>
                      <td className="w-px whitespace-nowrap px-4 py-3.5 text-right group-hover:bg-slate-50">
                        <RowActions
                          onEdit={() => setEditUser({ ...u })}
                          onDelete={isDirector ? () => setDeleteTarget({ type: 'consumer', item: u }) : undefined}
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
          <form onSubmit={saveSalon} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold">Харилцагч засах</h3>
            <Field label="Салон болон харилцагч">
              <Input required value={editSalon.salonName} onChange={(e) => setEditSalon({ ...editSalon, salonName: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Утас">
                <Input value={editSalon.phone} onChange={(e) => setEditSalon({ ...editSalon, phone: e.target.value })} />
              </Field>
              <Field label="Имэйл">
                <Input required type="email" value={editSalon.email} onChange={(e) => setEditSalon({ ...editSalon, email: e.target.value })} />
              </Field>
            </div>
            <CityDistrictFields
              city={editSalon.city}
              district={editSalon.district || ''}
              onChange={(next) => setEditSalon({ ...editSalon, ...next })}
            />
            <Field label="Хаяг">
              <Input value={editSalon.address} onChange={(e) => setEditSalon({ ...editSalon, address: e.target.value })} />
            </Field>
            <Field label="Хөнгөлөлт">
              <select
                value={String(editSalon.discountPercent ?? 0)}
                onChange={(e) => setEditSalon({ ...editSalon, discountPercent: Number(e.target.value) })}
                className={selectClass}
              >
                {SALON_DISCOUNT_PERCENTS.map((percent) => (
                  <option key={percent} value={percent}>{percent}%</option>
                ))}
              </select>
            </Field>
            {modalActions({ submitLabel: 'Хадгалах', saving })}
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
          <form onSubmit={addSalon} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold">Харилцагч нэмэх</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Салоны код">
                <Input required value={createSalon.salonCode} onChange={(e) => setCreateSalon({ ...createSalon, salonCode: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Хөнгөлөлт">
                <select
                  value={String(createSalon.discountPercent)}
                  onChange={(e) => setCreateSalon({ ...createSalon, discountPercent: Number(e.target.value) })}
                  className={selectClass}
                >
                  {SALON_DISCOUNT_PERCENTS.map((percent) => (
                    <option key={percent} value={percent}>{percent}%</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Салон болон харилцагч">
              <Input required value={createSalon.salonName} onChange={(e) => setCreateSalon({ ...createSalon, salonName: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Утас">
                <Input required value={createSalon.phone} onChange={(e) => setCreateSalon({ ...createSalon, phone: e.target.value })} />
              </Field>
              <Field label="Имэйл">
                <Input required type="email" value={createSalon.email} onChange={(e) => setCreateSalon({ ...createSalon, email: e.target.value })} />
              </Field>
            </div>
            <CityDistrictFields
              city={createSalon.city}
              district={createSalon.district}
              onChange={(next) => setCreateSalon({ ...createSalon, ...next })}
            />
            <Field label="Хаяг">
              <Input value={createSalon.address} onChange={(e) => setCreateSalon({ ...createSalon, address: e.target.value })} />
            </Field>
            {modalActions({ submitLabel: 'Нэмэх', saving })}
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
          <form onSubmit={saveUser} className="relative max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold">Хэрэглэгч засах</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Нэр">
                <Input required value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
              </Field>
              <Field label="Овог">
                <Input value={editUser.lastName || ''} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} />
              </Field>
            </div>
            <Field label="Имэйл">
              <Input value={editUser.email} disabled />
            </Field>
            <Field label="Утас">
              <Input value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
            </Field>
            <CityDistrictFields
              city={editUser.city || 'Улаанбаатар хот'}
              district={editUser.district || ''}
              onChange={(next) => setEditUser({ ...editUser, ...next })}
            />
            <Field label="Хаяг">
              <Input value={editUser.address || ''} onChange={(e) => setEditUser({ ...editUser, address: e.target.value })} />
            </Field>
            <Field label="Тэмдэглэл">
              <textarea
                value={editUser.notes || ''}
                onChange={(e) => setEditUser({ ...editUser, notes: e.target.value })}
                rows={2}
                className={`${selectClass} h-auto py-2`}
              />
            </Field>
            {modalActions({ submitLabel: 'Хадгалах', saving })}
          </form>
        </div>
      ) : null}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteName} бүртгэлийг устгана. Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => void confirmDelete()}>
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
