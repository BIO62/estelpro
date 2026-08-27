'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  PanelLeft,
  X,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { isNavHrefActive } from '@/lib/ad/nav-active';
import { filterNavItems, primaryNav, type NavItem } from '@/lib/ad/nav-config';
import type { PublicUser } from '@/lib/auth/types';
import { cn } from '@/lib/utils';

export const SIDEBAR_COLLAPSED = 72;
export const SIDEBAR_EXPANDED = 260;
const SIDEBAR_STORAGE_KEY = 'estel-ad-sidebar-expanded';

type AdSidebarContextValue = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  toggleExpanded: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const AdSidebarContext = React.createContext<AdSidebarContextValue | null>(null);

export function useAdSidebar() {
  const ctx = React.useContext(AdSidebarContext);
  if (!ctx) throw new Error('useAdSidebar must be used within AdSidebarProvider');
  return ctx;
}

export function AdSidebarProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const [expanded, setExpandedState] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === 'true' || stored === 'false') {
      setExpandedState(stored === 'true');
    }
    setReady(true);
  }, []);

  const setExpanded = React.useCallback((value: boolean) => {
    setExpandedState(value);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
  }, []);

  const toggleExpanded = React.useCallback(() => {
    setExpandedState((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const value = React.useMemo(
    () => ({ expanded: ready ? expanded : false, setExpanded, toggleExpanded, isMobile, mobileOpen, setMobileOpen }),
    [expanded, ready, setExpanded, toggleExpanded, isMobile, mobileOpen]
  );

  return (
    <AdSidebarContext.Provider value={value}>
      <div className={cn('ad-sidebar-shell flex min-h-svh w-full', className)}>
        {children}
      </div>
    </AdSidebarContext.Provider>
  );
}

function SidebarIcon({ name }: { name?: string }) {
  if (!name) return null;
  return <i className={cn('ad-sidebar-link__icon', name)} aria-hidden />;
}

function SidebarNavLink({
  href,
  icon,
  label,
  active,
  expanded,
  onNavigate,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  expanded: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={!expanded ? label : undefined}
      className={cn(
        'ad-sidebar-link',
        expanded ? 'ad-sidebar-link--expanded' : 'ad-sidebar-link--collapsed',
        active && 'ad-sidebar-link--active'
      )}
    >
      <SidebarIcon name={icon} />
      {expanded ? <span className="ad-sidebar-link__label">{label}</span> : null}
    </Link>
  );
}

function SidebarNavGroup({
  item,
  pathname,
  searchParams,
  expanded,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  searchParams: URLSearchParams;
  expanded: boolean;
  onNavigate?: () => void;
}) {
  const groupActive =
    item.items?.some((sub) => isNavHrefActive(sub.url, pathname, searchParams)) ?? false;
  const [open, setOpen] = React.useState(groupActive);
  React.useEffect(() => {
    setOpen(groupActive);
  }, [groupActive]);

  React.useEffect(() => {
    if (!expanded) setOpen(false);
  }, [expanded]);

  if (!item.items?.length || !item.icon) return null;

  const firstChildUrl = item.items[0]?.url;

  if (!expanded && firstChildUrl) {
    return (
      <Link
        href={firstChildUrl}
        onClick={onNavigate}
        title={item.title}
        className={cn(
          'ad-sidebar-link ad-sidebar-link--collapsed',
          groupActive && 'ad-sidebar-link--active'
        )}
      >
        <SidebarIcon name={item.icon} />
      </Link>
    );
  }

  return (
    <div className="ad-sidebar-group flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'ad-sidebar-link ad-sidebar-link--expanded ad-sidebar-link--parent',
          groupActive && 'ad-sidebar-link--active'
        )}
      >
        <SidebarIcon name={item.icon} />
        <span className="ad-sidebar-link__label">{item.title}</span>
        <ChevronDown
          className={cn(
            'ad-sidebar-link__chevron ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && open ? (
          <motion.div
            key="submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ad-sidebar-sub ml-4 flex flex-col gap-0.5 border-l border-sidebar-border py-0.5 pl-2">
              {item.items.map((sub) => (
                <Link
                  key={sub.url}
                  href={sub.url}
                  onClick={onNavigate}
                  className={cn(
                    'ad-sidebar-sublink ad-sidebar-link--expanded',
                    isNavHrefActive(sub.url, pathname, searchParams) && 'ad-sidebar-link--active'
                  )}
                >
                  {sub.icon ? <SidebarIcon name={sub.icon} /> : null}
                  <span className="ad-sidebar-link__label">{sub.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SidebarNavSection({
  label,
  items,
  expanded,
  pathname,
  searchParams,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  expanded: boolean;
  pathname: string;
  searchParams: URLSearchParams;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {expanded ? (
        <p className="ad-sidebar-section-label">{label}</p>
      ) : null}
      {items.map((item) => {
        if (item.url && !item.items?.length && item.icon) {
          return (
            <SidebarNavLink
              key={item.title}
              href={item.url}
              icon={item.icon}
              label={item.title}
              active={isNavHrefActive(item.url, pathname, searchParams)}
              expanded={expanded}
              onNavigate={onNavigate}
            />
          );
        }
        return (
          <SidebarNavGroup
            key={item.title}
            item={item}
            pathname={pathname}
            searchParams={searchParams}
            expanded={expanded}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

function SidebarBrand({ expanded, onClose }: { expanded: boolean; onClose?: () => void }) {
  return (
    <div className={cn('ad-sidebar-brand-row', onClose && 'ad-sidebar-brand-row--mobile')}>
      <Link
        href="/ad"
        onClick={onClose}
        className={cn(
          'ad-sidebar-brand',
          expanded ? 'ad-sidebar-brand--expanded' : 'ad-sidebar-brand--collapsed'
        )}
      >
        <div className="ad-sidebar-brand__logo">
          <Image
            src="/brand/logo.png"
            alt="ESTEL"
            width={20}
            height={20}
            className="size-5 object-contain brightness-0 invert"
          />
        </div>
        {expanded ? (
          <div className="ad-sidebar-brand__text min-w-0">
            <p className="ad-sidebar-brand__title">ESTEL Admin</p>
            <p className="ad-sidebar-brand__subtitle">Have a nice day!</p>
          </div>
        ) : null}
      </Link>
      {onClose ? (
        <button type="button" onClick={onClose} className="ad-mobile-nav__close" aria-label="Хаах">
          <X className="size-5" />
        </button>
      ) : null}
    </div>
  );
}

function DesktopHoverSidebarInner({ user }: { user: PublicUser | null }) {
  const { expanded } = useAdSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const visiblePrimary = React.useMemo(() => filterNavItems(primaryNav, user?.role), [user?.role]);

  return (
    <motion.aside
      className="ad-hover-sidebar sticky top-0 hidden h-svh shrink-0 flex-col md:flex"
      initial={false}
      animate={{ width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <SidebarBrand expanded={expanded} />

      <div className={cn('ad-sidebar-nav ad-sidebar-nav--scroll flex min-h-0 flex-1 flex-col gap-4', expanded ? 'px-3' : 'px-2')}>
        <SidebarNavSection
          label="Үндсэн"
          items={visiblePrimary}
          expanded={expanded}
          pathname={pathname}
          searchParams={searchParams}
        />
      </div>
    </motion.aside>
  );
}

function DesktopHoverSidebar({ user }: { user: PublicUser | null }) {
  return (
    <Suspense fallback={null}>
      <DesktopHoverSidebarInner user={user} />
    </Suspense>
  );
}

function MobileNavOverlayInner({ user }: { user: PublicUser | null }) {
  const { mobileOpen, setMobileOpen } = useAdSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const close = () => setMobileOpen(false);
  const visiblePrimary = React.useMemo(() => filterNavItems(primaryNav, user?.role), [user?.role]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobileOpen]);

  return (
    <AnimatePresence>
      {mobileOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Цэс хаах"
            className="ad-mobile-nav__backdrop fixed inset-0 z-50 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
          <motion.div
            className="ad-mobile-nav fixed inset-y-0 left-0 z-[60] flex h-svh w-full max-w-sm flex-col bg-sidebar md:hidden"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          >
            <SidebarBrand expanded onClose={close} />

            <div className="ad-sidebar-nav ad-sidebar-nav--scroll flex min-h-0 flex-1 flex-col gap-6 px-4 py-4">
              <SidebarNavSection
                label="Үндсэн"
                items={visiblePrimary}
                expanded
                pathname={pathname}
                searchParams={searchParams}
                onNavigate={close}
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function MobileNavOverlay({ user }: { user: PublicUser | null }) {
  return (
    <Suspense fallback={null}>
      <MobileNavOverlayInner user={user} />
    </Suspense>
  );
}

export function AdHoverSidebar({ user }: { user: PublicUser | null }) {
  return (
    <>
      <DesktopHoverSidebar user={user} />
      <MobileNavOverlay user={user} />
    </>
  );
}

export function AdMobileMenuTrigger({ className }: { className?: string }) {
  const { setMobileOpen } = useAdSidebar();

  return (
    <button
      type="button"
      aria-label="Цэс нээх"
      onClick={() => setMobileOpen(true)}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md text-foreground hover:bg-accent md:hidden',
        className
      )}
    >
      <Menu className="size-5" />
    </button>
  );
}

export function AdSidebarToggle({ className }: { className?: string }) {
  const { toggleExpanded } = useAdSidebar();

  return (
    <button
      type="button"
      aria-label="Sidebar нээх/хаах"
      onClick={toggleExpanded}
      className={cn(
        'ad-sidebar-toggle hidden size-9 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-accent md:inline-flex',
        className
      )}
    >
      <PanelLeft className="size-4" />
    </button>
  );
}

export function AdSidebarInset({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('ad-sidebar-inset flex min-h-svh min-w-0 flex-1 flex-col bg-background', className)}>
      {children}
    </div>
  );
}
