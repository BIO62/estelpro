'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { PublicUser } from '@/lib/auth/types';

export default function SalonCodesPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [salonCode, setSalonCode] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  async function load() {
    const res = await fetch('/api/auth/salon');
    const data = (await res.json()) as { users?: PublicUser[]; error?: string };
    if (!res.ok) {
      setError(data.error || 'Хандах эрхгүй.');
      return;
    }
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setOk('');
    const res = await fetch('/api/auth/salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, salonName, salonCode }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || 'Амжилтгүй.');
      return;
    }
    setOk('Салоны код үүсгэлээ.');
    setEmail('');
    setName('');
    setSalonName('');
    setSalonCode('');
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Салоны код</h1>
      <p className="text-sm text-slate-500 mb-6">Компани өөрөө код өгч салонд нэвтрүүлэнэ. Салон OTP-оор орно.</p>
      {error ? <p className="text-sm text-rose-600 font-bold mb-3">{error}</p> : null}
      {ok ? <p className="text-sm text-emerald-700 font-bold mb-3">{ok}</p> : null}
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 mb-8">
        <input required value={salonCode} onChange={(e) => setSalonCode(e.target.value.toUpperCase())} placeholder="Хэрэглэгчийн код (ж: SLN-2002)" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Холбоо барих нэр" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input required value={salonName} onChange={(e) => setSalonName(e.target.value)} placeholder="Салоны нэр" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="OTP очих имэйл" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">
          Код үүсгэх
        </button>
      </form>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm flex justify-between gap-3">
            <span>
              {user.salonName || user.name} · {user.email}
            </span>
            <span className="font-black tracking-wide">{user.salonCode}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
