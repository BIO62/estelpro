'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  MoreVertical,
  Phone,
  Eye,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DEMO_PRODUCTS } from '@/lib/constants';

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

const SAMPLE_ORDERS: OrderItem[] = [
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
  {
    id: '5',
    orderNumber: 'EST-9397',
    customerName: 'М. Төгөлдөр',
    customerPhone: '9191-8877',
    customerAvatar: 'Т',
    date: 'Өчигдөр, 16:10',
    total: 185000,
    paymentMethod: 'Бэлнээр',
    paymentStatus: 'Хүлээгдэж буй',
    orderStatus: 'Шинэ',
    itemsCount: 4,
  },
];

export default function AdOverviewPage() {
  const [orders, setOrders] = useState<OrderItem[]>(SAMPLE_ORDERS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');

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
    const matchesTab =
      statusTab === 'ALL' ||
      (statusTab === 'PAID' && o.paymentStatus === 'Төлөгдсөн') ||
      (statusTab === 'PENDING' && o.orderStatus === 'Шинэ') ||
      (statusTab === 'SHIPPED' && o.orderStatus === 'Хүргэлтэд') ||
      (statusTab === 'COMPLETED' && o.orderStatus === 'Хүргэгдсэн');
    return matchesSearch && matchesTab;
  });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            E-Commerce Хянах самбар
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ESTEL дэлгүүрийн өнөөдрийн нийт борлуулалт ба захиалгын тойм
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-xs">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>2026.08.24 (Өнөөдөр)</span>
          </div>
          <Link
            href="/ad/create-order"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all no-underline"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Шинэ захиалга</span>
          </Link>
        </div>
      </div>

      {/* Preline-Style KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Sales */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Нийт борлуулалт</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.5%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 font-mono tracking-tight">{formatPrice(totalSales)}</h3>
            <p className="text-xs text-gray-400 mt-1">Өмнөх 7 хоногоос өссөн</p>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Нийт захиалга</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.2%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 font-mono tracking-tight">{orders.length} захиалга</h3>
            <p className="text-xs text-gray-400 mt-1">Дундаж сагс: {formatPrice(Math.round(totalSales / orders.length))}</p>
          </div>
        </div>

        {/* Metric 3: Pending Shipments */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Бэлтгэх шаардлагатай</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-600 font-mono tracking-tight">
              {orders.filter((o) => o.orderStatus === 'Шинэ' || o.orderStatus === 'Бэлтгэж буй').length} ширхэг
            </h3>
            <p className="text-xs text-gray-400 mt-1">Хүлээгдэж буй захиалгууд</p>
          </div>
        </div>

        {/* Metric 4: Completed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Хүргэгдсэн</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/60">
              100%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 font-mono tracking-tight">
              {orders.filter((o) => o.orderStatus === 'Хүргэгдсэн').length} амжилттай
            </h3>
            <p className="text-xs text-gray-400 mt-1">Бүрэн хүргэгдэж дууссан</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Orders Table (8 cols) + Top Products (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Preline Orders Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          {/* Table Header Controls */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Сүүлийн Захиалгууд</h2>
              <p className="text-xs text-gray-500 mt-0.5">Шинээр ирсэн захиалгуудын төлөвийг шууд өөрчлөх</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              {[
                { key: 'ALL', label: 'Бүгд' },
                { key: 'PAID', label: 'Төлөгдсөн' },
                { key: 'PENDING', label: 'Шинэ' },
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

          {/* Search bar */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Захиалгын №, нэр, утсаар шүүх..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">{filteredOrders.length} илэрц</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Захиалга</th>
                  <th className="py-3 px-4">Захиалагч</th>
                  <th className="py-3 px-4">Огноо</th>
                  <th className="py-3 px-4">Төлбөр</th>
                  <th className="py-3 px-4">Дүн</th>
                  <th className="py-3 px-4">Төлөв</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs">
                          {o.customerAvatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-none">{o.customerName}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{o.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                      {o.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {o.paymentMethod} • {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                      {formatPrice(o.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderItem['orderStatus'])}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          o.orderStatus === 'Шинэ'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : o.orderStatus === 'Бэлтгэж буй'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : o.orderStatus === 'Хүргэлтэд'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
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

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link href="/ad/orders" className="text-gray-900 font-bold hover:underline">
              Бүх захиалгуудыг харах →
            </Link>
          </div>
        </div>

        {/* Right 4 Cols: Top Selling Products Card */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>Шилдэг Бүтээгдэхүүнүүд</span>
              </h2>
              <Link href="/ad/products" className="text-xs text-gray-500 hover:text-gray-900 no-underline">
                Бүгд
              </Link>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {DEMO_PRODUCTS.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://alphalabs.mn/nextstore-html/estel/${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-[11px] font-mono text-gray-500">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 font-mono whitespace-nowrap">
                    {32 - idx * 6} борлогдсон
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 text-xs text-gray-600">
            <p className="font-bold text-gray-900 mb-1">💡 Түргэн зөвлөгөө</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Захиалгын төлөвийг "Хүргэлтэд" болгоход хүргэлтийн компани руу автоматаар мэдэгдэл илгээгдэнэ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
