'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Store,
  ExternalLink,
  Plus,
  ShoppingBag,
  Package,
  PlusCircle,
  Users,
  Percent,
  Link2,
  TrendingUp,
  TrendingDown,
  Globe,
  Layers,
  CreditCard,
  Gift,
  Megaphone,
  BarChart2,
  Calendar
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { assetUrl } from '@/lib/constants';
import { ThemeContext } from './layout';

export default function AdOverviewPage() {
  const { isDark, brand, viewport } = useContext(ThemeContext);
  const [tab, setTab] = useState<'orders' | 'sales'>('orders');
  const pathname = usePathname();

  const brandColorClass = {
    blue: 'bg-blue-600 text-blue-600 border-blue-600',
    amber: 'bg-amber-600 text-amber-600 border-amber-600',
    fuchsia: 'bg-fuchsia-600 text-fuchsia-600 border-fuchsia-600',
    cyan: 'bg-cyan-600 text-cyan-600 border-cyan-600',
    yellow: 'bg-yellow-500 text-yellow-500 border-yellow-500',
    stone: 'bg-stone-800 text-stone-800 border-stone-800',
    pink: 'bg-pink-600 text-pink-600 border-pink-600',
    emerald: 'bg-emerald-600 text-emerald-600 border-emerald-600',
    rose: 'bg-rose-600 text-rose-600 border-rose-600',
    red: 'bg-red-600 text-red-600 border-red-600',
    orange: 'bg-orange-500 text-orange-500 border-orange-500',
    green: 'bg-green-600 text-green-600 border-green-600',
    indigo: 'bg-indigo-600 text-indigo-600 border-indigo-600',
    violet: 'bg-violet-600 text-violet-600 border-violet-600',
    purple: 'bg-purple-600 text-purple-600 border-purple-600',
  }[brand] || 'bg-blue-600 text-blue-600 border-blue-600';

  const brandBg = brandColorClass.split(' ')[0];
  const brandText = brandColorClass.split(' ')[1];

  const navTabs = [
    { name: 'Overview', href: '/ad', label: 'Overview' },
    { name: 'Products', href: '/ad/products', label: 'Products', hasDropdown: true },
    { name: 'Orders', href: '/ad/orders', label: 'Orders', badge: '+1', hasDropdown: true },
    { name: 'Referrals', href: '/ad/customers', label: 'Referrals' },
    { name: 'Reviews', href: '/ad/customers', label: 'Reviews' },
    { name: 'Discounts', href: '/ad/orders', label: 'Discounts' },
    { name: 'Store', href: '/', label: 'Store', hasDropdown: true, isExternal: true },
    { name: 'Search', href: '/ad', label: 'Search', isNew: true },
    { name: 'Empty States', href: '/ad', label: 'Empty States' },
  ];

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
    <div className={`space-y-6 ${isDark ? 'dark bg-neutral-900 text-white' : 'bg-white text-stone-800'} rounded-2xl border border-stone-200/80 dark:border-neutral-800 overflow-hidden shadow-xs pb-10`}>
      {/* 1. Header (Inside Frame) */}
      <header className="border-b border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/ad" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg ${brandBg} flex items-center justify-center shadow-xs`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-3 filter brightness-0 invert" />
            </div>
            <span className="font-bold text-base text-stone-900 dark:text-white tracking-tight">preline<span className={brandText}>.pro</span></span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search or type a command"
                className="w-full bg-stone-50 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 rounded-xl pl-10 pr-16 py-2 text-xs text-stone-800 dark:text-white placeholder-stone-400 focus:outline-none shadow-2xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-neutral-700 border border-stone-200 dark:border-neutral-600 px-1.5 py-0.5 rounded">
                <span>⌘</span>
                <span>/</span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative p-2 rounded-xl border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 shadow-2xs">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200 dark:border-neutral-700">
              <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center">
                J
              </div>
              <span className="text-xs font-semibold text-stone-900 dark:text-white hidden md:inline">James Collison</span>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Sub-tabs */}
        <div className="border-t border-stone-100 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between overflow-x-auto py-1">
          <nav className="flex items-center gap-1">
            {navTabs.map((tabItem) => {
              const isActive = pathname === tabItem.href && tabItem.name === 'Overview';
              return (
                <Link
                  key={tabItem.name}
                  href={tabItem.href}
                  target={tabItem.isExternal ? '_blank' : undefined}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap no-underline ${
                    isActive
                      ? 'bg-stone-100 dark:bg-neutral-800 text-stone-900 dark:text-white font-bold'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <span>{tabItem.label}</span>
                  {tabItem.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {tabItem.badge}
                    </span>
                  )}
                  {tabItem.isNew && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${brandBg} text-white`}>
                      New
                    </span>
                  )}
                  {tabItem.hasDropdown && <ChevronDown className="w-3 h-3 text-stone-400" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 dark:text-neutral-400 font-semibold pl-4">
            <Store className="w-3.5 h-3.5 text-stone-400" />
            <span>GitLab_Store</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Greeting Section */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
            Good morning, James.
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* 4 Top Metric Cards (Row 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: In-store sales */}
          <div className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-neutral-400">In-store sales</span>
              <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-neutral-700 flex items-center justify-center text-stone-400 dark:text-neutral-300">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-3 font-mono tracking-tight">$7,820.75</p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400 mt-2">
              <span>5k orders</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                ↗ 4.3%
              </span>
            </div>
          </div>

          {/* Card 2: Website sales */}
          <div className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-neutral-400">Website sales</span>
              <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-neutral-700 flex items-center justify-center text-stone-400 dark:text-neutral-300">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-3 font-mono tracking-tight">$985,937.45</p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400 mt-2">
              <span>21k orders</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                ↗ 12.5%
              </span>
            </div>
          </div>

          {/* Card 3: Discount */}
          <div className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-neutral-400">Discount</span>
              <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-neutral-700 flex items-center justify-center text-stone-400 dark:text-neutral-300">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-3 font-mono tracking-tight">$15,503.00</p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400 mt-2">
              <span>6k orders</span>
            </div>
          </div>

          {/* Card 4: Affiliate */}
          <div className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 dark:text-neutral-400">Affiliate</span>
              <div className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-neutral-700 flex items-center justify-center text-stone-400 dark:text-neutral-300">
                <Link2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-3 font-mono tracking-tight">$3,982.53</p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400 mt-2">
              <span>2.4 orders</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                ↘ 4.4%
              </span>
            </div>
          </div>
        </div>

        {/* Orders Bar Chart & Target Card (Row 2) */}
        <div className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-white">Orders</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white dark:bg-neutral-700 border border-stone-200 dark:border-neutral-600 rounded-xl text-xs font-semibold text-stone-700 dark:text-neutral-200 flex items-center gap-2 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>25 Jul - 25 Aug</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 ${brandBg} text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add activity</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Monthly Bar Chart (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 border-b border-stone-100 dark:border-neutral-700">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* In-store Bar with Dynamic Brand Color */}
                      <div
                        style={{ height: `${(d.inStore / 400) * 100}%` }}
                        className={`w-2 sm:w-3 ${brandBg} rounded-t-xs transition-all`}
                        title={`In-store: ${d.inStore}`}
                      />
                      {/* Online Bar */}
                      <div
                        style={{ height: `${(d.online / 400) * 100}%` }}
                        className="w-2 sm:w-3 bg-stone-200 dark:bg-neutral-600 rounded-t-xs transition-all"
                        title={`Online: ${d.online}`}
                      />
                    </div>
                    <span className="text-[11px] text-stone-400 dark:text-neutral-400 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-neutral-400 pt-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-xs ${brandBg}`} />
                  <span>In-store</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-stone-200 dark:bg-neutral-600" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Performance Widget (4 cols) */}
            <div className="lg:col-span-4 lg:border-l lg:border-stone-100 dark:lg:border-neutral-700 lg:pl-8 space-y-5">
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-neutral-700 p-1 rounded-xl text-xs font-semibold w-fit">
                <button
                  onClick={() => setTab('orders')}
                  className={`px-3 py-1 rounded-lg transition-all ${tab === 'orders' ? 'bg-white dark:bg-neutral-800 text-stone-900 dark:text-white font-bold shadow-2xs' : 'text-stone-500 dark:text-neutral-400'}`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setTab('sales')}
                  className={`px-3 py-1 rounded-lg transition-all ${tab === 'sales' ? 'bg-white dark:bg-neutral-800 text-stone-900 dark:text-white font-bold shadow-2xs' : 'text-stone-500 dark:text-neutral-400'}`}
                >
                  Sales
                </button>
              </div>

              <div>
                <h3 className="text-3xl font-black text-stone-900 dark:text-white font-mono tracking-tight">125,090</h3>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 w-full bg-stone-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div className={`h-full ${brandBg} rounded-full w-[62.5%]`} />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-stone-400 dark:text-neutral-400">
                    <span>0.00</span>
                    <span>200,000</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 dark:text-neutral-400 mt-3 leading-relaxed">
                  A project-wise breakdown of total orders complemented by detailed insights.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-neutral-700 text-xs">
                <Link href="/ad/orders" className={`flex items-center justify-between ${brandText} font-semibold hover:underline no-underline`}>
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Show all highlights</span>
                  </span>
                  <span>›</span>
                </Link>
                <Link href="/ad/orders" className="flex items-center justify-between text-stone-600 dark:text-neutral-300 font-semibold hover:text-stone-900 no-underline">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Show all sales data</span>
                  </span>
                  <span>›</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Bottom Action Cards (Row 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            href="/ad/products"
            className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 text-center hover:border-stone-300 dark:hover:border-neutral-600 hover:shadow-xs transition-all no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-neutral-700 border border-stone-100 dark:border-neutral-600 text-stone-600 dark:text-neutral-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-stone-900 transition-colors">
              <Megaphone className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">Product</h4>
            <p className="text-[11px] text-stone-400 dark:text-neutral-400 mt-1 leading-snug">We can help to turn your great idea into a PRD</p>
          </Link>

          <Link
            href="/ad/orders"
            className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 text-center hover:border-stone-300 dark:hover:border-neutral-600 hover:shadow-xs transition-all no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-neutral-700 border border-stone-100 dark:border-neutral-600 text-stone-600 dark:text-neutral-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-stone-900 transition-colors">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">Discount</h4>
            <p className="text-[11px] text-stone-400 dark:text-neutral-400 mt-1 leading-snug">Attract new customers or reward loyal customers</p>
          </Link>

          <Link
            href="/ad/products"
            className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 text-center hover:border-stone-300 dark:hover:border-neutral-600 hover:shadow-xs transition-all no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-neutral-700 border border-stone-100 dark:border-neutral-600 text-stone-600 dark:text-neutral-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-stone-900 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">Collection</h4>
            <p className="text-[11px] text-stone-400 dark:text-neutral-400 mt-1 leading-snug">Create a new collection of products</p>
          </Link>

          <Link
            href="/ad/orders"
            className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 text-center hover:border-stone-300 dark:hover:border-neutral-600 hover:shadow-xs transition-all no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-neutral-700 border border-stone-100 dark:border-neutral-600 text-stone-600 dark:text-neutral-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-stone-900 transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">Get paid</h4>
            <p className="text-[11px] text-stone-400 dark:text-neutral-400 mt-1 leading-snug">Receive money with Preline's fast and secure payment</p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700/80 rounded-2xl p-5 text-center hover:border-stone-300 dark:hover:border-neutral-600 hover:shadow-xs transition-all no-underline group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-neutral-700 border border-stone-100 dark:border-neutral-600 text-stone-600 dark:text-neutral-200 flex items-center justify-center mx-auto mb-3 group-hover:bg-stone-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-stone-900 transition-colors">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-white">Preline products</h4>
            <p className="text-[11px] text-stone-400 dark:text-neutral-400 mt-1 leading-snug">A collection of 100+ Preline products and more</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
