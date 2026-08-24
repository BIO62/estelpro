'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Store } from 'lucide-react';
import { assetUrl } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo шалгалт — backend холбоход энд API дуудна
    await new Promise((r) => setTimeout(r, 600));

    if (email && password) {
      localStorage.setItem(
        'estel_admin_session',
        JSON.stringify({ name: 'Б. Мөнх-Эрдэнэ', role: 'manager', email })
      );
      router.push('/admin');
    } else {
      setError('Имэйл болон нууц үгээ бүрэн бөглөнө үү.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-scope min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Зөөлөн алтлаг декор — luxury feel */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#C9A227]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#C9A227]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#A8841B] shadow-lg shadow-[#C9A227]/20 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-5 filter brightness-0 invert" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">ESTEL Admin</h1>
          <p className="text-xs text-stone-500 mt-1">Ажилтнуудын портал руу нэвтрэх</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-900 mb-1.5">
              Имэйл
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@estelpro.mn"
                autoComplete="email"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-900 mb-1.5">
              Нууц үг
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-slate-900 transition-colors"
                aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] text-white text-sm font-bold shadow-md shadow-[#C9A227]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Нэвтрэх</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-stone-500 pt-1">
            Асуудал гарвал системийн админтай холбогдоно уу.
          </p>
        </form>

        {/* Back to store */}
        <Link
          href="/"
          target="_blank"
          className="mt-6 mx-auto w-fit flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-[#C9A227]/40 transition-all no-underline"
        >
          <Store className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Дэлгүүрийн сайт руу буцах</span>
        </Link>
      </div>
    </div>
  );
}
