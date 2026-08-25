'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthSplit from '@/components/auth/AuthSplit';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function StaffLoginPage() {
  const router = useRouter();
  const formRef = useLocalizedValidation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState<'manager' | 'operator'>('manager');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Progressive disclosure: show password once email is typed
  const showPasswordInput = email.trim().length >= 1;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, kind: 'staff' }),
    });
    const data = (await res.json()) as { error?: string; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Нэвтрэх амжилтгүй.');
      return;
    }
    router.push(data.redirect || '/ad');
    router.refresh();
  }

  return (
    <AuthSplit>
      <form ref={formRef} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-[28px] leading-tight font-semibold">Ажилтан</h1>
            <p className="text-sm text-balance text-neutral-500">Бүртгэлийг зөвхөн менежер үүсгэнэ.</p>
          </div>

          {/* Role Tabs */}
          <div className="flex w-full gap-1 rounded-xl bg-neutral-100 p-1">
            <Button
              type="button"
              variant={hint === 'manager' ? 'default' : 'ghost'}
              className="auth-tab flex-1 whitespace-nowrap px-2.5"
              onClick={() => {
                setHint('manager');
                setError('');
              }}
            >
              Менежер
            </Button>
            <Button
              type="button"
              variant={hint === 'operator' ? 'default' : 'ghost'}
              className="auth-tab flex-1 whitespace-nowrap px-2.5"
              onClick={() => {
                setHint('operator');
                setError('');
              }}
            >
              Оператор
            </Button>
          </div>

          {error ? <p className="text-sm font-medium text-destructive text-center">{error}</p> : null}

          {/* Step 1: Email Input */}
          <Field>
            <FieldLabel htmlFor="email">Имэйл</FieldLabel>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder={hint === 'manager' ? 'manager@estel.mn' : 'operator@estel.mn'}
            />
          </Field>

          {/* Step 2: Smoothly animated password field */}
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              showPasswordInput
                ? 'max-h-40 opacity-100 transform translate-y-0'
                : 'max-h-0 opacity-0 pointer-events-none transform -translate-y-2'
            }`}
          >
            <Field>
              <FieldLabel htmlFor="password">Нууц үг</FieldLabel>
              <Input
                id="password"
                type="password"
                required={showPasswordInput}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
              />
            </Field>
          </div>

          {/* Step 3: Login Button */}
          <Field>
            <Button type="submit" disabled={loading || !showPasswordInput}>
              {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
            </Button>
          </Field>

          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4">
              Хувь хэрэглэгч / Салон
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </AuthSplit>
  );
}
