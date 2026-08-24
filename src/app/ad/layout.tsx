'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Store,
  PlusCircle,
  Users,
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserPlus
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';
import type { PublicUser } from '@/lib/auth/types';

interface AdLayoutProps {
  children: React.ReactNode;
}

export default function AdLayout({ children }: AdLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data: { user?: PublicUser | null }) => {
        const next = data.user;
        if (!next || (next.role !== 'manager' && next.role !== 'operator')) {
          router.replace('/login/staff');
          return;
        }
        setUser(next);
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const blocked =
      user.role === 'operator' &&
      (pathname?.startsWith('/ad/products') || pathname?.startsWith('/ad/staff') || pathname?.startsWith('/ad/customers') || pathname?.startsWith('/ad/salons'));
    if (blocked) router.replace('/ad/orders');
  }, [user, pathname, router]);

  const navTabs = useMemo(() => {
    const all = [
      { name: 'Overview', href: '/ad', label: 'Хянах самбар', icon: LayoutDashboard, roles: ['manager', 'operator'] },
      { name: 'Products', href: '/ad/products', label: 'Бүтээгдэхүүн', icon: Package, hasDropdown: true, roles: ['manager'] },
      { name: 'Orders', href: '/ad/orders', label: 'Захиалгууд', icon: ShoppingBag, badge: '12', hasDropdown: true, roles: ['manager', 'operator'] },
      { name: 'POS', href: '/ad/create-order', label: 'Гараар захиалга (POS)', icon: PlusCircle, roles: ['manager', 'operator'] },
      { name: 'Customers', href: '/ad/customers', label: 'Харилцагчид & Салон', icon: Users, roles: ['manager'] },
      { name: 'Staff', href: '/ad/staff', label: 'Ажилтан', icon: UserPlus, roles: ['manager'] },
      { name: 'Salons', href: '/ad/salons', label: 'Салоны код', icon: Store, roles: ['manager'] },
      { name: 'Store', href: '/', label: 'Дэлгүүрийн сайт үзэх', icon: Store, isExternal: true, roles: ['manager', 'operator'] },
    ];
    return all.filter((tab) => !user || tab.roles.includes(user.role));
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased admin-scope text-sm">
      {/* 1. Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/ad" className="flex items-center gap-3.5 no-underline flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
            </div>
            <div>
              <span className="font-black text-base text-slate-900 tracking-wider uppercase block leading-none">ESTEL</span>
              <span className="text-xs text-slate-400 font-bold tracking-wide block mt-1">E-Commerce Admin</span>
            </div>
          </Link>

          {/* Search Input */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Захиалгын №, утас, бүтээгдэхүүн хайх... (⌘ + /)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right Profile & Main POS Action Button (Single Clean Placement) */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            {/* 1 Primary Action Button */}
            <Link
              href="/ad/create-order"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all no-underline"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="text-white">Шинэ захиалга бүртгэх</span>
            </Link>

            {/* Live Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live API</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {(user?.name || 'A').slice(0, 1)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || '...'}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{user?.role === 'operator' ? 'Оператор' : 'Менежер'}</p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-slate-500"
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.replace('/login/staff');
                }}
              >
                Гарах
              </button>
            </div>
          </div>
        </div>

        {/* 2. Sub-Navigation Tabs */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2">
            <nav className="flex items-center gap-2">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    data-active={isActive ? "true" : undefined}
                    target={tab.isExternal ? '_blank' : undefined}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap no-underline ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className={isActive ? 'text-white' : ''}>{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${isActive ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                        {tab.badge}
                      </span>
                    )}
                    {tab.hasDropdown && <ChevronDown className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {user ? (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      ) : (
        <div className="p-10 text-sm text-slate-500">Шалгаж байна...</div>
      )}
    </div>
  );
}
