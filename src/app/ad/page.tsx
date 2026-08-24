'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Globe,
  Percent,
  Link2,
  TrendingUp,
  ChevronDown,
  Plus,
  ArrowRight,
  Package,
  Layers,
  CreditCard,
  Gift,
  Megaphone,
  BarChart2,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  PlusCircle,
  Phone
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  date: string;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Төлөгдсөн' | 'Хүлээгдэж буй';
  orderStatus: 'Шинэ' | 'Бэлтгэж буй' | 'Хүргэлтэд' | 'Хүргэгдсэн';
  itemsCount: number;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: '1',
    orderNumber: 'EST-9401',
    customerName: 'Э. Сарнай',
    customerPhone: '9911-2233',
    customerAvatar: 'С',
    date: 'Өнөөдөр, 10:24',
    total: 145000,
    paymentMethod: 'QPay',
    paymentStatus: 'Төлөгдсөн',
    orderStatus: 'Шинэ',
    itemsCount: 3,
  },
  {
    id: '2',
    orderNumber: 'EST-9400',
    customerName: 'Г. Бат-Ирээдүй (Beauty Lab)',
    customerPhone: '8800-5566',
    customerAvatar: 'Б',
    date: 'Өнөөдөр, 09:45',
    total: 480000,
    paymentMethod: 'Дансаар',
    paymentStatus: 'Төлөгдсөн',
    orderStatus: 'Бэлтгэж буй',
    itemsCount: 12,
  },
  {
    id: '3',
    orderNumber: 'EST-9399',
    customerName: 'Т. Ариунболд',
    customerPhone: '9512-3344',
    customerAvatar: 'А',
    date: 'Өнөөдөр, 08:15',
    total: 58000,
    paymentMethod: 'SocialPay',
    paymentStatus: 'Төлөгдсөн',
    orderStatus: 'Хүргэлтэд',
    itemsCount: 2,
  },
  {
    id: '4',
    orderNumber: 'EST-9398',
    customerName: 'Б. Номин-Эрдэнэ',
    customerPhone: '8090-1122',
    customerAvatar: 'Н',
    date: 'Өчигдөр, 18:30',
    total: 70400,
    paymentMethod: 'QPay',
    paymentStatus: 'Төлөгдсөн',
    orderStatus: 'Хүргэгдсэн',
    itemsCount: 1,
  },
];

