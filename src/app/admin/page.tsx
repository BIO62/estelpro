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
  Phone,
  ArrowUpRight
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
    <div className="space-y-6">
      {/* Top Banner with Date & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Тавтай морилно уу, Менежер 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Өнөөдрийн байдлаар нийт <strong className="text-slate-900">{orders.length} захиалга</strong> ирснээс {pendingCount} нь хүлээгдэж байна.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/create-order"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all no-underline"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Гараар захиалга үүсгэх (POS)</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Өнөөдрийн нийт дүн</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">{formatPrice(totalTodaySales)}</p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Өчигдрөөс +18.4% өссөн</span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Хүлээгдэж буй</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{pendingCount} захиалга</p>
          <p className="text-xs text-slate-400 mt-1.5">Бэлтгэх шаардлагатай</p>
        </div>

        {/* Card 3: In Transit */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Хүргэлтэд гарсан</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">{shippingCount} захиалга</p>
          <p className="text-xs text-slate-400 mt-1.5">Жолоочид хуваарилагдсан</p>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Хүргэгдсэн</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{completedCount} захиалга</p>
          <p className="text-xs text-slate-400 mt-1.5">Амжилттай хүргэгдсэн</p>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Table Controls (Search + Status Tabs) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Шинэ & Идэвхтэй Захиалгууд</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Төлөв дээр дарж шууд шилжүүлэх боломжтой
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Код, нэр, утсаар хайх..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              {['БҮГД', 'ШИНЭ', 'БЭЛТГЭЖ_БУЙ', 'ХҮРГЭЛТЭД', 'ХҮРГЭГДСЭН'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedStatus === st
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
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
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-50">
                <th className="py-3 px-4 rounded-l-lg">Захиалгын №</th>
                <th className="py-3 px-4">Захиалагч / Утас</th>
                <th className="py-3 px-4">Хүргэлтийн хаяг</th>
                <th className="py-3 px-4">Төлбөр</th>
                <th className="py-3 px-4">Нийт дүн</th>
                <th className="py-3 px-4">Төлөв солих</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Огноо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-xs">{order.customerName}</span>
                      <a href={`tel:${order.customerPhone}`} className="text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-0.5 no-underline">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>{order.customerPhone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 truncate" title={order.address}>
                      {order.address}
                    </p>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">{order.paymentMethod}</span>
                      {order.isPaid ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Төлсөн
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Төлөөгүй
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-xs font-mono">
                    {formatPrice(order.total)}
                    <span className="block text-[10px] font-normal text-slate-400">
                      ({order.itemsCount} бараа)
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrder['status'])}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                        order.status === 'ШИНЭ'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : order.status === 'БЭЛТГЭЖ_БУЙ'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : order.status === 'ХҮРГЭЛТЭД'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : order.status === 'ХҮРГЭГДСЭН'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="ШИНЭ">Шинэ</option>
                      <option value="БЭЛТГЭЖ_БУЙ">Бэлтгэж буй</option>
                      <option value="ХҮРГЭЛТЭД">Хүргэлтэд гарсан</option>
                      <option value="ХҮРГЭГДСЭН">Хүргэгдсэн</option>
                      <option value="ЦУЦЛАГДСАН">Цуцлагдсан</option>
                    </select>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-right text-slate-400 text-[11px] whitespace-nowrap">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <AlertCircle className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
              <p>Тохирох захиалга олдсонгүй.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
