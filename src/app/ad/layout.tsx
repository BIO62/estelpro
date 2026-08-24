'use client';

import { useState } from 'react';
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
  CheckCircle,
  MessageSquare,
  Gift
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

interface AdLayoutProps {
  children: React.ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  const pathname = usePathname();

  const navTabs = [
    { name: 'Overview', href: '/ad', label: 'Хянах самбар' },
    { name: 'Products', href: '/ad/products', label: 'Бүтээгдэхүүн', hasDropdown: true },
    { name: 'Orders', href: '/ad/orders', label: 'Захиалгууд', badge: '+3', hasDropdown: true },
    { name: 'POS', href: '/ad/create-order', label: 'Гараар захиалга (POS)' },
    { name: 'Customers', href: '/ad/customers', label: 'Харилцагчид' },
    { name: 'Discounts', href: '/ad/orders', label: 'Хөнгөлөлт' },
    { name: 'Store', href: '/', label: 'Дэлгүүр үзэх', isExternal: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased admin-scope">
      {/* 1. Main Top Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/ad" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-3 filter brightness-0 invert" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">estel<span className="text-blue-600">.pro</span></span>
          </Link>

          {/* Search Bar (Preline Style) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search or type a command"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-16 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-2xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                <span>⌘</span>
                <span>/</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Notifications & Profile */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notification */}
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                М
              </div>
              <span className="text-xs font-semibold text-slate-900 hidden sm:inline">Мөнх-Эрдэнэ</span>
            </div>
          </div>
        </div>

        {/* 2. Sub-Navigation (Horizontal Tabs - Exactly like Preline) */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-1">
            <nav className="flex items-center gap-1">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    target={tab.isExternal ? '_blank' : undefined}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap no-underline ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {tab.badge}
                      </span>
                    )}
                    {tab.hasDropdown && <ChevronDown className="w-3 h-3 text-slate-400" />}
                  </Link>
                );
              })}
            </nav>

            {/* Right Store Selector */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-semibold pl-4">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>ESTEL_Central_Branch</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
