'use client';

import { useState } from 'react';
import { Users, Search, Phone, Mail, MapPin, Building, Star, CheckCircle, ArrowUpDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdCustomersPage() {
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
      tier: 'Гэрээт Салон (20%)',
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
      tier: 'VIP Хэрэглэгч (5%)',
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
      tier: 'Алтан Салон (20%)',
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Хэрэглэгчид & Салоны Бүртгэл
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Хувь худалдан авагчид болон гэрээт мэргэжлийн үсчний салонуудын мэдээлэл
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, утас, салоноор хайх..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
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
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-gray-50/50 border border-gray-200 hover:border-gray-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-gray-600 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-amber-500" />
                      <span>{c.businessName}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      c.type === 'SALON'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {c.type === 'SALON' ? 'Салон' : 'Хувь хүн'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-3 text-xs text-gray-600 border-t border-gray-200/80 mt-3">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{c.address}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">Нийт худалдан авалт:</span>
                  <span className="font-mono font-black text-gray-900 text-sm">{formatPrice(c.totalSpent)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Захиалга:</span>
                  <span className="font-bold text-gray-900">{c.ordersCount} удаа</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
