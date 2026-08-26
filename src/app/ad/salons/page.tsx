'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { PublicUser } from '@/lib/auth/types';
import { isLeadershipRole } from '@/lib/auth/roles';

type SalonItem = {
  id: string;
  salonCode: string;
  salonName: string;
  contactName: string;
  email: string;
  phone?: string;
};

export default function SalonCodesPage() {
  const [salons, setSalons] = useState<SalonItem[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [salonCode, setSalonCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [canManage, setCanManage] = useState(false);

  async function load() {
    const res = await fetch('/api/auth/salon?limit=40');
    const data = (await res.json()) as { salons?: SalonItem[]; error?: string };
    if (!res.ok) {
      setError(data.error || 'Хандах эрхгүй.');
      return;
    }
    setSalons(data.salons || []);
  }

  useEffect(() => {
    load();
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => setCanManage(isLeadershipRole(data.user?.role)));
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setOk('');
    const res = await fetch('/api/auth/salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, salonName, salonCode, phone }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || 'Амжилтгүй.');
      return;
    }
    setOk('Салоны код үүсгэлээ. OTP тухайн Gmail руу очно.');
    setEmail('');
    setName('');
    setSalonName('');
    setSalonCode('');
    setPhone('');
    load();
  }

  async function removeSalon(salon: SalonItem) {
    if (!window.confirm(`${salon.salonName} салоныг устгах уу?`)) return;
    setError('');
    setOk('');
    const res = await fetch('/api/auth/salon', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: salon.id }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || 'Устгаж чадсангүй.');
      return;
    }
    setOk('Салоны бүртгэлийг устгалаа.');
    load();
  }

  return (
    <div className="max-w-2xl space-y-5 text-foreground">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Салоны код өгөх</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Та өөрөө код үүсгэж салонд өгнө. Салон тухайн имэйл рүү OTP авч нэвтэрнэ.
        </p>
      </div>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {ok ? <p className="text-sm font-bold text-emerald-700">{ok}</p> : null}
      {canManage ? <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <input
          required
          value={salonCode}
          onChange={(e) => setSalonCode(e.target.value.toUpperCase())}
          placeholder="Хэрэглэгчийн код (ж: SLN-2002)"
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Холбоо барих нэр"
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <input
          required
          value={salonName}
          onChange={(e) => setSalonName(e.target.value)}
          placeholder="Салоны нэр"
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="OTP очих Gmail"
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Утас (заавал биш)"
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Код үүсгэх
        </button>
      </form> : null}
      <ul className="space-y-2">
        {salons.map((salon) => (
          <li
            key={salon.id}
            className="flex justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
          >
            <span>
              {salon.salonName} · {salon.contactName} · {salon.email}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-black tracking-wide">{salon.salonCode}</span>
              {canManage ? (
                <button type="button" onClick={() => removeSalon(salon)} className="text-rose-600" aria-label="Салон устгах">
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
