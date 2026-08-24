'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TODO: Жинхэнэ API дуудлага хийх
    // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

    // Demo logic (жинхэнэ API холбохоор сольно)
    setTimeout(() => {
      if (email === 'admin@estel.mn' && password === 'admin123') {
        router.push('/admin');
      } else {
        setError('И-мэйл эсвэл нууц үг буруу байна.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#B8921F] flex items-center justify-center shadow-lg shadow-[#C9A227]/25 mx-auto mb-4">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ESTEL</h1>
          <p className="text-[10px] font-bold text-[#A8841B] tracking-[0.3em] mt-1">ADMIN PORTAL</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Нэвтрэх</h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Админ системд хандахын тулд нэвтэрнэ үү
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">И-мэйл</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@estel.mn"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Нууц үг</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:border-[#C9A227] focus:bg-white focus:ring-2 focus:ring-[#C9A227]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-stone-300 accent-[#C9A227]"
                />
                <span>Намайг сана</span>
              </label>
              <a href="#" className="font-semibold text-[#A8841B] hover:text-[#8A6D14] transition-colors">
                Нууц үг мартсан?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#C9A227] to-[#B8921F] hover:from-[#B8921F] hover:to-[#A8841B] disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-md shadow-[#C9A227]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Нэвтэрч байна...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Нэвтрэх</span>
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl bg-[#FBF6E9] border border-[#C9A227]/20 text-[11px] text-[#8A6D14]">
            <strong>Demo:</strong> admin@estel.mn / admin123
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-xs text-stone-500 mt-6">
          Бүртгэл байхгүй юу?{' '}
          <Link href="/signup" className="font-bold text-[#A8841B] hover:text-[#8A6D14] transition-colors">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
