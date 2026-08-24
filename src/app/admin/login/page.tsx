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
  KeyRound,
  CheckCircle2,
  ShieldCheck
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

    // TODO: Жинхэнэ API дуудлага хийх
    // Одоогоор demo: ямар ч и-мэйл/нууц үгээр нэвтэрнэ
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
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* ===== LEFT: Login Form ===== */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-4 filter brightness-0 invert" />
              </div>
              <div>
                <span className="font-black text-base text-slate-900 tracking-wider uppercase block leading-none">ESTEL</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest block mt-1 uppercase">Staff Portal</span>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ажилтны нэвтрэх хэсэг
              </h1>
              <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                Менежерээс өгсөн и-мэйл, нууц үгээ оруулж системд нэвтэрнэ үү.
                <br />
                <span className="text-slate-400 text-xs">Бүртгэл зөвхөн менежер үүсгэнэ.</span>
              </p>
            </div>

            {/* Role Tab */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  role === 'manager'
                    ? 'bg-slate-900 text-white shadow-xs'
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Оператор
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">И-мэйл хаяг</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'manager' ? 'manager@estel.mn' : 'operator@estel.mn'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Нууц үг</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Шалгаж байна...' : 'Нэвтрэх'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>

            {/* Help note */}
            <p className="text-xs text-slate-400 font-medium mt-6 text-center leading-relaxed">
              Нэвтрэх эрхтэй холбоотой асуудал гарвал менежертэйгээ холбогдоно уу.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium mt-6">
            © 2026 ESTEL Professional Mongolia. Нууцлалын бодлого хамгаалагдсан.
          </div>
        </div>

        {/* ===== RIGHT: Visual Panel ===== */}
        <div className="hidden lg:block lg:col-span-6 relative p-4 bg-slate-100">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-between p-8 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
              alt="ESTEL Pro Salon"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold w-fit">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Зөвхөн зөвшөөрөгдсөн ажилтнуудад</span>
            </div>

            {/* Bottom Info Card */}
            <div className="relative z-10 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 space-y-4 shadow-2xl">
              <p className="text-base font-bold text-white leading-snug">
                ESTEL Удирдлагын Систем
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Менежер</strong> — Бүх захиалга, бүтээгдэхүүн, харилцагч, тайлан, ажилтны бүртгэл удирдах бүрэн эрх</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Оператор</strong> — Захиалга хүлээн авах, төлөв шинэчлэх, POS бүртгэл хийх эрх</span>
                </li>
              </ul>
              <div className="pt-3 border-t border-white/15 flex items-center gap-2 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Ажилтны бүртгэлийг зөвхөн Менежер цаанаасаа үүсгэнэ</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
