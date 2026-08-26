'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowLeft } from 'lucide-react';
import AuthSplit from '@/components/auth/AuthSplit';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function NewPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Имэйл эсвэл дугаараа оруулна уу.');
      return;
    }
    if (password.length < 6) {
      setError('Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байна.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Нууц үг хоорондоо таарахгүй байна.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_new_password', email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Нууц үг солиход алдаа гарлаа.');
        return;
      }
      router.push('/login');
    } catch {
      setLoading(false);
      setError('Сүлжээний алдаа гарлаа.');
    }
  }

  return (
    <AuthSplit>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-[24px] leading-tight font-bold text-neutral-900">Шинэ нууц үг</h1>
            <p className="text-sm text-balance text-neutral-500">
              Шинэ нууц үгээ тохируулан хадгална уу.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email" className="text-neutral-700 font-medium text-xs">
              Имэйл эсвэл утасны дугаар
            </FieldLabel>
            <Input
              id="email"
              type="text"
              required
              className="bg-white/90 text-neutral-900 border-neutral-300/80 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="example@mail.com"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-pass" className="text-neutral-700 font-medium text-xs">
              Шинэ нууц үг
            </FieldLabel>
            <Input
              id="new-pass"
              type="password"
              required
              minLength={6}
              className="bg-white/90 text-neutral-900 border-neutral-300/80 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-pass" className="text-neutral-700 font-medium text-xs">
              Нууц үг давтах
            </FieldLabel>
            <Input
              id="confirm-pass"
              type="password"
              required
              minLength={6}
              className="bg-white/90 text-neutral-900 border-neutral-300/80 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
            />
          </Field>

          <Field className="mt-1">
            <Button
              type="submit"
              disabled={loading || password.length < 6 || !confirmPassword}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
            >
              {loading ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </Field>

          <FieldDescription className="text-center text-sm text-neutral-600 mt-1">
            <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Буцах (Нэвтрэх)
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthSplit>
  );
}
