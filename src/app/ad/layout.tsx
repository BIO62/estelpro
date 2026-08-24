'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Monitor,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  Check,
  Type
} from 'lucide-react';

interface AdLayoutProps {
  children: React.ReactNode;
}

export const ThemeContext = React.createContext({
  theme: 'default',
  brand: 'blue',
  font: 'sans',
  isDark: false,
  viewport: 'desktop',
  setViewport: (v: 'desktop' | 'mobile') => {},
  setTheme: (t: string) => {},
  setBrand: (b: string) => {},
  setFont: (f: 'sans' | 'serif' | 'mono') => {},
  setIsDark: (d: boolean) => {},
});

export default function AdLayout({ children }: AdLayoutProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState('default');
  const [brand, setBrand] = useState('blue');
  const [font, setFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isDark, setIsDark] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const themeList = [
    { id: 'default', name: 'Default', bg: 'bg-blue-600', brand: 'blue' },
    { id: 'harvest', name: 'Harvest', bg: 'bg-amber-700', brand: 'amber' },
    { id: 'retro', name: 'Retro', bg: 'bg-fuchsia-500', brand: 'fuchsia' },
    { id: 'ocean', name: 'Ocean', bg: 'bg-cyan-600', brand: 'cyan' },
    { id: 'autumn', name: 'Autumn', bg: 'bg-amber-500', brand: 'yellow' },
    { id: 'moon', name: 'Moon', bg: 'bg-stone-800', brand: 'stone' },
    { id: 'bubblegum', name: 'Bubblegum', bg: 'bg-pink-600', brand: 'pink' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600', brand: 'emerald' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-600', brand: 'rose' },
  ];

  const brandColors = [
    { id: 'red', name: 'Red', bg: 'bg-red-600' },
    { id: 'orange', name: 'Orange', bg: 'bg-orange-500' },
    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
    { id: 'yellow', name: 'Yellow', bg: 'bg-yellow-500' },
    { id: 'green', name: 'Green', bg: 'bg-green-600' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-600' },
    { id: 'blue', name: 'Blue', bg: 'bg-blue-600' },
    { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-600' },
    { id: 'violet', name: 'Violet', bg: 'bg-violet-600' },
    { id: 'purple', name: 'Purple', bg: 'bg-purple-600' },
    { id: 'fuchsia', name: 'Fuchsia', bg: 'bg-fuchsia-600' },
    { id: 'pink', name: 'Pink', bg: 'bg-pink-600' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-600' },
  ];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        brand,
        font,
        isDark,
        viewport,
        setViewport,
        setTheme,
        setBrand,
        setFont,
        setIsDark,
      }}
    >
      <div className={`min-h-screen flex flex-col font-${font} ${isDark ? 'dark bg-neutral-900 text-neutral-100' : 'bg-stone-50 text-stone-800'}`}>
        {/* ========================================================================= */}
        {/* PRELINE TEMPLATE PREVIEW TOOLBAR (Matching the code you sent 100%)       */}
        {/* ========================================================================= */}
        <div id="template-preview-toolbar" className="shrink-0 px-3 py-2 sm:px-4 lg:px-6 border-b border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-2 md:gap-4">
            {/* 1. Title & Breadcrumbs */}
            <div className="min-w-0 lg:flex lg:flex-col lg:justify-center">
              <div className="flex items-center gap-x-1.5">
                <h1 className="truncate text-sm sm:text-base font-semibold text-stone-800 dark:text-neutral-200">
                  ESTEL E-Commerce Admin
                </h1>
                <span className="text-stone-400 dark:text-neutral-600">·</span>
                <p className="block truncate text-xs sm:text-sm text-stone-500 dark:text-neutral-400">
                  Live Preview
                </p>
              </div>
              <nav className="flex items-center gap-x-1 text-xs text-stone-500 dark:text-neutral-500 mt-0.5">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 no-underline">
                  ESTEL Store
                </Link>
                <span>›</span>
                <Link href="/ad" className="hover:text-blue-600 dark:hover:text-blue-400 no-underline">
                  Dashboards & Admin
                </Link>
                <span>›</span>
                <span className="font-medium text-stone-700 dark:text-neutral-300">Preview</span>
              </nav>
            </div>

            {/* 2. Viewport Switcher (Center) */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="inline-flex items-center gap-x-1 bg-stone-100 dark:bg-neutral-800 p-1 rounded-full border border-stone-200/80 dark:border-neutral-700">
                {/* Mobile Button */}
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`inline-flex size-8 items-center justify-center rounded-full transition-all ${
                    viewport === 'mobile'
                      ? 'bg-white dark:bg-neutral-700 shadow-xs text-stone-900 dark:text-white font-bold'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900'
                  }`}
                  title="Mobile preview (430px)"
                >
                  <Smartphone className="size-4" />
                </button>

                {/* Desktop Button */}
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`inline-flex size-8 items-center justify-center rounded-full transition-all ${
                    viewport === 'desktop'
                      ? 'bg-white dark:bg-neutral-700 shadow-xs text-stone-900 dark:text-white font-bold'
                      : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900'
                  }`}
                  title="Desktop preview (Full width)"
                >
                  <Monitor className="size-4" />
                </button>

                {/* Open in New Tab Button */}
                <Link
                  href="/ad"
                  target="_blank"
                  className="inline-flex size-8 items-center justify-center rounded-full text-stone-600 dark:text-neutral-400 hover:text-stone-900 transition-all no-underline"
                  title="Open full page in new tab"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </div>

            {/* 3. Theme Selector, Fonts & Dark Mode (Right) */}
            <div className="flex items-center gap-2 justify-end">
              {/* Theme Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  className="inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-stone-800 dark:text-neutral-200 hover:bg-stone-50 dark:hover:bg-neutral-700 shadow-2xs transition-all"
                >
                  <span className={`size-3.5 rounded-sm ${themeList.find((t) => t.id === theme)?.bg || 'bg-blue-600'}`} />
                  <span className="capitalize">{theme} Themes</span>
                  <ChevronDown className="size-3 text-stone-400" />
                </button>

                {themeDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 p-3 bg-white dark:bg-neutral-800 rounded-xl border border-stone-200 dark:border-neutral-700 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <span className="block font-semibold text-xs text-stone-800 dark:text-neutral-200 mb-2">
                      Preline Themes
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {themeList.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id);
                            setBrand(t.brand);
                            setThemeDropdownOpen(false);
                          }}
                          className={`p-1.5 flex items-center gap-2 rounded-lg text-xs transition-all ${
                            theme === t.id
                              ? 'bg-stone-100 dark:bg-neutral-700 font-bold text-stone-900 dark:text-white'
                              : 'text-stone-600 dark:text-neutral-400 hover:bg-stone-50 dark:hover:bg-neutral-700/50'
                          }`}
                        >
                          <span className={`size-3.5 rounded-sm ${t.bg} flex-shrink-0`} />
                          <span className="truncate">{t.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 dark:border-neutral-700">
                      <span className="block font-semibold text-xs text-stone-800 dark:text-neutral-200 mb-2">
                        Branding Colors
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {brandColors.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setBrand(b.id);
                              setThemeDropdownOpen(false);
                            }}
                            className={`size-6 rounded-full ${b.bg} flex items-center justify-center text-white transition-transform hover:scale-110 ${
                              brand === b.id ? 'ring-2 ring-offset-2 ring-stone-900 dark:ring-white scale-110' : ''
                            }`}
                            title={b.name}
                          >
                            {brand === b.id && <Check className="size-3 stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Font Selector */}
              <select
                value={font}
                onChange={(e) => setFont(e.target.value as any)}
                className="bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 dark:text-neutral-200 focus:outline-none cursor-pointer shadow-2xs font-semibold"
              >
                <option value="sans">Aa Sans (Inter)</option>
                <option value="serif">Aa Serif (Domine)</option>
                <option value="mono">Aa Mono (Kode)</option>
              </select>

              {/* Dark / Light Toggle */}
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className="size-8 rounded-lg border border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-700 text-stone-800 dark:text-neutral-200 flex items-center justify-center shadow-2xs transition-colors"
                title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              >
                {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-stone-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PREVIEW FRAME SHELL (Responsive container for Desktop & Mobile toggle)    */}
        {/* ========================================================================= */}
        <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-x-hidden">
          <div
            className={`mx-auto transition-all duration-300 ${
              viewport === 'mobile'
                ? 'max-w-[430px] rounded-3xl border-4 border-stone-800 dark:border-neutral-700 shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 min-h-[850px]'
                : 'w-full max-w-[1400px]'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
