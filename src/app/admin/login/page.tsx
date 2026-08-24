'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { assetUrl } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('manager@estelpro.mn');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'manager' | 'operator' | 'cashier'>('manager');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Set mock session
      if (typeof window !== 'undefined') {
        localStorage.setItem('estel_admin_session', JSON.stringify({
          name: role === 'manager' ? 'Б. Мөнх-Эрдэнэ (Менежер)' : role === 'operator' ? 'Д. Анужин (Оператор)' : 'Г. Төгөлдөр (Касс)',
          role,
          email,
        }));
      }
      router.push('/admin');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-xl mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl('images/logo.svg')} alt="ESTEL" className="h-6 filter brightness-0 invert" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Ажилчдын Систем <ShieldCheck className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ESTEL Professional Mongolia — Захиалга & Удирдлагын портал
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setRole('manager'); setEmail('manager@estelpro.mn'); }}
            className={`py-2 rounded-lg transition-all ${role === 'manager' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Менежер
          </button>
          <button
            type="button"
            onClick={() => { setRole('operator'); setEmail('operator@estelpro.mn'); }}
            className={`py-2 rounded-lg transition-all ${role === 'operator' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Оператор
          </button>
          <button
            type="button"
            onClick={() => { setRole('cashier'); setEmail('pos@estelpro.mn'); }}
            className={`py-2 rounded-lg transition-all ${role === 'cashier' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Касс / POS
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Ажилтны Имэйл / Код
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  placeholder="name@estelpro.mn"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500" />
                <span>Намайг санах</span>
              </label>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">
                Нууц үг мартсан?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <span>Нэвтэрч байна...</span>
              ) : (
                <>
                  <span>Системд нэвтрэх</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Үндсэн цахим дэлгүүр рүү буцах
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
