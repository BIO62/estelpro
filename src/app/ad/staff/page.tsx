'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, KeyRound, RefreshCw, Trash2, UserPlus } from 'lucide-react';
import type { PublicUser, StaffRole } from '@/lib/auth/types';
import {
  STAFF_POSITIONS,
  canDeleteStaffTarget,
  canInviteDirectors,
  positionLabel,
  roleLabel,
} from '@/lib/auth/roles';

function makeTempPassword() {
  return `Estel${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function StaffInvitePage() {
  const router = useRouter();
  const [me, setMe] = useState<PublicUser | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('operator');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [temp, setTemp] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const ownerCount = useMemo(() => users.filter((user) => user.role === 'owner').length, [users]);
  const canAddDirector = canInviteDirectors(me?.role);

  async function load() {
    const [meRes, staffRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/auth/staff')]);
    const meData = (await meRes.json()) as { user?: PublicUser | null };
    const data = (await staffRes.json()) as { users?: PublicUser[]; error?: string };
    setMe(meData.user || null);
    if (!staffRes.ok) {
      setAllowed(false);
      setError(data.error || 'Хандах эрхгүй.');
      return;
    }
    setAllowed(true);
    setUsers(data.users || []);
  }

  async function removeUser(user: PublicUser) {
    const self = user.id === me?.id;
    const ok = window.confirm(
      self ? 'Өөрийн бүртгэлийг устгах уу? Системээс гарна.' : `${user.name} ажилтны бүртгэлийг устгах уу?`,
    );
    if (!ok) return;
    setError('');
    const res = await fetch('/api/auth/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    });
    const data = (await res.json()) as { error?: string; self?: boolean };
    if (!res.ok) {
      setError(data.error || 'Устгаж чадсангүй.');
      return;
    }
    if (data.self) {
      router.replace('/login/staff');
      return;
    }
    load();
  }

  async function copyPassword(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  useEffect(() => {
    setPassword(makeTempPassword());
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setTemp('');
    const res = await fetch('/api/auth/staff/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role, position, password }),
    });
    const data = (await res.json()) as { error?: string; tempPassword?: string };
    if (!res.ok) {
      setError(data.error || 'Амжилтгүй.');
      return;
    }
    setTemp(data.tempPassword || password);
    setEmail('');
    setName('');
    setPosition('');
    setPassword(makeTempPassword());
    load();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Ажилтан бүртгэх</h1>
        <p className="mt-1 text-sm text-slate-500">Системийн эрх болон албан тушаалыг тусад нь удирдана.</p>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      {temp ? (
        <div className="mb-5 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <KeyRound className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-amber-900">Түр нууц үг үүслээ</p>
            <p className="mt-0.5 text-xs text-amber-800/80">Ажилтанд энэ нууц үгийг нэг удаа өгнө үү.</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl bg-white px-3 py-2.5 font-mono text-base font-bold tracking-wide text-slate-900">
                {temp}
              </code>
              <button
                type="button"
                onClick={() => copyPassword(temp)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-50"
                aria-label="Хуулах"
              >
                {copied ? <Check className="h-5 w-5" strokeWidth={2.2} /> : <Copy className="h-5 w-5" strokeWidth={2.2} />}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {allowed ? (
        <form onSubmit={onSubmit} className="mb-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Имэйл</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@estel.mn"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Нэр</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ажилтны нэр"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Системийн эрх</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="operator">Оператор</option>
                <option value="manager">Менежер</option>
                {canAddDirector ? <option value="director">Захирал</option> : null}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Албан тушаал</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Сонгох</option>
                {STAFF_POSITIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
              <KeyRound className="h-5 w-5" strokeWidth={2} />
              Түр нууц үг
            </div>
            <p className="mb-3 text-xs leading-5 text-slate-500">Автоматаар үүсгэнэ. Шаардлагатай бол солиод хуулна.</p>
            <div className="flex items-center gap-2">
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm font-semibold tracking-wide outline-none focus:border-slate-400"
              />
              <button
                type="button"
                onClick={() => setPassword(makeTempPassword())}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                aria-label="Дахин үүсгэх"
              >
                <RefreshCw className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => copyPassword(password)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                aria-label="Хуулах"
              >
                {copied ? <Check className="h-5 w-5" strokeWidth={2.2} /> : <Copy className="h-5 w-5" strokeWidth={2.2} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <UserPlus className="h-5 w-5" strokeWidth={2.2} />
            Үүсгэх
          </button>
        </form>
      ) : null}

      <ul className="space-y-2">
        {users.map((user) => {
          const canDelete = me ? canDeleteStaffTarget(me, user, ownerCount) : false;
          const title = positionLabel(user.position);
          return (
            <li
              key={user.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
                {title ? <p className="mt-0.5 truncate text-xs text-slate-400">{title}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {roleLabel(user.role)}
                </span>
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => removeUser(user)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                    aria-label={user.id === me?.id ? 'Өөрийгөө устгах' : 'Ажилтан устгах'}
                  >
                    <Trash2 className="h-5 w-5" strokeWidth={2.2} />
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
