'use client';

import {
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Mail, RefreshCw } from 'lucide-react';
import AuthSplit from '@/components/auth/AuthSplit';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useLocalizedValidation();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [shakeKey, setShakeKey] = useState(0);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join('');

  useEffect(() => {
    setEmail(params.get('email') || sessionStorage.getItem('estel_verify_email') || '');
  }, [params]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0 || verified) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, verified]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
    setError('');
    setNotice('');
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) inputs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: 6 }, (_, index) => pasted[index] || '');
    setDigits(next);
    inputs.current[Math.min(pasted.length, 6) - 1]?.focus();
    setError('');
    setNotice('');
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length !== 6 || loading) return;
    setError('');
    setNotice('');
    setLoading(true);
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose: 'register' }),
    });
    const data = (await res.json()) as { error?: string; redirect?: string; pendingReview?: boolean };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Код буруу.');
      setShakeKey((value) => value + 1);
      return;
    }
    setVerified(true);
    sessionStorage.removeItem('estel_register_draft');
    window.setTimeout(() => {
      router.push(data.redirect || '/list');
      router.refresh();
    }, 1100);
  }

  async function resend() {
    if (resending || seconds > 0) return;
    setResending(true);
    setError('');
    setNotice('');
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'register' }),
    });
    const data = (await res.json()) as { error?: string };
    setResending(false);
    if (!res.ok) {
      setError(data.error || 'Код дахин илгээж чадсангүй.');
      return;
    }
    setDigits(['', '', '', '', '', '']);
    setSeconds(300);
    setNotice('Шинэ код амжилттай илгээгдлээ.');
    inputs.current[0]?.focus();
  }

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return (
    <AnimatePresence mode="wait">
      {verified ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex min-h-[330px] flex-col items-center justify-center text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,.35)]"
          >
            <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
              <Check className="h-10 w-10" strokeWidth={3} />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-2 text-[26px] font-bold text-neutral-900"
          >
            Амжилттай баталгаажлаа
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-neutral-500"
          >
            Таны бүртгэл үүслээ. Түр хүлээнэ үү...
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="verify"
          ref={formRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
        >
          <FieldGroup className="gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F2FD] text-[#2196F3]"
              >
                <Mail className="h-7 w-7" />
              </motion.div>
              <h1 className="text-[27px] leading-tight font-bold text-neutral-900">Код баталгаажуулах</h1>
              <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                <strong className="font-semibold text-neutral-700">{email || 'Таны имэйл'}</strong> хаяг руу
                илгээсэн 6 оронтой кодыг оруулна уу.
              </p>
            </div>

            <motion.div
              key={shakeKey}
              animate={error ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.42 }}
              className="flex justify-center gap-2 sm:gap-2.5"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(element) => {
                    inputs.current[index] = element;
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  aria-label={`${index + 1}-р орон`}
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onFocus={(event) => event.currentTarget.select()}
                  className={`h-13 w-10 rounded-xl border-2 bg-white/90 text-center text-xl font-bold text-neutral-900 outline-none transition-all duration-300 sm:h-14 sm:w-12 ${
                    error
                      ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,.10)]'
                      : digit
                        ? 'border-[#2196F3] shadow-[0_4px_16px_rgba(33,150,243,.18)]'
                        : 'border-[#90CAF9]/70 focus:border-[#2196F3] focus:shadow-[0_0_0_3px_rgba(33,150,243,.14)]'
                  }`}
                />
              ))}
            </motion.div>

            <div className="min-h-5 text-center">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-red-600"
                  >
                    {error}
                  </motion.p>
                ) : notice ? (
                  <motion.p
                    key="notice"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-emerald-600"
                  >
                    {notice}
                  </motion.p>
                ) : (
                  <motion.p key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-neutral-500">
                    Кодын хүчинтэй хугацаа{' '}
                    <span className="font-semibold tabular-nums text-[#0D47A1]">
                      {minutes}:{remainingSeconds}
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Field>
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-xl bg-[#2196F3] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#0D47A1] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Шалгаж байна...
                  </span>
                ) : (
                  'Баталгаажуулах'
                )}
              </Button>
            </Field>

            <div className="text-center text-sm text-neutral-500">
              Код ирээгүй юу?{' '}
              <button
                type="button"
                disabled={seconds > 0 || resending}
                onClick={resend}
                className="font-semibold text-[#0D47A1] transition-colors hover:text-[#2196F3] disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {resending ? 'Илгээж байна...' : seconds > 0 ? `${minutes}:${remainingSeconds}` : 'Дахин илгээх'}
              </button>
            </div>
          </FieldGroup>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function VerifyPage() {
  return (
    <AuthSplit>
      <Suspense>
        <VerifyForm />
      </Suspense>
    </AuthSplit>
  );
}
