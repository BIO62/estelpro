'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

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

const LAST_7_DAYS_DATA = [
  { day: '08/19', bank: 142000, qpay: 38000 },
  { day: '08/20', bank: 98000, qpay: 52000 },
  { day: '08/21', bank: 176000, qpay: 41000 },
  { day: '08/22', bank: 124000, qpay: 28000 },
  { day: '08/23', bank: 89000, qpay: 67000 },
  { day: '08/24', bank: 201000, qpay: 43000 },
  { day: '08/25', bank: 171910, qpay: 0 },
];

const TODAY_DATA = [
  { day: '09:00', bank: 0, qpay: 0 },
  { day: '12:00', bank: 0, qpay: 0 },
  { day: '15:00', bank: 0, qpay: 0 },
  { day: '18:00', bank: 0, qpay: 0 },
];

export function PaymentMethodAreaChart({ isToday }: { isToday: boolean }) {
  const chartData = isToday ? TODAY_DATA : LAST_7_DAYS_DATA;

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
