'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Package,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Store,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<{ name: string; role: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('estel_admin_session');
      if (stored) {
        try {
          setSession(JSON.parse(stored));
        } catch {
          setSession({ name: 'Б. Мөнх-Эрдэнэ (Менежер)', role: 'manager', email: 'manager@estelpro.mn' });
        }
      } else {
        setSession({ name: 'Б. Мөнх-Эрдэнэ (Менежер)', role: 'manager', email: 'manager@estelpro.mn' });
      }
    }
  }, []);

  // If on login page, don't show admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Хянах самбар', href: '/admin', icon: LayoutDashboard },
    { label: 'Захиалгууд', href: '/admin/orders', icon: ShoppingBag, badge: '5 шинэ' },
    { label: 'Гараар захиалга (POS)', href: '/admin/create-order', icon: PlusCircle, highlight: true },
    { label: 'Бүтээгдэхүүн & Үлдэгдэл', href: '/admin/products', icon: Package },
    { label: 'Салон & Хэрэглэгчид', href: '/admin/customers', icon: Users },
    { label: 'Тохиргоо', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('estel_admin_session');
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans admin-scope">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Branding */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-3 filter brightness-0 invert" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 tracking-wider uppercase block">ESTEL ADMIN</span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider block">Staff Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Online Store Link */}
        <div className="px-3 pt-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-all group no-underline"
          >
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Дэлгүүрийн сайт үзэх</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all no-underline ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm font-bold'
                    : item.highlight
                    ? 'bg-amber-50 text-amber-900 hover:bg-amber-100/70 border border-amber-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 mb-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              {session?.name?.charAt(0) || 'А'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-snug">{session?.name || 'Ажилтан'}</p>
              <p className="text-[10px] text-slate-500 truncate">{session?.email || 'manager@estelpro.mn'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
          >
            <LogOut className="w-3 h-3" />
            <span>Гарах</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Захиалга, утас, нэрээр хайх..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sylius Live API Холбогдсон</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </button>

            {/* Quick Action */}
            <Link
              href="/admin/create-order"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all no-underline"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Шинэ захиалга</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