export default function AdOverviewPage() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [tab, setTab] = useState<'orders' | 'sales'>('orders');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const monthlyData = [
    { month: '1-р сар', inStore: 220, online: 180 },
    { month: '2-р сар', inStore: 290, online: 240 },
    { month: '3-р сар', inStore: 310, online: 380 },
    { month: '4-р сар', inStore: 350, online: 260 },
    { month: '5-р сар', inStore: 190, online: 220 },
    { month: '6-р сар', inStore: 360, online: 310 },
    { month: '7-р сар', inStore: 320, online: 240 },
    { month: '8-р сар', inStore: 180, online: 190 },
    { month: '9-р сар', inStore: 240, online: 320 },
    { month: '10-р сар', inStore: 280, online: 290 },
    { month: '11-р сар', inStore: 260, online: 210 },
    { month: '12-р сар', inStore: 340, online: 280 },
  ];

  const handleStatusChange = (id: string, newStatus: OrderItem['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesFilter =
      statusFilter === 'ALL' ||
      (statusFilter === 'NEW' && o.orderStatus === 'Шинэ') ||
      (statusFilter === 'PROCESSING' && o.orderStatus === 'Бэлтгэж буй') ||
      (statusFilter === 'SHIPPED' && o.orderStatus === 'Хүргэлтэд');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* 1. Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Өдрийн мэнд, Менежер.
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            ESTEL онлайн дэлгүүр болон салбарын өнөөдрийн нийт борлуулалтын тойм
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>2026.08.24 (Өнөөдөр)</span>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Салбарын борлуулалт</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">7,820,750₮</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-semibold">
              <span>54 захиалга</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ↗ +4.3% өссөн
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Веб Онлайн борлуулалт</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">98,593,700₮</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-semibold">
              <span>218 захиалга</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ↗ +12.5% өссөн
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Нийт хөнгөлөлт</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">1,550,300₮</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-semibold">
              <span>64 салон & VIP хэрэглэгчид</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Гэрээт Салонууд</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Link2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">3,982,500₮</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-semibold">
              <span>24 салон</span>
              <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                ↘ -4.4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Orders Chart & Progress Card (Fixed Bar Heights) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Борлуулалтын Сарын Харьцуулалт</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Салбарын болон Онлайн захиалгын өсөлтийн хөдөлгөөн</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>2026 Он (Сар бүрээр)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Bar Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4 border-b border-slate-200 pb-2">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full h-44 flex items-end justify-center gap-1.5">
                    {/* In-store Bar */}
                    <div
                      style={{ height: `${(d.inStore / 400) * 100}%` }}
                      className="w-2.5 sm:w-3.5 bg-blue-600 rounded-t-sm group-hover:bg-blue-700 transition-all min-h-[16px] shadow-xs"
                      title={`Салбар: ${d.inStore}`}
                    />
                    {/* Online Bar */}
                    <div
                      style={{ height: `${(d.online / 400) * 100}%` }}
                      className="w-2.5 sm:w-3.5 bg-slate-200 rounded-t-sm group-hover:bg-slate-300 transition-all min-h-[16px]"
                      title={`Онлайн: ${d.online}`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold tracking-tight">{d.month}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-blue-600" />
                <span>Салбар (In-store)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-slate-200" />
                <span>Онлайн веб (Online)</span>
              </div>
            </div>
          </div>

          {/* Performance Widget (4 cols) */}
          <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:pl-8 space-y-5">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
              <button
                onClick={() => setTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${tab === 'orders' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'}`}
              >
                Захиалга
              </button>
              <button
                onClick={() => setTab('sales')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${tab === 'sales' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'}`}
              >
                Борлуулалт
              </button>
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">125,090</h3>
              <div className="mt-3 space-y-1.5">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[62.5%]" />
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400 font-bold">
                  <span>0.00</span>
                  <span>200,000</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">
                Энэ сарын нийт борлуулалтын төлөвлөгөөний биелэлт 62.5% байна.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <Link href="/ad/orders" className="flex items-center justify-between text-blue-600 font-bold hover:underline no-underline">
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Бүх захиалгын тайлан харах</span>
                </span>
                <span>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Сүүлийн Захиалгууд</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Шинээр ирсэн захиалгуудын төлөвийг шууд өөрчлөх</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Захиалгын №, утсаар хайх..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Захиалга</th>
                <th className="py-3.5 px-4">Захиалагч</th>
                <th className="py-3.5 px-4">Огноо</th>
                <th className="py-3.5 px-4">Төлбөр</th>
                <th className="py-3.5 px-4">Дүн</th>
                <th className="py-3.5 px-4">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900 text-sm">
                    {o.orderNumber}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {o.customerAvatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight text-sm">{o.customerName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{o.customerPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap font-medium">
                    {o.date}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {o.paymentMethod} • {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900 font-mono text-sm">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderItem['orderStatus'])}
                      className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${
                        o.orderStatus === 'Шинэ'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : o.orderStatus === 'Бэлтгэж буй'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : o.orderStatus === 'Хүргэлтэд'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <option value="Шинэ">Шинэ</option>
                      <option value="Бэлтгэж буй">Бэлтгэж буй</option>
                      <option value="Хүргэлтэд">Хүргэлтэд</option>
                      <option value="Хүргэгдсэн">Хүргэгдсэн</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link
          href="/ad/products"
          className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Megaphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Бүтээгдэхүүн</h4>
          <p className="text-xs text-slate-400 mt-1 leading-snug">Шинэ бараа нэмэх, үлдэгдэл засах</p>
        </Link>

        <Link
          href="/ad/orders"
          className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Percent className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Хөнгөлөлт</h4>
          <p className="text-xs text-slate-400 mt-1 leading-snug">Салон болон VIP урамшуулал</p>
        </Link>

        <Link
          href="/ad/products"
          className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Багц & Сет</h4>
          <p className="text-xs text-slate-400 mt-1 leading-snug">Бэлгийн багц үүсгэх</p>
        </Link>

        <Link
          href="/ad/orders"
          className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Төлбөр тооцоо</h4>
          <p className="text-xs text-slate-400 mt-1 leading-snug">QPay, Дансны баримт</p>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group col-span-2 sm:col-span-1"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">ESTEL Дэлгүүр</h4>
          <p className="text-xs text-slate-400 mt-1 leading-snug">Үндсэн веб сайт үзэх</p>
        </Link>
      </div>
    </div>
  );
}
