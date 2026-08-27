'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { formatPrice } from '@/lib/cart';
import { PaymentMethodAreaChart } from '@/components/ad/payment-method-area-chart';
import { Button } from '@/components/ui/button';
import {
  isDashboardOrder,
  listStoredOrders,
  migrateLegacyLocalOrders,
  ORDER_SOURCE_LABELS,
  PAYMENT_STATUS_LABELS,
  orderDayKey,
  orderPaidAmount,
  orderPaymentStatus,
  subscribeStoredOrders,
  type AdOrder,
} from '@/lib/ad/orders';

const PANEL_CLASS = 'rounded-xl border border-border bg-card p-5';

function isoDay(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const ONLINE_SOURCES = new Set(['web', 'api', 'mobile', 'web_form', 'chatbot']);

export default function AdOverviewPage() {
  const [period, setPeriod] = useState<'today' | 'last_7_days'>('today');
  const [all, setAll] = useState<AdOrder[]>([]);

  useEffect(() => {
    const load = async () => {
      await migrateLegacyLocalOrders();
      setAll((await listStoredOrders()).filter(isDashboardOrder));
    };
    void load();
    return subscribeStoredOrders(() => {
      void listStoredOrders().then((rows) => setAll(rows.filter(isDashboardOrder)));
    });
  }, []);

  const todayStr = isoDay(new Date());
  const weekStart = isoDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));

  const filtered = useMemo(() => {
    return all.filter((o) => {
      const day = orderDayKey(o.date);
      if (period === 'today') return day === todayStr;
      return day >= weekStart && day <= todayStr;
    });
  }, [all, period, todayStr, weekStart]);

  const isToday = period === 'today';
  const paidOrders = filtered.filter((o) => orderPaymentStatus(o) === 'paid');
  const unpaidOrders = filtered.filter((o) => orderPaymentStatus(o) === 'unpaid');
  const salesTotal = filtered.reduce((sum, o) => sum + o.total, 0);
  const collected = filtered.reduce((sum, o) => sum + orderPaidAmount(o), 0);
  const paidCount = paidOrders.length;
  const unpaidCount = unpaidOrders.length;
  const totalCount = filtered.length;
  const avgPrice = totalCount > 0 ? Math.round(salesTotal / totalCount) : 0;
  const recent = all.slice(0, 5);

  const manualTotal = filtered
    .filter((o) => !ONLINE_SOURCES.has(o.source))
    .reduce((sum, o) => sum + o.total, 0);
  const onlineTotal = filtered
    .filter((o) => ONLINE_SOURCES.has(o.source))
    .reduce((sum, o) => sum + o.total, 0);
  const channelBase = salesTotal || 1;
  const manualPct = Math.round((manualTotal / channelBase) * 100);
  const onlinePct = Math.round((onlineTotal / channelBase) * 100);

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 text-foreground">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 overflow-hidden rounded-full border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setPeriod('today')}
              className={`h-9 px-4 text-sm font-medium transition-colors ${
                isToday ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Өнөөдөр
            </button>
            <button
              type="button"
              onClick={() => setPeriod('last_7_days')}
              className={`h-9 border-l border-border px-4 text-sm font-medium transition-colors ${
                !isToday ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'
              }`}
            >
              Сүүлийн 7 хоногт
            </button>
          </div>

          <Button asChild className="h-9 rounded-full px-4 text-sm text-white ">
            <Link href="/ad/order-tools" className="no-underline">
              <Download className="size-4" />
              Захиалга Export хийх
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={`${PANEL_CLASS} ad-stat-card ad-stat-card--primary flex min-h-[110px] flex-col justify-between`}>
          <div className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            {isToday ? 'Өнөөдрийн орлого' : 'Сүүлийн 7 хоногийн орлого'}
          </div>
          <div className="my-1 flex items-baseline text-[32px] font-bold leading-none text-primary">
            <span>{salesTotal.toLocaleString('mn-MN')}</span>
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
          <div className="text-xs text-muted-foreground">{collected.toLocaleString('mn-MN')}₮</div>
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
          <div className="text-xs text-muted-foreground">
            {Math.max(0, salesTotal - collected).toLocaleString('mn-MN')}₮
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
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">
                    Захиалга алга. Шинэ захиалга үүсгэнэ үү.
                  </td>
                </tr>
              ) : (
                recent.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-muted/40">
                  <td className="p-3 font-medium text-primary">
                    <Link href={`/ad/orders/${o.id}`} className="text-primary no-underline hover:underline">
                      #{o.id}
                    </Link>
                  </td>
                  <td className="p-3 font-medium">{o.customerName}</td>
                  <td className="p-3 font-mono text-muted-foreground">{o.phone}</td>
                  <td className="whitespace-nowrap p-3 font-bold">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
                        orderPaymentStatus(o) === 'paid'
                          ? 'bg-emerald-600 text-white'
                          : orderPaymentStatus(o) === 'refunded'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-400 text-foreground'
                      }`}
                    >
                      {PAYMENT_STATUS_LABELS[orderPaymentStatus(o)]}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{o.paymentMethod || 'Дансаар шилжүүлэх'}</td>
                  <td className="p-3 text-muted-foreground">{ORDER_SOURCE_LABELS[o.source] || o.source}</td>
                  <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{o.date}</td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`${PANEL_CLASS} flex min-h-[320px] flex-col`}>
          <div className="mb-4 border-b border-border pb-3 text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
            Төлбөрийн хэлбэрийн тайлан ({isToday ? 'Өнөөдөр' : 'Сүүлийн 7 хоногт'})
          </div>

          <div className="flex flex-1 flex-col rounded-lg border border-border bg-muted/20 p-3">
            <PaymentMethodAreaChart orders={filtered} isToday={isToday} />
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
            <span>Нийт гүйлгээ: {filtered.length}</span>
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
                <span className="text-primary">
                  {manualTotal.toLocaleString('mn-MN')}₮ ({salesTotal ? manualPct : 0}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${salesTotal ? manualPct : 0}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Онлайн дэлгүүр (estelpro.mn)</span>
                <span className="text-muted-foreground">
                  {onlineTotal.toLocaleString('mn-MN')}₮ ({salesTotal ? onlinePct : 0}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground/40"
                  style={{ width: `${salesTotal ? onlinePct : 0}%` }}
                />
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
