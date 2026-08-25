'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { PublicUser, StaffRole } from '@/lib/auth/types';

export default function StaffInvitePage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('operator');
  const [temp, setTemp] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/auth/staff');
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
    setTemp('');
    const res = await fetch('/api/auth/staff/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role }),
    });
    const data = (await res.json()) as { error?: string; tempPassword?: string };
    if (!res.ok) {
      setError(data.error || 'Амжилтгүй.');
      return;
    }
    setTemp(data.tempPassword || '');
    setEmail('');
    setName('');
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Ажилтан бүртгэх</h1>
      <p className="text-sm text-slate-500 mb-6">Зөвхөн имэйлээр хаяг үүсгэнэ. Менежер / Оператор role тусдаа.</p>
      {error ? <p className="text-sm text-rose-600 font-bold mb-3">{error}</p> : null}
      {temp ? <p className="text-sm font-bold text-amber-700 mb-4">Түр нууц үг: {temp}</p> : null}
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 mb-8">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имэйл" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Нэр" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm">
          <option value="operator">Оператор</option>
          <option value="manager">Менежер</option>
        </select>
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Үүсгэх
        </button>
      </form>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm flex justify-between">
            <span>
              {user.name} · {user.email}
            </span>
            <span className="font-bold text-slate-500">{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
