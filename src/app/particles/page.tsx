'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThreeParticlesSection } from '@/components/ui/ThreeParticlesSection';
import {
  Download,
  Sparkles,
  Sliders,
  Maximize2,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function ParticlesPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [ringWidth, setRingWidth] = useState(0.15);
  const [ringWidth2, setRingWidth2] = useState(0.05);
  const [ringDisplacement, setRingDisplacement] = useState(0.23);
  const [density, setDensity] = useState(220);
  const [particlesScale, setParticlesScale] = useState(0.65);
  const [showControls, setShowControls] = useState(true);

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#090a0f' : '#f8fafc',
        fontFamily: "'Google Sans', 'Google Sans Flex', -apple-system, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between max-w-6xl mx-auto pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-lg no-underline"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>ESTEL &bull; Three.js Particle Vortex</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all shadow-lg"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Параметр тохируулагч</span>
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all shadow-lg"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Main Download Section with Exact Astro Backdrop Structure */}
      <div className="w-full max-w-6xl relative my-16">
        {/* Backdrop Container */}
        <div
          className="download-section-backdrop relative w-full h-[680px] sm:h-[760px] lg:h-[850px] overflow-hidden flex items-center justify-center shadow-2xl"
          style={{
            borderRadius: 'var(--shape-corner-xl, 36px)',
            backgroundColor: theme === 'dark' ? '#121317' : '#ffffff',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Three.js 3D WebGL Particle Component */}
          <div className="absolute inset-0 z-0">
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

          {/* Centered Interactive Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-6 pointer-events-auto">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Three.js r180 WebGL Simulation</span>
            </div>

            {/* Main Headline */}
            <h1
              className="font-bold tracking-tight text-white drop-shadow-md leading-tight"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Interactive Quantum Particle Ring
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300/90 max-w-lg mx-auto leading-relaxed">
              Real-time 40,000+ GPU accelerated particles featuring double-torus displacement, harmonic wave undulation, and 3D mouse inertia tracking.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/ad"
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 no-underline"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span>Админ удирдлага үзэх</span>
              </Link>
              <Link
                href="/"
                className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 no-underline"
              >
                <span>Үндсэн сайт</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>

            {/* Live Stats Glassmorphism Footer */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-white max-w-md mx-auto text-center">
              <div>
                <p className="text-lg font-mono font-black text-cyan-400">{Math.floor(density * 180).toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Particles Count</p>
              </div>
              <div>
                <p className="text-lg font-mono font-black text-purple-400">60 FPS</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">GPU Accelerated</p>
              </div>
              <div>
                <p className="text-lg font-mono font-black text-emerald-400">{ringDisplacement}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Displacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Live Parameter Controls (Matching Data Attributes) */}
      {showControls && (
        <div className="fixed bottom-6 right-6 z-50 w-80 p-5 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold">Data Attributes Control</span>
            </div>
            <button
              onClick={() => {
                setRingWidth(0.15);
                setRingWidth2(0.05);
                setRingDisplacement(0.23);
                setDensity(220);
                setParticlesScale(0.65);
              }}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Density (data-density="220") */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">data-density</span>
              <span className="font-mono text-cyan-400 font-bold">{density}</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Ring Displacement (data-ring-displacement="0.23") */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">data-ring-displacement</span>
              <span className="font-mono text-purple-400 font-bold">{ringDisplacement}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.01"
              value={ringDisplacement}
              onChange={(e) => setRingDisplacement(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Ring Width (data-ring-width="0.15") */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">data-ring-width</span>
              <span className="font-mono text-emerald-400 font-bold">{ringWidth}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={ringWidth}
              onChange={(e) => setRingWidth(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Particles Scale (data-particles-scale="0.65") */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400">data-particles-scale</span>
              <span className="font-mono text-amber-400 font-bold">{particlesScale}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={particlesScale}
              onChange={(e) => setParticlesScale(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
