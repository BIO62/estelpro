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
  MoreVertical,
  Phone,
  Eye,
  ArrowUpRight,
  PackageCheck,
  User
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Mock Data for Admin Dashboard
interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  paymentMethod: 'QPay' | 'Бэлнээр' | 'SocialPay' | 'Карт' | 'Данс';
  isPaid: boolean;
  status: 'ШИНЭ' | 'БЭЛТГЭЖ_БУЙ' | 'ХҮРГЭЛТЭД' | 'ХҮРГЭГДСЭН' | 'ЦУЦЛАГДСАН';
  address: string;
  createdAt: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: '1',
    orderNumber: 'EST-9401',
    customerName: 'Э. Сарнай',
    customerPhone: '9911-2233',
    itemsCount: 3,
    total: 145000,
    paymentMethod: 'QPay',
    isPaid: true,
    status: 'ШИНЭ',
    address: 'БЗД, 1-р хороо, 12-р хороолол, 23-р байр 4 тоот',
    createdAt: '10 минутын өмнө',
  },
  {
    id: '2',
    orderNumber: 'EST-9400',
    customerName: 'Г. Бат-Ирээдүй (Салон "Beauty Lab")',
    customerPhone: '8800-5566',
    itemsCount: 12,
    total: 480000,
    paymentMethod: 'Данс',
    isPaid: true,
    status: 'БЭЛТГЭЖ_БУЙ',
    address: 'СБД, 5-р хороо, Сөүлийн гудамж, Салон 2 давхарт',
    createdAt: '45 минутын өмнө',
  },
  {
    id: '3',
    orderNumber: 'EST-9399',
    customerName: 'Т. Ариунболд',
    customerPhone: '9512-3344',
    itemsCount: 2,
    total: 58000,
    paymentMethod: 'SocialPay',
    isPaid: true,
    status: 'ХҮРГЭЛТЭД',
    address: 'ХУД, 15-р хороо, Рапид харш 14-р байр',
    createdAt: '2 цагийн өмнө',
  },
  {
    id: '4',
    orderNumber: 'EST-9398',
    customerName: 'Б. Номин-Эрдэнэ',
    customerPhone: '8090-1122',
    itemsCount: 1,
    total: 70400,
    paymentMethod: 'QPay',
    isPaid: true,
    status: 'ХҮРГЭГДСЭН',
    address: 'БГД, 3-р хороолол, 10-р байр 12 тоот',
    createdAt: 'Өчигдөр 18:30',
  },
  {
    id: '5',
    orderNumber: 'EST-9397',
    customerName: 'М. Төгөлдөр',
    customerPhone: '9191-8877',
    itemsCount: 4,
    total: 185000,
    paymentMethod: 'Бэлнээр',
    isPaid: false,
    status: 'ШИНЭ',
    address: 'СХД, 1-р хороолол 15-р байр',
    createdAt: 'Өчигдөр 16:15',
  },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('БҮГД');

  // Change Status Handler
  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = selectedStatus === 'БҮГД' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalTodaySales = orders
    .filter((o) => o.status !== 'ЦУЦЛАГДСАН')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === 'ШИНЭ' || o.status === 'БЭЛТГЭЖ_БУЙ').length;
  const shippingCount = orders.filter((o) => o.status === 'ХҮРГЭЛТЭД').length;
  const completedCount = orders.filter((o) => o.status === 'ХҮРГЭГДСЭН').length;

  return (
    <div className="space-y-8">
      {/* Top Banner with Date & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Тавтай морилно уу, Менежер 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Өнөөдрийн байдлаар нийт <strong className="text-amber-400">{orders.length} захиалга</strong> ирснээс {pendingCount} нь хүлээгдэж байна.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/create-order"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Гараар захиалга үүсгэх (POS)</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Өнөөдрийн нийт дүн</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{formatPrice(totalTodaySales)}</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Өчигдрөөс +18.4% өссөн</span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Хүлээгдэж буй</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400 mt-3">{pendingCount} захиалга</p>
          <p className="text-xs text-slate-500 mt-2">Бэлтгэх шаардлагатай байна</p>
        </div>

        {/* Card 3: In Transit */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Хүргэлтэд гарсан</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-3">{shippingCount} захиалга</p>
          <p className="text-xs text-slate-500 mt-2">Жолоочид хуваарилагдсан</p>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Хүргэгдсэн</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-3">{completedCount} захиалга</p>
          <p className="text-xs text-slate-500 mt-2">Амжилттай хүргэгдсэн</p>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Table Controls (Search + Status Tabs) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>Шинэ & Идэвхтэй Захиалгууд</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Төлөв дээр дарж шууд шилжүүлэх боломжтой
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Код, нэр, утсаар хайх..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              {['БҮГД', 'ШИНЭ', 'БЭЛТГЭЖ_БУЙ', 'ХҮРГЭЛТЭД', 'ХҮРГЭГДСЭН'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedStatus === st
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'БҮГД' ? 'Бүгд' : st === 'ШИНЭ' ? 'Шинэ' : st === 'БЭЛТГЭЖ_БУЙ' ? 'Бэлтгэж буй' : st === 'ХҮРГЭЛТЭД' ? 'Хүргэлтэд' : 'Хүргэгдсэн'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/40">
                <th className="py-3.5 px-4 rounded-l-xl">Захиалгын №</th>
                <th className="py-3.5 px-4">Захиалагч / Утас</th>
                <th className="py-3.5 px-4">Хүргэлтийн хаяг</th>
                <th className="py-3.5 px-4">Төлбөр</th>
                <th className="py-3.5 px-4">Нийт дүн</th>
                <th className="py-3.5 px-4">Төлөв солих</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Огноо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                  {/* Order ID */}
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-xs">{order.customerName}</span>
                      <a href={`tel:${order.customerPhone}`} className="text-slate-400 hover:text-amber-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-slate-300 truncate" title={order.address}>
                      {order.address}
                    </p>
                  </td>

                  {/* Payment */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{order.paymentMethod}</span>
                      {order.isPaid ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Төлсөн
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Төлөөгүй
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 font-bold text-white text-sm">
                    {formatPrice(order.total)}
                    <span className="block text-[10px] font-normal text-slate-400">
                      ({order.itemsCount} бараа)
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrder['status'])}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                        order.status === 'ШИНЭ'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : order.status === 'БЭЛТГЭЖ_БУЙ'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : order.status === 'ХҮРГЭЛТЭД'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : order.status === 'ХҮРГЭГДСЭН'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      <option value="ШИНЭ" className="bg-slate-900 text-white">Шинэ</option>
                      <option value="БЭЛТГЭЖ_БУЙ" className="bg-slate-900 text-white">Бэлтгэж буй</option>
                      <option value="ХҮРГЭЛТЭД" className="bg-slate-900 text-white">Хүргэлтэд гарсан</option>
                      <option value="ХҮРГЭГДСЭН" className="bg-slate-900 text-white">Хүргэгдсэн</option>
                      <option value="ЦУЦЛАГДСАН" className="bg-slate-900 text-white">Цуцлагдсан</option>
                    </select>
                  </td>

                  {/* Created At */}
                  <td className="py-4 px-4 text-right text-slate-400 text-[11px] whitespace-nowrap">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Тохирох захиалга олдсонгүй.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
