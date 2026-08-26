'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AdHoverSidebar,
  AdMobileMenuTrigger,
  AdSidebarInset,
  AdSidebarProvider,
  AdSidebarToggle,
} from '@/components/ad/ad-hover-sidebar';
import { AdThemeProvider, AdThemeToggle, useAdTheme } from '@/components/ad/ad-theme-toggle';
import { AdHeaderUser } from '@/components/ad/ad-header-user';
import { AdPageTransition } from '@/components/ad/ad-page-transition';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { PublicUser } from '@/lib/auth/types';
import { isLeadershipRole, isStaffRole } from '@/lib/auth/roles';

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
        if (!next || !isStaffRole(next.role)) {
          router.replace('/login/staff');
          return;
        }
        if (
          (pathname.startsWith('/ad/staff') || pathname.startsWith('/ad/salons')) &&
          !isLeadershipRole(next.role)
        ) {
          router.replace(next.role === 'operator' ? '/ad/orders' : '/ad');
          return;
        }
        setUser(next);
      });
  }, [pathname, router]);

  return (
    <AdThemeProvider>
      <AdLayoutShell pathname={pathname} user={user}>
        {children}
      </AdLayoutShell>
    </AdThemeProvider>
  );
}

function AdLayoutShell({
  children,
  pathname,
  user,
}: {
  children: React.ReactNode;
  pathname: string;
  user: PublicUser | null;
}) {
  const { theme, ready } = useAdTheme();

  const getBreadcrumbTitle = () => {
    if (pathname === '/ad') return 'Dashboard';
    if (pathname.match(/^\/ad\/invoices\/[^/]+$/)) return 'Нэхэмжлэл';
    if (pathname.match(/^\/ad\/orders\/[^/]+$/)) return 'Захиалгын дэлгэрэнгүй';
    if (pathname.startsWith('/ad/orders')) return 'Захиалгууд';
    if (pathname.startsWith('/ad/create-order')) return 'Шинэ захиалга бүртгэх';
    if (pathname.startsWith('/ad/users')) return 'Сайтын хэрэглэгчид';
    if (pathname.startsWith('/ad/customers')) return 'Салон & харилцагч';
    if (pathname.startsWith('/ad/salons')) return 'Салоны код';
    if (pathname.startsWith('/ad/products')) return 'Бүтээгдэхүүн';
    if (pathname.startsWith('/ad/staff')) return 'Ажилчид';
    if (pathname.startsWith('/ad/activity')) return 'Түүх';
    return 'Удирдлага';
  };

  return (
    <AdSidebarProvider
      className={cn('admin-scope min-h-svh w-full bg-background', ready && theme === 'dark' ? 'dark' : '')}
    >      <AdHoverSidebar user={user} />
      <AdSidebarInset>
        <header className="ad-shell-header sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background">
          <div className="flex h-full w-full items-center gap-2 px-4">
            <AdMobileMenuTrigger className="-ml-1 shrink-0" />
            <AdSidebarToggle className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 hidden h-4 md:block" />
            <Breadcrumb className="min-w-0 flex-1">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/ad">ESTEL Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate">{getBreadcrumbTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <AdThemeToggle />
              <AdHeaderUser user={user} />
            </div>
          </div>
        </header>
        <div className="ad-main-content flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-background p-4 md:p-6">
          <AdPageTransition>{children}</AdPageTransition>
        </div>
      </AdSidebarInset>
    </AdSidebarProvider>
  );
}
