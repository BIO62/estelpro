'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  orderDayKey,
  orderHour,
  paymentChartBucket,
  type AdOrder,
} from '@/lib/ad/orders';

const chartConfig = {
  bank: {
    label: 'Дансаар шилжүүлэх',
    theme: {
      light: '#1170b7',
      dark: '#00adb5',
    },
  },
  qpay: {
    label: 'QPay / SocialPay',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
} satisfies ChartConfig;

function isoDay(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function buildTodayData(orders: AdOrder[]) {
  const buckets = [
    { day: '09:00', hour: 9, bank: 0, qpay: 0 },
    { day: '12:00', hour: 12, bank: 0, qpay: 0 },
    { day: '15:00', hour: 15, bank: 0, qpay: 0 },
    { day: '18:00', hour: 18, bank: 0, qpay: 0 },
    { day: '21:00', hour: 21, bank: 0, qpay: 0 },
  ];
  for (const order of orders) {
    const hour = orderHour(order.date);
    let slot = buckets[0];
    for (const bucket of buckets) {
      if (hour >= bucket.hour) slot = bucket;
    }
    slot[paymentChartBucket(order.paymentMethod)] += order.total;
  }
  return buckets.map(({ day, bank, qpay }) => ({ day, bank, qpay }));
}

function buildWeekData(orders: AdOrder[]) {
  const p = (n: number) => String(n).padStart(2, '0');
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return {
      key: isoDay(d),
      day: `${p(d.getMonth() + 1)}/${p(d.getDate())}`,
      bank: 0,
      qpay: 0,
    };
  });
  for (const order of orders) {
    const slot = days.find((d) => d.key === orderDayKey(order.date));
    if (!slot) continue;
    slot[paymentChartBucket(order.paymentMethod)] += order.total;
  }
  return days.map(({ day, bank, qpay }) => ({ day, bank, qpay }));
}

export function PaymentMethodAreaChart({
  orders,
  isToday,
}: {
  orders: AdOrder[];
  isToday: boolean;
}) {
  const chartData = useMemo(
    () => (isToday ? buildTodayData(orders) : buildWeekData(orders)),
    [orders, isToday],
  );

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis hide domain={[0, 'auto']} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value) => `${Number(value).toLocaleString('mn-MN')}₮`}
            />
          }
        />
        <Area
          dataKey="qpay"
          type="monotone"
          stackId="payment"
          fill="var(--color-qpay)"
          fillOpacity={0.35}
          stroke="var(--color-qpay)"
          strokeWidth={2}
        />
        <Area
          dataKey="bank"
          type="monotone"
          stackId="payment"
          fill="var(--color-bank)"
          fillOpacity={0.45}
          stroke="var(--color-bank)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
