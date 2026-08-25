'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthSplit from '@/components/auth/AuthSplit';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useLocalizedValidation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(params.get('email') || sessionStorage.getItem('estel_verify_email') || '');
  }, [params]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
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
      return;
    }
    sessionStorage.removeItem('estel_register_draft');
    router.push(data.redirect || '/list');
    router.refresh();
  }

  async function resend() {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'register' }),
    });
    const data = (await res.json()) as { error?: string };
    if (data.error) setError(data.error);
  }

  return (
    <form ref={formRef} className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-[28px] leading-tight font-semibold">Баталгаажуулах</h1>
          <p className="text-sm text-balance text-neutral-500">{email || 'имэйл'} руу 6 оронтой код илгээлээ.</p>
          <p className="text-xs text-neutral-400">Код 5 минутын хугацаанд хүчинтэй.</p>
        </div>
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
        <Field>
          <FieldLabel htmlFor="code">Код</FieldLabel>
          <Input
            id="code"
            required
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading || code.length !== 6}>
            {loading ? 'Шалгаж байна...' : 'Баталгаажуулах'}
          </Button>
          <Button type="button" variant="ghost" onClick={resend}>
            Код дахин илгээх
          </Button>
        </Field>
      </FieldGroup>
    </form>
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
