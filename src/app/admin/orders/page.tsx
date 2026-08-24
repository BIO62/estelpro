'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Phone,
  Printer,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const orders = [
    {
      id: 'EST-9401',
      date: '2026.08.24 09:15',
      customer: 'Э. Сарнай',
      phone: '9911-2233',
      items: [
        { name: 'Honey Infused Hair Perfume', qty: 1, price: 17000 },
        { name: 'Honey Infused Hair Oil', qty: 2, price: 34000 },
        { name: 'Collagen Hair Mask', qty: 1, price: 17000 },
      ],
      total: 145000,
      payment: 'QPay (Төлөгдсөн)',
      status: 'Шинэ',
      address: 'БЗД, 1-р хороо, 12-р хороолол, 23-р байр 4 тоот',
      driver: 'Томилоогүй',
    },
    {
      id: 'EST-9400',
      date: '2026.08.24 08:30',
      customer: 'Г. Бат-Ирээдүй (Салон)',
      phone: '8800-5566',
      items: [
        { name: 'Haute Couture Будаг 60мл (8/76)', qty: 10, price: 220000 },
        { name: 'Исэлдүүлэгч 6% 1000мл', qty: 2, price: 60000 },
      ],
      total: 480000,
      payment: 'Дансаар (Баталгаажсан)',
      status: 'Бэлтгэж буй',
      address: 'СБД, 5-р хороо, Сөүлийн гудамж, Салон 2 давхарт',
      driver: 'Х. Батболд (Жолооч #3)',
    },
    {
      id: 'EST-9399',
      date: '2026.08.24 07:45',
      customer: 'Т. Ариунболд',
      phone: '9512-3344',
      items: [{ name: 'Otium Aqua Шампунь 1000мл', qty: 1, price: 58000 }],
      total: 58000,
      payment: 'SocialPay (Төлөгдсөн)',
      status: 'Хүргэлтэд гарсан',
      address: 'ХУД, 15-р хороо, Рапид харш 14-р байр',
      driver: 'М. Баярсайхан (Жолооч #1)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Захиалгын Бүртгэл & Хүргэлт</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Онлайн болон гараар бүртгэгдсэн бүх захиалгын дэлгэрэнгүй хуудас
          </p>
        </div>
      </div>

      {/* Orders List Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Захиалгын №, утас, нэрээр хайх..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Detailed Orders Card List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-amber-400 font-mono">{order.id}</span>
                  <span className="text-xs text-slate-400">{order.date}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 'Шинэ'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : order.status === 'Бэлтгэж буй'
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Хэвлэх</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Customer */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Захиалагч & Хаяг
                  </span>
                  <p className="font-bold text-white text-sm">{order.customer}</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{order.phone}</span>
                  </p>
                  <p className="text-slate-300 mt-1 leading-relaxed">{order.address}</p>
                </div>

                {/* Items */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Захиалсан бараанууд ({order.items.length})
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>• {item.name} <strong className="text-white">x{item.qty}</strong></span>
                        <span className="font-mono text-slate-400">{formatPrice(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment & Driver */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Төлбөр & Хүргэлт
                    </span>
                    <p className="text-slate-300">Төлбөр: <strong className="text-emerald-400">{order.payment}</strong></p>
                    <p className="text-slate-300 mt-0.5">Жолооч: <strong className="text-amber-400">{order.driver}</strong></p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">Нийт дүн:</span>
                    <span className="text-base font-black text-amber-400 font-mono">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
