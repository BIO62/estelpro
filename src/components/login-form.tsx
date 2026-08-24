'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { AccountKind } from '@/lib/auth/types';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useLocalizedValidation();
  const initial = params.get('kind') === 'salon' ? 'salon' : 'consumer';
  const [kind, setKind] = useState<Extract<AccountKind, 'consumer' | 'salon'>>(initial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salonCode, setSalonCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailHint, setEmailHint] = useState('');
  const [phoneHint, setPhoneHint] = useState('');
  const [salonName, setSalonName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const copy = useMemo(
    () =>
      kind === 'salon'
        ? { title: 'Салон нэвтрэх', hint: 'Компаниас өгсөн хэрэглэгчийн кодоор OTP авна.' }
        : { title: 'Нэвтрэх', hint: 'Имэйл болон нууц үгээ оруулна уу.' },
    [kind]
  );

  async function onConsumerSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, kind: 'consumer' }),
    });
    const data = (await res.json()) as { error?: string; needsOtp?: boolean; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      if (data.needsOtp) {
        sessionStorage.setItem('estel_verify_email', email);
        router.push(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(data.error || 'Нэвтрэх амжилтгүй.');
      return;
    }
    router.push(data.redirect || '/');
    router.refresh();
  }

  async function sendSalonOtp(event?: FormEvent) {
    event?.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonCode, purpose: 'login' }),
    });
    const data = (await res.json()) as {
      error?: string;
      emailHint?: string;
      phoneHint?: string;
      salonName?: string;
    };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'OTP илгээж чадсангүй.');
      return;
    }
    setEmailHint(data.emailHint || '');
    setPhoneHint(data.phoneHint || '');
    setSalonName(data.salonName || '');
    setOtpSent(true);
  }

  async function verifySalonOtp(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonCode, code: otp, purpose: 'login' }),
    });
    const data = (await res.json()) as { error?: string; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'OTP буруу.');
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
      onSubmit={kind === 'salon' ? (otpSent ? verifySalonOtp : sendSalonOtp) : onConsumerSubmit}
    >
      <FieldGroup>
        <div className="flex w-full gap-1 rounded-xl bg-neutral-100 p-1">
          <Button
            type="button"
            variant={kind === 'consumer' ? 'default' : 'ghost'}
            className="auth-tab flex-1 whitespace-nowrap px-2.5"
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
            className="auth-tab flex-1 whitespace-nowrap px-2.5"
            onClick={() => {
              setKind('salon');
              setError('');
            }}
          >
            Салон
          </Button>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-[28px] leading-tight font-semibold">{copy.title}</h1>
          <p className="text-sm text-balance text-neutral-500">{copy.hint}</p>
        </div>
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

        {kind === 'salon' ? (
          otpSent ? (
            <>
              <Field>
                <FieldLabel htmlFor="otp">OTP</FieldLabel>
                <Input
                  id="otp"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                />
                <FieldDescription>
                  {salonName ? `${salonName} — ` : ''}
                  {emailHint} руу код илгээлээ.
                  {phoneHint ? ` SMS үйлчилгээ ажиллаж дараа ${phoneHint} дугаар руу илгээнэ.` : ''}
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading || otp.length !== 6}>
                  {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => sendSalonOtp()}>
                  Код дахин илгээх
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                >
                  Код солих
                </Button>
              </Field>
            </>
          ) : (
            <>
              <Field>
                <FieldLabel htmlFor="salon-code">Хэрэглэгчийн код</FieldLabel>
                <Input
                  id="salon-code"
                  required
                  value={salonCode}
                  onChange={(e) => setSalonCode(e.target.value.toUpperCase())}
                  placeholder="SLN-1001"
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Илгээж байна...' : 'OTP илгээх'}
                </Button>
              </Field>
            </>
          )
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor="email">Имэйл болон дугаар</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Имэйл эсвэл утасны дугаар"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Нууц үг</FieldLabel>
                <Link href="/forgot-password" className="ml-auto text-sm text-foreground underline-offset-4 hover:underline">
                  Нууц үг мартсан
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
              </Button>
            </Field>
            <FieldSeparator>Эсвэл</FieldSeparator>
            <Field>
              <Button variant="outline" type="button">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
</svg>
                Gmail-аар нэвтрэх
              </Button>
              <FieldDescription className="text-center">
                Бүртгэлгүй юу?{' '}
                <Link href="/register" className="underline underline-offset-4">
                  Бүртгүүлэх
                </Link>
              </FieldDescription>
            </Field>
          </>
        )}
      </FieldGroup>
    </form>
  );
}
