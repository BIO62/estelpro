'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { AccountKind } from '@/lib/auth/types';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useLocalizedValidation();
  const initial = params.get('kind') === 'salon' ? 'salon' : 'consumer';
  const [kind, setKind] = useState<Extract<AccountKind, 'consumer' | 'salon'>>(initial);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [salonIdentifier, setSalonIdentifier] = useState('');
  const [salonPassword, setSalonPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const showConsumerPassword = emailOrPhone.trim().length >= 4;
  const showSalonPassword = salonIdentifier.trim().length >= 4;

  const copy = useMemo(
    () =>
      kind === 'salon'
        ? {
            title: 'Салон нэвтрэх',
            hint: 'Гэрээт салон болон үсчний кодоор нэвтэрнэ.',
          }
        : {
            title: 'Нэвтрэх',
            hint: 'Имэйл болон нууц үгээ оруулан нэвтэрнэ үү.',
          },
    [kind],
  );

  async function onConsumerSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!emailOrPhone.trim()) {
      setError('Имэйл эсвэл утасны дугаараа оруулна уу.');
      return;
    }
    if (!password) {
      setError('Нууц үгээ оруулна уу.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrPhone.trim(), password, kind: 'consumer' }),
    });
    const data = (await res.json()) as { error?: string; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Имэйл эсвэл нууц үг буруу байна.');
      return;
    }
    router.push(data.redirect || '/');
    router.refresh();
  }

  async function onSalonSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!salonIdentifier.trim()) {
      setError('Салоны код эсвэл дугаараа оруулна уу.');
      return;
    }
    if (!salonPassword) {
      setError('Нууц үгээ оруулна уу.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonCode: salonIdentifier.trim(), password: salonPassword, kind: 'salon' }),
    });
    const data = (await res.json()) as { error?: string; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Салоны код эсвэл нууц үг буруу байна.');
      return;
    }
    router.push(data.redirect || '/dresser');
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={kind === 'salon' ? onSalonSubmit : onConsumerSubmit}
    >
      <FieldGroup className="gap-4">
        {/* Account Kind Tabs */}
        <div className="flex w-full gap-1 rounded-2xl bg-[#E3F2FD] p-1 border border-[#90CAF9]/60 backdrop-blur-sm">
          <Button
            type="button"
            variant={kind === 'consumer' ? 'default' : 'ghost'}
            className={cn(
              'auth-tab flex-1 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
              kind === 'consumer'
                ? 'bg-[#2196F3] text-white shadow-sm hover:bg-[#0D47A1]'
                : 'text-[#0D47A1] hover:text-[#0D47A1] hover:bg-[#90CAF9]/35'
            )}
            onClick={() => {
              setKind('consumer');
              setError('');
            }}
          >
            Хувь хэрэглэгч
          </Button>
          <Button
            type="button"
            variant={kind === 'salon' ? 'default' : 'ghost'}
            className={cn(
              'auth-tab flex-1 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
              kind === 'salon'
                ? 'bg-[#2196F3] text-white shadow-sm hover:bg-[#0D47A1]'
                : 'text-[#0D47A1] hover:text-[#0D47A1] hover:bg-[#90CAF9]/35'
            )}
            onClick={() => {
              setKind('salon');
              setError('');
            }}
          >
            Салон / Үсчин
          </Button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1 text-center mt-1">
          <h1 className="text-[26px] leading-tight font-bold text-neutral-900">{copy.title}</h1>
          <p className="text-sm text-balance text-neutral-500">{copy.hint}</p>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : null}

        {kind === 'salon' ? (
          /* ========================================================================= */
          /* SALON LOGIN                                                               */
          /* ========================================================================= */
          <>
            <Field>
              <FieldLabel htmlFor="salon-code" className="text-neutral-700 font-medium">Хэрэглэгчийн код эсвэл утас</FieldLabel>
              <Input
                id="salon-code"
                required
                className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
                value={salonIdentifier}
                onChange={(e) => {
                  setSalonIdentifier(e.target.value);
                  setError('');
                }}
                placeholder="Жишээ: 20002, 20105 эсвэл 91109293"
              />
            </Field>

            <div
              className={cn(
                'overflow-hidden transition-all duration-700 ease-out',
                showSalonPassword
                  ? 'max-h-32 translate-y-0 opacity-100'
                  : 'pointer-events-none max-h-0 -translate-y-3 opacity-0',
              )}
              aria-hidden={!showSalonPassword}
            >
              <Field>
                <FieldLabel htmlFor="salon-password" className="text-neutral-700 font-medium">Нууц үг</FieldLabel>
                <Input
                  id="salon-password"
                  type="password"
                  required={showSalonPassword}
                  tabIndex={showSalonPassword ? 0 : -1}
                  autoComplete="current-password"
                  className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
                  value={salonPassword}
                  onChange={(e) => {
                    setSalonPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            <Field className="mt-2">
              <Button
                type="submit"
                disabled={loading || !showSalonPassword || !salonPassword}
                className="w-full bg-[#2196F3] hover:bg-[#0D47A1] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
              >
                {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
              </Button>
            </Field>

            <FieldDescription className="text-center text-sm text-neutral-600">
              Бүртгэлгүй юу?{' '}
              <Link href="/register" className="font-semibold text-[#0D47A1] hover:text-[#2196F3] hover:underline">
                Бүртгүүлэх
              </Link>
            </FieldDescription>
          </>
        ) : (
          /* ========================================================================= */
          /* CONSUMER LOGIN                                                            */
          /* ========================================================================= */
          <>
            <Field>
              <FieldLabel htmlFor="email" className="text-neutral-700 font-medium">Имэйл эсвэл утас</FieldLabel>
              <Input
                id="email"
                type="text"
                required
                autoComplete="username"
                className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  setError('');
                }}
                placeholder="Имэйл эсвэл утасны дугаар"
              />
            </Field>

            <div
              className={cn(
                'overflow-hidden transition-all duration-700 ease-out',
                showConsumerPassword
                  ? 'max-h-32 translate-y-0 opacity-100'
                  : 'pointer-events-none max-h-0 -translate-y-3 opacity-0',
              )}
              aria-hidden={!showConsumerPassword}
            >
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-neutral-700 font-medium">Нууц үг</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-neutral-500 hover:text-[#0D47A1] hover:underline"
                  >
                    Нууц үг мартсан
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required={showConsumerPassword}
                  tabIndex={showConsumerPassword ? 0 : -1}
                  autoComplete="current-password"
                  className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            <Field className="mt-2">
              <Button
                type="submit"
                disabled={loading || !showConsumerPassword || !password}
                className="w-full bg-[#2196F3] hover:bg-[#0D47A1] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
              >
                {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
              </Button>
            </Field>

            <FieldDescription className="text-center text-sm text-neutral-600">
              Бүртгэлгүй юу?{' '}
              <Link href="/register" className="font-semibold text-[#0D47A1] hover:text-[#2196F3] hover:underline">
                Бүртгүүлэх
              </Link>
            </FieldDescription>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
