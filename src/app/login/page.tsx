'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Store,
  ShieldCheck
} from 'lucide-react';
import { assetUrl } from '@/lib/constants';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState<'retail' | 'dresser'>('retail');

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Clean Modern Login Form (Dribbble Ghulam Style)              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3 no-underline">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
                </div>
                <div>
                  <span className="font-black text-base text-slate-900 tracking-wider uppercase block leading-none">ESTEL</span>
                  <span className="text-[10px] text-amber-600 font-bold tracking-widest block mt-1 uppercase">Professional</span>
                </div>
              </Link>

              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 no-underline">
                Буцах ✕
              </Link>
            </div>

            {/* Account Type Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('retail')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'retail'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Хувь хэрэглэгч
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dresser')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'dresser'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-500" />
                <span>Салон / Үсчин</span>
              </button>
            </div>

            {/* Header Greeting */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Тавтай морилно уу 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {activeTab === 'retail'
                  ? 'Өөрийн бүртгэлээр нэвтэрч онцгой хямдрал, захиалгаа хянана уу'
                  : 'Мэргэжлийн үсчин, гэрээт салоны бөөний үнийн эрхээр нэвтрэх'}
              </p>
            </div>

            {/* Google Social Button */}
            <button
              type="button"
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-2xs mb-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl('images/gmail.png')} alt="Google" className="w-5 h-5 object-contain" />
              <span>Google хаягаар шууд нэвтрэх</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                Эсвэл и-мэйлээр
              </span>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {activeTab === 'retail' ? 'Утасны дугаар / И-мэйл хаяг' : 'Салоны утас / Регистрийн дугаар'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder={activeTab === 'retail' ? '9911-2233 эсвэл name@example.com' : 'Салоны дугаар'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Нууц үг</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-amber-600 hover:text-amber-700 no-underline">
                    Нууц үг мартсан?
                  </Link>
                </div>
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

              {/* Remember checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  Нэвтрэх төлөвийг 30 хоног хадгалах
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Нэвтрэх</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>

          {/* Bottom Signup Link */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            Бүртгэлгүй юу?{' '}
            <Link href="/register" className="font-bold text-slate-900 hover:underline no-underline">
              Шинээр бүртгүүлэх
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Luxury Showcase Hero Panel (Dribbble Ghulam Style)          */}
        {/* ========================================================================= */}
        <div className="hidden lg:block lg:col-span-6 relative p-4 bg-slate-100">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
            {/* Background High-res Beauty Visual */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
              alt="ESTEL Professional"
              className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            {/* Top Brand Tag */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ESTEL Haute Couture & Pro Care</span>
            </div>

            {/* Bottom Floating Testimonial Card */}
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white space-y-4 shadow-2xl">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-white ml-1.5">5.0 Үнэлгээ</span>
              </div>

              {/* Quote */}
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                “ESTEL Professional-ийн бүтээгдэхүүнүүд нь мэргэжлийн колористик болон үс арчилгааг дээд зэргийн чанартай болгодог.”
              </p>

              {/* Author Profile */}
              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-xs">
                    А
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">А. Ариунзаяа</p>
                    <p className="text-[11px] text-slate-300 mt-1">Master Stylist & Beauty Director</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Баталгаажсан салон</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
