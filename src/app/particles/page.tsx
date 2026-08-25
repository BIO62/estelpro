'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThreeParticlesSection } from '@/components/ui/ThreeParticlesSection';
import {
  ChevronDown,
  Download,
  Sparkles,
  Sliders,
  RefreshCw,
  ArrowRight,
  Rocket
} from 'lucide-react';

export default function AntigravityParticlesPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ringWidth, setRingWidth] = useState(0.006);
  const [ringWidth2, setRingWidth2] = useState(0.107);
  const [ringDisplacement, setRingDisplacement] = useState(0.62);
  const [density, setDensity] = useState(230);
  const [particlesScale, setParticlesScale] = useState(0.59);
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className="min-h-screen relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#0E0F12',
        color: theme === 'light' ? '#1F2937' : '#F9FAFB',
        fontFamily: "'Google Sans Flex', 'Google Sans', -apple-system, sans-serif",
      }}
    >
      {/* 1. Google Antigravity Navigation Header (1:1 with Screenshot) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 h-20 pointer-events-auto bg-white/60 dark:bg-black/40 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/particles" className="flex items-center gap-2.5 no-underline">
            {/* Google Antigravity Colorful Delta Triangle Logo */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="#4285F4" fillOpacity="0.15" />
              <path d="M12 4L4 20H20L12 4Z" stroke="#4285F4" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="2.5" fill="#EA4335" />
            </svg>
            <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
              Google <span className="font-bold">Antigravity</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <span>Use Cases</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <a href="#pricing" className="hover:text-blue-600 transition-colors no-underline text-inherit">
              Pricing
            </a>
            <a href="#enterprise" className="hover:text-blue-600 transition-colors no-underline text-inherit">
              Enterprise
            </a>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>
        </div>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Live Parameters"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-neutral-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <a
            href="https://antigravity.google"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-xs font-bold shadow-sm transition-all no-underline"
          >
            <Rocket className="w-3.5 h-3.5 text-rose-400" />
            <span>Download</span>
            <Download className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </header>

      {/* 2. Full-Screen Interactive WebGL Canvas (hero-video-wrapper) */}
      <div className="hero-video-wrapper absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="hero-video-container w-full h-full" data-hero-particles="" style={{ opacity: 1 }}>
          <ThreeParticlesSection
            theme={theme}
            ringWidth={ringWidth}
            ringWidth2={ringWidth2}
            ringDisplacement={ringDisplacement}
            density={density}
            particlesScale={particlesScale}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 3. Centered Hero Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none max-w-4xl mx-auto pt-20">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/15 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Real-time Mouse Inertia Simulation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
            Agentic AI that moves at your speed
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Move your cursor across the screen to interact with 50,000+ real-time GPU accelerated particles featuring Google Antigravity physics.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 pointer-events-auto">
            <Link
              href="/ad"
              className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all no-underline"
            >
              ESTEL Admin Portal
            </Link>
            <Link
              href="/"
              className="px-7 py-3.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 backdrop-blur-xl border border-black/10 dark:border-white/20 text-slate-900 dark:text-white font-bold text-sm transition-all no-underline"
            >
              Store Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Live Parameter Tuner (Matches the exact data-attributes) */}
      {showControls && (
        <div className="fixed bottom-6 right-6 z-50 w-80 p-5 rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl text-slate-900 dark:text-white space-y-4 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold">Antigravity Attributes</span>
            </div>
            <button
              onClick={() => {
                setRingWidth(0.006);
                setRingWidth2(0.107);
                setRingDisplacement(0.62);
                setDensity(230);
                setParticlesScale(0.59);
              }}
              className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* ring-width */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">data-ring-width</span>
              <span className="font-mono font-bold text-blue-600">{ringWidth}</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={ringWidth}
              onChange={(e) => setRingWidth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* ring-width2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">data-ring-width2</span>
              <span className="font-mono font-bold text-red-500">{ringWidth2}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.005"
              value={ringWidth2}
              onChange={(e) => setRingWidth2(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* ring-displacement */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">data-ring-displacement</span>
              <span className="font-mono font-bold text-amber-500">{ringDisplacement}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.02"
              value={ringDisplacement}
              onChange={(e) => setRingDisplacement(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* density */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">data-density</span>
              <span className="font-mono font-bold text-purple-600">{density}</span>
            </div>
            <input
              type="range"
              min="100"
              max="350"
              step="10"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* particles-scale */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">data-particles-scale</span>
              <span className="font-mono font-bold text-emerald-600">{particlesScale}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={particlesScale}
              onChange={(e) => setParticlesScale(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
