'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/cart';
import { PaymentMethodAreaChart } from '@/components/ad/payment-method-area-chart';

const PANEL_CLASS = 'rounded-xl border border-border bg-card p-5';

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  paymentStatus: 'Төлсөн' | 'Төлөөгүй';
  paymentMethod: string;
  source: string;
  date: string;
}

const INITIAL_ORDERS: RecentOrder[] = [
  {
    id: '1',
    orderNumber: '#1333222',
    customerName: 'Уранчимэг үсчин СБД 4.member 2024032',
    phone: '80600404',
    total: 302100,
    paymentStatus: 'Төлөөгүй',
    paymentMethod: 'Дансаар шилжүүлэх',
    source: 'Гараар нэмсэн',
    date: '2026 08 25 10:24',
  },
  {
    id: '2',
    orderNumber: '#1333175',
    customerName: 'Л.Долгорсүрэн Estel salon 10% 20536 Арвин салон Өвөрхангай',
    phone: '86325883 88838874',
    total: 280350,
    paymentStatus: 'Төлөөгүй',
    paymentMethod: 'Дансаар шилжүүлэх',
    source: 'Гараар нэмсэн',
    date: '2026 08 25 09:36',
  },
  {
    id: '3',
    orderNumber: '#1333003',
    customerName: 'Гандирмаа 4.member 21415',
    phone: '89722636',
    total: 254600,
    paymentStatus: 'Төлсөн',
    paymentMethod: 'Дансаар шилжүүлэх',
    source: 'Гараар нэмсэн',
    date: '2026 08 24 17:20',
  },
  {
    id: '4',
    orderNumber: '#1332986',
    customerName: 'Нандин үсчин 4.member 21292',
    phone: '88067242 99856070',
    total: 169860,
    paymentStatus: 'Төлсөн',
    paymentMethod: 'Дансаар шилжүүлэх',
    source: 'Гараар нэмсэн',
    date: '2026 08 24 16:54',
  },
  {
    id: '5',
    orderNumber: '#1332980',
    customerName: 'Glow salon Estel top salon 20% 21238',
    phone: '88078807 77555070',
    total: 264000,
    paymentStatus: 'Төлөөгүй',
    paymentMethod: 'Дансаар шилжүүлэх',
    source: 'Гараар нэмсэн',
    date: '2026 08 24 16:36',
  },
];

