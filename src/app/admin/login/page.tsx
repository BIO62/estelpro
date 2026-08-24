'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Store,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@estel.mn');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'manager' | 'operator' | 'cashier'>('manager');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        router.push('/ad');
      } else {
        setError('И-мэйл эсвэл нууц үг буруу байна.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans admin-scope">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Admin Staff Sign-In Form (Dribbble Style)                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/ad" className="flex items-center gap-3 no-underline">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
                </div>
                <div>
                  <span className="font-black text-base text-slate-900 tracking-wider uppercase block leading-none">ESTEL</span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest block mt-1 uppercase">Staff & Admin</span>
                </div>
              </Link>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Portal</span>
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              {[
                { key: 'manager', label: 'Менежер' },
                { key: 'operator', label: 'Оператор' },
                { key: 'cashier', label: 'Касс / POS' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    role === r.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Header Greeting */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ажилтны нэвтрэх хэсэг
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Өөрийн нэвтрэх эрхээр системд хандана уу
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ажилтны и-мэйл</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@estel.mn"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Нууц үг</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Шалгаж байна...' : 'Системд нэвтрэх'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
            ESTEL Professional © 2026 Аюулгүй байдлын систем
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Luxury Admin Showcase Hero Panel                             */}
        {/* ========================================================================= */}
        <div className="hidden lg:block lg:col-span-6 relative p-4 bg-slate-100">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-between p-8 text-white">
            {/* Visual background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
              alt="ESTEL Pro Salon"
              className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold w-fit">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Админ удирдлагын портал</span>
            </div>

            {/* Bottom Glassmorphism Info */}
            <div className="relative z-10 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 space-y-3 shadow-2xl">
              <p className="text-base font-bold text-white leading-snug">
                ESTEL E-Commerce ERP & Sales Management
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Sylius Headless API-аар бодит цагт холбогдсон</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Салон & Хэрэглэгчийн захиалга, POS тооцоо</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
