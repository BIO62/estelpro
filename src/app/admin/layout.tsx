'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ShoppingCart,
  Bell,
  Plus,
  LogOut,
  Store
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Ерөнхий мэдээ', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Дэлгүүрийн захиалга үзэх', icon: ShoppingBag },
  { href: '/admin/products', label: 'Бүтээгдэхүүн & Үлдэгдэл', icon: Package },
  { href: '/admin/customers', label: 'Салон & Хэрэглэгчид', icon: Users },
  { href: '/admin/pos', label: 'Гараар захиалга (POS)', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-stone-200 flex flex-col z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#B8921F] flex items-center justify-center shadow-md shadow-[#C9A227]/25">
              <Store className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">ESTEL</p>
              <p className="text-[10px] font-bold text-[#A8841B] tracking-[0.2em]">ADMIN PORTAL</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#FBF6E9] text-[#8A6D14] border border-[#C9A227]/30 shadow-sm'
                    : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#A8841B]' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-stone-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Гарах</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-200">
          <div className="flex items-center justify-between px-8 py-3.5">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Link href="/admin" className="hover:text-[#A8841B] font-semibold transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">
                {NAV_ITEMS.find((i) => i.href === pathname)?.label ?? 'Хуудас'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sylius Live API Холбогдсон
              </span>

              <button className="relative p-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-600 hover:text-[#A8841B] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] text-white text-xs font-bold shadow-md shadow-[#C9A227]/25 flex items-center gap-1.5 transition-all">
                <Plus className="w-3.5 h-3.5" />
                Шинэ захиалга
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
