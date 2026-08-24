'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
  Users,
  Search,
  Bell,
  Menu,
  X,
  Store,
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

interface AdLayoutProps {
  children: React.ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Хянах самбар', href: '/ad', icon: LayoutDashboard },
    { name: 'Захиалгууд', href: '/ad/orders', icon: ShoppingBag, count: '12' },
    { name: 'Бүтээгдэхүүн', href: '/ad/products', icon: Package },
    { name: 'Гараар захиалга (POS)', href: '/ad/create-order', icon: PlusCircle, isNew: true },
    { name: 'Хэрэглэгчид & Салон', href: '/ad/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans flex antialiased admin-scope">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Preline-Style Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/ad" className="flex items-center gap-3 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-3 filter brightness-0 invert" />
            </div>
            <div>
              <span className="font-bold text-sm text-gray-900 tracking-wide uppercase block leading-none">ESTEL</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider block mt-1">E-Commerce Admin</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Quick Link */}
        <div className="p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/80 hover:bg-gray-100/80 text-xs font-medium text-gray-700 transition-all no-underline group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
              <span>Дэлгүүрийн сайт</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
          <div>
            <span className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Үндсэн цэс
            </span>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.count && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {item.count}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        POS
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
              М
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate leading-none">Менежер</p>
              <p className="text-[11px] text-gray-400 truncate mt-1">estelpro.mn</p>
            </div>
          </div>
          <Link href="/admin/login" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Preline-Style Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative hidden sm:block w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Захиалгын №, утас, бүтээгдэхүүн хайх..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sylius Live API Холбогдсон</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-xs">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Quick Action Button */}
            <Link
              href="/ad/create-order"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-xs transition-all no-underline"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Шинэ захиалга бүртгэх</span>
            </Link>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
