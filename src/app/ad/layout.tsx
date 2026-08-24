'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Store,
  ExternalLink,
  ShoppingBag,
  Package,
  PlusCircle,
  Users,
  LogOut
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
    { name: 'Customers', href: '/ad/customers', label: 'Харилцагчид & Салон' },
    { name: 'Store', href: '/', label: 'Дэлгүүр үзэх', isExternal: true },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased admin-scope">
      {/* 1. Main Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/ad" className="flex items-center gap-3 no-underline flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-3.5 filter brightness-0 invert" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-wide uppercase block leading-none">ESTEL</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">Admin Portal</span>
            </div>
          </Link>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Захиалга, утасны дугаар, бүтээгдэхүүн хайх... (⌘ + /)"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live API</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                М
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">Менежер</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Админ</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sub-Navigation Tabs */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-1.5">
            <nav className="flex items-center gap-1.5">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    target={tab.isExternal ? '_blank' : undefined}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap no-underline ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                        {tab.badge}
                      </span>
                    )}
                    {tab.hasDropdown && <ChevronDown className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />}
                  </Link>
                );
              })}
            </nav>

            {/* Quick POS Link */}
            <div className="hidden sm:flex items-center gap-2 pl-4">
              <Link
                href="/ad/create-order"
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors no-underline"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Шинэ захиалга бүртгэх</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Content Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
