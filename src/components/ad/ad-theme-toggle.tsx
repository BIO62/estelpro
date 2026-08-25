'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'estel-ad-theme';

export type AdTheme = 'light' | 'dark';

type AdThemeContextValue = {
  theme: AdTheme;
  toggle: () => void;
  ready: boolean;
};

const AdThemeContext = createContext<AdThemeContextValue | null>(null);

export function AdThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdTheme>('light');
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdTheme | null;
    const initial =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    setTheme(initial);
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    document.body.classList.toggle('ad-dark-body', theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    return () => {
      document.body.classList.remove('ad-dark-body');
      document.documentElement.classList.remove('dark');
    };
  }, [theme, ready]);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <AdThemeContext.Provider value={{ theme, toggle, ready }}>{children}</AdThemeContext.Provider>
  );
}

export function useAdTheme() {
  const ctx = useContext(AdThemeContext);
  if (!ctx) throw new Error('useAdTheme must be used within AdThemeProvider');
  return ctx;
}

export function AdThemeToggle() {
  const { theme, toggle, ready } = useAdTheme();

  if (!ready) {
    return <div className="size-8 shrink-0" aria-hidden />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="ad-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Гэрэл горим руу шилжих' : 'Харанхуй горим руу шилжих'}
      title={isDark ? 'Гэрэл горим' : 'Харанхуй горим'}
    >
      {isDark ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
    </button>
  );
}
