'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Globe,
  Percent,
  Link2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Plus,
  ArrowRight,
  Package,
  Layers,
  CreditCard,
  Gift,
  Megaphone,
  BarChart2,
  Calendar
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdOverviewPage() {
  const [tab, setTab] = useState<'orders' | 'sales'>('orders');

  const monthlyData = [
    { month: 'Jan', inStore: 200, online: 150 },
    { month: 'Feb', inStore: 290, online: 230 },
    { month: 'Mar', inStore: 280, online: 380 },
    { month: 'Apr', inStore: 350, online: 200 },
    { month: 'May', inStore: 150, online: 170 },
    { month: 'Jun', inStore: 350, online: 290 },
    { month: 'Jul', inStore: 300, online: 160 },
    { month: 'Aug', inStore: 100, online: 110 },
    { month: 'Sep', inStore: 130, online: 300 },
    { month: 'Oct', inStore: 220, online: 230 },
    { month: 'Nov', inStore: 200, online: 120 },
    { month: 'Dec', inStore: 300, online: 150 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Greeting Section (Matching Preline exactly) */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Өглөөний мэнд, Мөнх-Эрдэнэ.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Өнөөдөр таны онлайн дэлгүүрт дараах үзүүлэлтүүд байна:
        </p>
      </div>

      {/* 2. Top 4 Metric Cards (Row 1 - Preline Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: In-store sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Салбарын борлуулалт</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 font-mono tracking-tight">7,820,750₮</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>54 захиалга</span>
            <span className="text-emerald-600 font-bold flex items-center">
              ↗ 4.3%
            </span>
          </div>
        </div>

        {/* Card 2: Website sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Онлайн веб борлуулалт</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 font-mono tracking-tight">98,593,700₮</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>218 захиалга</span>
            <span className="text-emerald-600 font-bold flex items-center">
              ↗ 12.5%
            </span>
          </div>
        </div>

        {/* Card 3: Discount */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Нийт хөнгөлөлт</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 font-mono tracking-tight">1,550,300₮</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>64 салон & хэрэглэгч</span>
          </div>
        </div>

        {/* Card 4: Affiliate / Salons */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Салон хамтрагчид</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 font-mono tracking-tight">3,982,500₮</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>24 салон</span>
            <span className="text-rose-600 font-bold flex items-center">
              ↘ 4.4%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Chart & Performance Widget (Row 2 - Preline Style) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-6 space-y-6">
        {/* Header with Date Filter & Add Activity Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">Захиалгын График (Orders)</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>25 Jul - 25 Aug</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <Link
              href="/ad/create-order"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs no-underline"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Үйл ажиллагаа нэмэх</span>
            </Link>
          </div>
        </div>

        {/* Chart Layout: 8 cols bar chart + 4 cols performance target */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Bar Chart Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 border-b border-slate-100">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* In-store Blue Bar */}
                    <div
                      style={{ height: `${(d.inStore / 400) * 100}%` }}
                      className="w-2 sm:w-3 bg-blue-600 rounded-t-sm group-hover:bg-blue-700 transition-all"
                      title={`In-store: ${d.inStore}`}
                    />
                    {/* Online Light Gray Bar */}
                    <div
                      style={{ height: `${(d.online / 400) * 100}%` }}
                      className="w-2 sm:w-3 bg-slate-200 rounded-t-sm group-hover:bg-slate-300 transition-all"
                      title={`Online: ${d.online}`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{d.month}</span>
                </div>
              ))}
            </div>

            {/* Legend at bottom */}
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-blue-600" />
                <span>Салбар (In-store)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-slate-200" />
                <span>Онлайн веб (Online)</span>
              </div>
            </div>
          </div>

          {/* Right Performance Widget (4 cols - Preline Exact Match) */}
          <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:pl-8 space-y-5">
            {/* Toggle Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-fit">
              <button
                onClick={() => setTab('orders')}
                className={`px-3 py-1 rounded-lg transition-all ${tab === 'orders' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setTab('sales')}
                className={`px-3 py-1 rounded-lg transition-all ${tab === 'sales' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'}`}
              >
                Sales
              </button>
            </div>

            {/* Big Target Number */}
            <div>
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">125,090</h3>
              {/* Progress Gauge */}
              <div className="mt-3 space-y-1.5">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[62.5%]" />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0.00</span>
                  <span>200,000</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Энэ сарын нийт борлуулалт болон төлөвлөгөөний биелэлтийн дэлгэрэнгүй тооцоолол.
              </p>
            </div>

            {/* Bottom Links */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <Link href="/ad/orders" className="flex items-center justify-between text-blue-600 font-semibold hover:underline no-underline">
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Бүх тайланг харах</span>
                </span>
                <span>›</span>
              </Link>
              <Link href="/ad/orders" className="flex items-center justify-between text-slate-600 font-semibold hover:text-slate-900 no-underline">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Борлуулалтын дэлгэрэнгүй</span>
                </span>
                <span>›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom 5 Action Cards (Row 3 - Preline Exact Match) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Action 1: Product */}
        <Link
          href="/ad/products"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Megaphone className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Бүтээгдэхүүн</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Шинэ бараа нэмэх, үнэ үлдэгдэл засах</p>
        </Link>

        {/* Action 2: Discount */}
        <Link
          href="/ad/orders"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Percent className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Хөнгөлөлт</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Салон болон VIP урамшуулал удирдах</p>
        </Link>

        {/* Action 3: Collection */}
        <Link
          href="/ad/products"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Цуглуулга & Сет</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Бэлгийн багц, багцын ангилал үүсгэх</p>
        </Link>

        {/* Action 4: Get Paid */}
        <Link
          href="/ad/orders"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Төлбөр баримт</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">QPay, SocialPay, E-Баримт шалгах</p>
        </Link>

        {/* Action 5: ESTEL Products */}
        <Link
          href="/"
          target="_blank"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:border-slate-300 hover:shadow-xs transition-all no-underline group col-span-2 sm:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">ESTEL Бүтээгдэхүүн</h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">100+ нэр төрлийн барааны дэлгүүр</p>
        </Link>
      </div>
    </div>
  );
}
