'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthSplit from '@/components/auth/AuthSplit';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function StaffLoginPage() {
  const router = useRouter();
  const formRef = useLocalizedValidation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const showPasswordInput = email.trim().length >= 4 || password.length > 0;

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
            <h1 className="text-[28px] leading-tight font-semibold">Portal</h1>
            <p className="text-sm text-balance text-neutral-500">Имэйл болон нууц үгээр нэвтэрнэ үү.</p>
          </div>

          {error ? <p className="text-sm font-medium text-destructive text-center">{error}</p> : null}

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
              placeholder="имэйл"
            />
          </Field>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showPasswordInput
                ? 'max-h-48 translate-y-0 opacity-100'
                : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
            }`}
          >
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Нууц үг</FieldLabel>
                <Link href="/forgot-password" className="text-xs text-neutral-500 hover:underline">
                  Нууц үг мартсан
                </Link>
              </div>
              <PasswordInput
                id="password"
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

          <Field>
            <Button type="submit" disabled={loading || !showPasswordInput}>
              {loading ? 'Шалгаж байна...' : 'Нэвтрэх'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthSplit>
  );
}
