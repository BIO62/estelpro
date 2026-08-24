'use client';

import { useState } from 'react';
import { Users, Search, Phone, Mail, MapPin, Building, Star, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'ALL' | 'SALON' | 'RETAIL'>('ALL');

  const customers = [
    {
      id: '1',
      name: 'Г. Бат-Ирээдүй',
      type: 'SALON',
      businessName: 'Beauty Lab Salon',
      phone: '8800-5566',
      email: 'beautylab@gmail.com',
      totalSpent: 4850000,
      ordersCount: 14,
      tier: 'Гэрээт Салон (20% хөнгөлөлттэй)',
      address: 'СБД, 5-р хороо, Сөүлийн гудамж',
    },
    {
      id: '2',
      name: 'Э. Сарнай',
      type: 'RETAIL',
      businessName: 'Хувь хэрэглэгч',
      phone: '9911-2233',
      email: 'sarnai.e@gmail.com',
      totalSpent: 720000,
      ordersCount: 5,
      tier: 'VIP Хэрэглэгч (5% оноотой)',
      address: 'БЗД, 1-р хороо, 12-р хороолол',
    },
    {
      id: '3',
      name: 'Д. Цэцэгмаа',
      type: 'SALON',
      businessName: 'Glamour Hair Studio',
      phone: '9909-8877',
      email: 'glamourstudio@gmail.com',
      totalSpent: 8900000,
      ordersCount: 28,
      tier: 'Алтан Салон (20% хөнгөлөлттэй)',
      address: 'ХУД, 11-р хороо, Зайсан',
    },
  ];

  const filtered = customers.filter((c) => {
    const matchesTab = tab === 'ALL' || c.type === tab;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Салон & Хэрэглэгчдийн Бүртгэл</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Хувь хэрэглэгчид болон гэрээт мэргэжлийн үсчний салонуудын мэдээлэл
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, утас, салоноор хайх..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            {[
              { key: 'ALL', label: 'Бүгд' },
              { key: 'SALON', label: 'Гэрээт Салонууд' },
              { key: 'RETAIL', label: 'Хувь Хэрэглэгчид' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  tab === t.key
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">{c.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3" />
                      <span>{c.businessName}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      c.type === 'SALON'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {c.type === 'SALON' ? 'Салон' : 'Хувь хүн'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-3 text-xs text-slate-300 border-t border-slate-800/80 mt-3">
                  <p className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{c.address}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Нийт худалдан авалт:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">{formatPrice(c.totalSpent)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Захиалга:</span>
                  <span className="font-bold text-white">{c.ordersCount} удаа</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
