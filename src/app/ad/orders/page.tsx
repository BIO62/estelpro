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
  ChevronDown,
  Download
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');

  const orders = [
    {
      id: 'EST-9401',
      date: '2026.08.24 10:15',
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
      date: '2026.08.24 09:30',
      customer: 'Г. Бат-Ирээдүй (Салон "Beauty Lab")',
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
      date: '2026.08.24 08:45',
      customer: 'Т. Ариунболд',
      phone: '9512-3344',
      items: [{ name: 'Otium Aqua Шампунь 1000мл', qty: 1, price: 58000 }],
      total: 58000,
      payment: 'SocialPay (Төлөгдсөн)',
      status: 'Хүргэлтэд',
      address: 'ХУД, 15-р хороо, Рапид харш 14-р байр',
      driver: 'М. Баярсайхан (Жолооч #1)',
    },
  ];

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesTab =
      statusTab === 'ALL' ||
      (statusTab === 'NEW' && o.status === 'Шинэ') ||
      (statusTab === 'PROCESSING' && o.status === 'Бэлтгэж буй') ||
      (statusTab === 'SHIPPED' && o.status === 'Хүргэлтэд');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Захиалгын Удирдлага
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Нийт {orders.length} захиалгын дэлгэрэнгүй хуудас ба баримт хэвлэх
          </p>
        </div>
      </div>

      {/* Orders List Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-6 space-y-6">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Захиалгын №, утас, нэрээр хайх..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { key: 'ALL', label: 'Бүгд' },
              { key: 'NEW', label: 'Шинэ' },
              { key: 'PROCESSING', label: 'Бэлтгэж буй' },
              { key: 'SHIPPED', label: 'Хүргэлтэд' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusTab(t.key)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusTab === t.key
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Cards */}
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-xl bg-gray-50/50 border border-gray-200 hover:border-gray-300 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-gray-900 font-mono">{order.id}</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      order.status === 'Шинэ'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : order.status === 'Бэлтгэж буй'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-gray-500" />
                    <span>Баримт хэвлэх</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Захиалагч & Хүргэлтийн хаяг
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                  <p className="text-gray-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-amber-600" />
                    <span>{order.phone}</span>
                  </p>
                  <p className="text-gray-600 mt-2 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200/80">
                    {order.address}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Захиалсан бараанууд ({order.items.length})
                  </span>
                  <ul className="space-y-1.5 text-gray-700">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200/80">
                        <span>• {item.name} <strong className="text-gray-900">x{item.qty}</strong></span>
                        <span className="font-mono text-gray-500 font-bold">{formatPrice(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Төлбөр & Жолооч
                    </span>
                    <p className="text-gray-700">Төлбөр: <strong className="text-emerald-700">{order.payment}</strong></p>
                    <p className="text-gray-700">Жолооч: <strong className="text-gray-900">{order.driver}</strong></p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500 font-medium">Нийт дүн:</span>
                    <span className="text-lg font-black text-gray-900 font-mono">{formatPrice(order.total)}</span>
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
