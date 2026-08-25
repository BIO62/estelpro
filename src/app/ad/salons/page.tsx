'use client';

import { FormEvent, useEffect, useState } from 'react';

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
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-5">
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
      </form>
      <ul className="space-y-2">
        {salons.map((salon) => (
          <li
            key={salon.id}
            className="flex justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
          >
            <span>
              {salon.salonName} · {salon.contactName} · {salon.email}
            </span>
            <span className="font-black tracking-wide">{salon.salonCode}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
