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
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Satellite
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'manager' | 'operator'>('manager');
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
    <div className="min-h-screen flex admin-scope" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ================================================================== */}
      {/* LEFT SIDE: Dark Cosmic Visual Panel (Orion Style)                  */}
      {/* ================================================================== */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#0F1729] overflow-hidden flex-col justify-between p-10 xl:p-14">
        
        {/* Decorative gradient circles */}
        <div className="absolute top-[-120px] left-[-80px] w-[340px] h-[340px] rounded-full bg-[#2DD4BF]/15 blur-[100px]" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#818CF8]/15 blur-[100px]" />
        <div className="absolute top-[40%] right-[15%] w-[200px] h-[200px] rounded-full bg-[#38BDF8]/10 blur-[80px]" />

        {/* Dot grid pattern (decorative) */}
        <div className="absolute top-16 right-16 grid grid-cols-5 gap-2 opacity-20">
          {[...Array(25)].map((_, i) => (
            <div key={`dot-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ))}
        </div>
        <div className="absolute bottom-24 left-14 grid grid-cols-5 gap-2 opacity-20">
          {[...Array(25)].map((_, i) => (
            <div key={`dot-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ))}
        </div>

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
            </div>
            <span className="font-black text-xl text-white tracking-[0.15em] uppercase">ESTEL</span>
          </Link>
        </div>

        {/* Center: 3D Cosmic Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-8">
          <div className="relative w-[380px] h-[380px] xl:w-[420px] xl:h-[420px]">
            {/* Orbital ring 1 */}
            <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_25s_linear_infinite]" />
            {/* Orbital ring 2 (tilted) */}
            <div className="absolute inset-12 rounded-full border border-[#818CF8]/20 animate-[spin_18s_linear_infinite_reverse]" style={{ transform: 'rotateX(65deg)' }} />
            {/* Orbital ring 3 */}
            <div className="absolute inset-20 rounded-full border border-[#2DD4BF]/15 animate-[spin_30s_linear_infinite]" style={{ transform: 'rotateX(70deg) rotateZ(30deg)' }} />
            
            {/* Central planet/sphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 xl:w-48 xl:h-48 rounded-full bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#1E293B] border border-white/10 shadow-2xl shadow-[#818CF8]/20 flex items-center justify-center">
              <div className="w-32 h-32 xl:w-36 xl:h-36 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center border border-white/5">
                <Satellite className="w-12 h-12 xl:w-14 xl:h-14 text-[#818CF8]/70" />
              </div>
            </div>
            
            {/* Small orbiting dots */}
            <div className="absolute top-6 right-20 w-3 h-3 rounded-full bg-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/50 animate-pulse" />
            <div className="absolute bottom-16 left-10 w-2 h-2 rounded-full bg-[#818CF8] shadow-lg shadow-[#818CF8]/50 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 left-6 w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-8 right-12 w-2.5 h-2.5 rounded-full bg-teal-300/80 animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Neon glow line */}
            <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2DD4BF]/40 to-transparent" />
          </div>
        </div>

        {/* Bottom: Info badges */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#818CF8]" />
              <span>Sylius API Connected</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © 2026 ESTEL Professional Mongolia. All rights reserved.
          </p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT SIDE: Clean White Login Form (Orion Style)                   */}
      {/* ================================================================== */}
      <div className="w-full lg:w-[48%] bg-white flex items-center justify-center p-6 sm:p-10 xl:p-16">
        <div className="w-full max-w-md">
          
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
            </div>
            <span className="font-black text-lg text-slate-900 tracking-wider uppercase">ESTEL</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
              Тавтай морилно уу
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Менежерээс өгсөн нэвтрэх эрхийн мэдээллээ оруулна уу.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setRole('manager')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === 'manager'
                  ? 'bg-[#0F1729] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Менежер
            </button>
            <button
              type="button"
              onClick={() => setRole('operator')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === 'operator'
                  ? 'bg-[#0F1729] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Оператор
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">И-мэйл</label>
              <div className="relative">
                <Mail className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'manager' ? 'manager@estel.mn' : 'operator@estel.mn'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-800">Нууц үг</label>
                <span className="text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                  Нууц үг мартсан?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#0F1729] hover:bg-[#1a2540] disabled:opacity-60 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 mt-3"
            >
              <span>{loading ? 'Шалгаж байна...' : 'Нэвтрэх'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom info */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Нэвтрэх эрхтэй холбоотой асуудал гарвал менежертэйгээ холбогдоно уу.
              <br />
              <span className="text-slate-300">Бүртгэлийг зөвхөн Менежер үүсгэнэ.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