export default function AdOverviewPage() {
  const [period, setPeriod] = useState<'today' | 'last_7_days'>('today');
  const [orders] = useState<RecentOrder[]>(INITIAL_ORDERS);

  const isToday = period === 'today';
  const revenue = isToday ? 0 : 1270910;
  const paidCount = isToday ? 0 : 2;
  const unpaidCount = isToday ? 2 : 3;
  const totalCount = paidCount + unpaidCount;
  const avgPrice = totalCount > 0 ? Math.round(revenue / totalCount) : 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 text-foreground">
      {/* ========================================================================= */}
      {/* 1. Header Toolbar (Dashboard title + Date filters + Export)               */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex overflow-hidden rounded-lg border border-border shadow-xs">
            <button
              onClick={() => setPeriod('today')}
              className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                isToday ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Өнөөдөр
            </button>
            <button
              onClick={() => setPeriod('last_7_days')}
              className={`border-l border-border px-4 py-1.5 text-xs font-medium transition-colors ${
                !isToday ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Сүүлийн 7 хоногт
            </button>
          </div>

          <Link
            href="/ad/orders"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-xs transition-colors no-underline hover:bg-primary/90"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Захиалга Export хийх</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Top 4 Stat Cards (.dashboard-stat-card style)                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={`${PANEL_CLASS} ad-stat-card ad-stat-card--primary flex min-h-[110px] flex-col justify-between`}>
          <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            {isToday ? 'Өнөөдрийн орлого' : 'Сүүлийн 7 хоногийн орлого'}
          </div>
          <div className="my-1 flex items-baseline text-[32px] font-bold leading-none text-primary">
            <span>{revenue.toLocaleString('mn-MN')}</span>
            <span className="ml-1 text-lg font-normal text-muted-foreground">₮</span>
          </div>
        </div>

        <div className={`${PANEL_CLASS} ad-stat-card ad-stat-card--success flex min-h-[110px] flex-col justify-between`}>
          <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Захиалгын тоо (Төлсөн)
          </div>
          <div className="my-1 flex items-baseline text-[32px] font-bold leading-none text-emerald-600">
            <span>{paidCount}</span>
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({totalCount > 0 ? ((paidCount / totalCount) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>

        <div className={`${PANEL_CLASS} ad-stat-card ad-stat-card--warning flex min-h-[110px] flex-col justify-between`}>
          <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Захиалгын тоо (Төлөөгүй)
          </div>
          <div className="my-1 flex items-baseline text-[32px] font-bold leading-none text-amber-500">
            <span>{unpaidCount}</span>
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({totalCount > 0 ? ((unpaidCount / totalCount) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>

        <div className={`${PANEL_CLASS} ad-stat-card ad-stat-card--info flex min-h-[110px] flex-col justify-between`}>
          <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Дундаж захиалгын үнэ
          </div>
          <div className="my-1 flex items-baseline text-[32px] font-bold leading-none text-primary">
            <span>{avgPrice.toLocaleString('mn-MN')}</span>
            <span className="ml-1 text-lg font-normal text-muted-foreground">₮</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Сүүлийн 5 захиалга Table (1:1 GreenSoft exact table)                   */}
      {/* ========================================================================= */}
      <div className={PANEL_CLASS}>
        <div className="mb-4 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
          СҮҮЛИЙН 5 ЗАХИАЛГА
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-foreground">
                <th className="p-3">#</th>
                <th className="p-3">ХАРИЛЦАГЧ</th>
                <th className="p-3">УТАС</th>
                <th className="p-3">ДҮН</th>
                <th className="p-3">ТӨЛБӨР</th>
                <th className="p-3">ТӨЛБӨРИЙН ХЭЛБЭР</th>
                <th className="p-3">ХААНААС</th>
                <th className="p-3">ОГНОО</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13px] text-foreground">
              {orders.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-muted/40">
                  <td className="p-3 font-medium text-primary">
                    <Link href="/ad/orders" className="text-primary no-underline hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3 font-medium">{o.customerName}</td>
                  <td className="p-3 font-mono text-muted-foreground">{o.phone}</td>
                  <td className="whitespace-nowrap p-3 font-bold">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
                        o.paymentStatus === 'Төлсөн'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-400 text-foreground'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{o.paymentMethod}</td>
                  <td className="p-3 text-muted-foreground">{o.source}</td>
                  <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. Bottom 2 Panels: Төлбөрийн хэлбэрийн тайлан & Хаанаас                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`${PANEL_CLASS} flex min-h-[320px] flex-col`}>
          <div className="mb-4 border-b border-border pb-3 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Төлбөрийн хэлбэрийн тайлан ({isToday ? 'Өнөөдөр' : 'Сүүлийн 7 хоногт'})
          </div>

          <div className="flex flex-1 flex-col rounded-lg border border-border bg-muted/20 p-3">
            <PaymentMethodAreaChart isToday={isToday} />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                Дансаар шилжүүлэх
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                QPay / SocialPay
              </span>
            </div>
            <span>Нийт гүйлгээ: {isToday ? 0 : 5}</span>
          </div>
        </div>

        <div className={`${PANEL_CLASS} flex min-h-[320px] flex-col justify-between`}>
          <div className="border-b border-border pb-3 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Хаанаас ({isToday ? 'Өнөөдөр' : 'Сүүлийн 7 хоногт'})
          </div>

          <div className="my-auto space-y-4 py-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Гараар нэмсэн (POS / Менежер)</span>
                <span className="text-primary">1,270,910₮ (100%)</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Онлайн дэлгүүр (estelpro.mn)</span>
                <span className="text-muted-foreground">0₮ (0%)</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-muted-foreground/40" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-2 text-right text-xs text-muted-foreground">
            Сувгийн тоо: 2
          </div>
        </div>
      </div>
    </div>
  );
}
