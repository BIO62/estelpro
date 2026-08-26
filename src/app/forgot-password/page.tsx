'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import AuthSplit from '@/components/auth/AuthSplit';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type Step = 'request' | 'verify' | 'new_password' | 'success';

const inputClass =
  'bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20';
const buttonClass = 'w-full';

function ForgotPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onRequestSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('Имэйл, утасны дугаар эсвэл кодоо оруулна уу.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', identifier: identifier.trim() }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Хэрэглэгч олдсонгүй.');
        return;
      }
      setEmail(data.email);
      setEmailHint(data.emailHint || data.email);
      setStep('verify');
    } catch {
      setLoading(false);
      setError('Сүлжээний алдаа гарлаа.');
    }
  }

  async function onVerifySubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (code.trim().length !== 6) {
      setError('6 оронтой баталгаажуулах кодоо оруулна уу.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', email, code: code.trim() }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Код буруу байна.');
        return;
      }
      setStep('new_password');
    } catch {
      setLoading(false);
      setError('Сүлжээний алдаа гарлаа.');
    }
  }

  async function onNewPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байна.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Нууц үг хоорондоо таарахгүй байна.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_new_password', email, password: newPassword }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Нууц үг солиход алдаа гарлаа.');
        return;
      }
      setStep('success');
    } catch {
      setLoading(false);
      setError('Сүлжээний алдаа гарлаа.');
    }
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'request' && (
        <motion.form
          key="request"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-5"
          onSubmit={onRequestSubmit}
        >
          <FieldGroup className="gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-[26px] leading-tight font-bold text-neutral-900">Нууц үг сэргээх</h1>
              <p className="text-sm text-balance text-neutral-500">
                Бүртгэлтэй имэйл, утасны дугаар эсвэл кодоо оруулна уу.
              </p>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="identifier" className="text-neutral-700 font-medium">
                Имэйл / Утас / Салоны код
              </FieldLabel>
              <Input
                id="identifier"
                type="text"
                required
                className={inputClass}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Жишээ: 88001122, 20002 эсвэл имэйл"
              />
            </Field>

            <Field className="mt-1">
              <Button type="submit" disabled={loading || !identifier.trim()} className={buttonClass}>
                {loading ? 'Шалгаж байна...' : 'Сэргээх код авах'}
              </Button>
            </Field>

            <FieldDescription className="text-center text-sm text-neutral-600 mt-1">
              <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-[#0D47A1] hover:underline">
                <ArrowLeft className="h-4 w-4" /> Буцах (Нэвтрэх)
              </Link>
            </FieldDescription>
          </FieldGroup>
        </motion.form>
      )}

      {step === 'verify' && (
        <motion.form
          key="verify"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-5"
          onSubmit={onVerifySubmit}
        >
          <FieldGroup className="gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-[26px] leading-tight font-bold text-neutral-900">Код баталгаажуулах</h1>
              <p className="text-sm text-balance text-neutral-500">
                <strong className="font-semibold text-neutral-800">{emailHint || email}</strong> хаяг руу илгээсэн 6 оронтой кодыг оруулна уу.
              </p>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="otp-code" className="block text-center font-medium text-neutral-700">
                6 оронтой баталгаажуулах код
              </FieldLabel>
              <Input
                id="otp-code"
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                className={`${inputClass} text-center font-mono text-xl tracking-[0.4em]`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder="000000"
              />
            </Field>

            <Field className="mt-1">
              <Button type="submit" disabled={loading || code.length !== 6} className={buttonClass}>
                {loading ? 'Шалгаж байна...' : 'Баталгаажуулах'}
              </Button>
            </Field>

            <div className="mt-1 flex items-center justify-between px-1 text-xs text-neutral-600">
              <button
                type="button"
                className="font-medium text-neutral-700 hover:underline"
                onClick={() => {
                  setStep('request');
                  setError('');
                }}
              >
                Өөр хаяг оруулах
              </button>
              <button type="button" className="font-medium text-[#2196F3] hover:underline" onClick={onRequestSubmit}>
                Дахин илгээх
              </button>
            </div>
          </FieldGroup>
        </motion.form>
      )}

      {step === 'new_password' && (
        <motion.form
          key="new_password"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-5"
          onSubmit={onNewPasswordSubmit}
        >
          <FieldGroup className="gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-[26px] leading-tight font-bold text-neutral-900">Шинэ нууц үг</h1>
              <p className="text-sm text-balance text-neutral-500">Шинэ нууц үгээ 2 удаа оруулан баталгаажуулна уу.</p>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            ) : null}

            <Field>
              <FieldLabel htmlFor="new-pass" className="font-medium text-neutral-700">
                Шинэ нууц үг (дор хаяж 6 тэмдэгт)
              </FieldLabel>
              <PasswordInput
                id="new-pass"
                required
                minLength={6}
                className={inputClass}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-pass" className="font-medium text-neutral-700">
                Шинэ нууц үг давтах
              </FieldLabel>
              <PasswordInput
                id="confirm-pass"
                required
                minLength={6}
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
            </Field>

            <Field className="mt-1">
              <Button type="submit" disabled={loading || newPassword.length < 6 || !confirmPassword} className={buttonClass}>
                {loading ? 'Хадгалж байна...' : 'Нууц үг хадгалах'}
              </Button>
            </Field>
          </FieldGroup>
        </motion.form>
      )}

      {step === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 py-2 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold text-neutral-900">Амжилттай солигдлоо!</h1>
            <p className="text-sm text-neutral-600">Таны шинэ нууц үг амжилттай хадгалагдлаа. Одоо нэвтэрнэ үү.</p>
          </div>
          <Button type="button" className={`${buttonClass} mt-2`} onClick={() => router.push('/login')}>
            Нэвтрэх хуудас руу очих
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthSplit>
      <ForgotPasswordContent />
    </AuthSplit>
  );
}
