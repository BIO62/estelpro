'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const DRAFT_KEY = 'estel_register_draft';

type Draft = { lastName: string; name: string; phone: string; email: string };
type FieldName = 'lastName' | 'name' | 'phone' | 'email' | 'password' | 'confirm';
type Errors = Partial<Record<FieldName | 'form', string>>;

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
  const formRef = useLocalizedValidation();
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<Draft>;
      setLastName(draft.lastName || '');
      setName(draft.name || '');
      setPhone(draft.phone || '');
      setEmail(draft.email || '');
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const draft: Draft = { lastName, name, phone, email };
    // An all-empty draft means the form has not been restored yet, so keeping
    // the stored one avoids wiping it before the restore effect reads it.
    if (!Object.values(draft).some(Boolean)) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [lastName, name, phone, email]);

  function clearError(field: FieldName) {
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!/^[6-9]\d{7}$/.test(phone)) next.phone = 'Утасны дугаараа 8 оронтой байхаар оруулна уу.';
    if (password.length < 8) next.password = 'Нууц үг хамгийн багадаа 8 тэмдэгт байна.';
    else if (password !== confirm) next.confirm = 'Нууц үг таарахгүй байна.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastName, name, email, phone: `+976${phone}`, password }),
    });
    const data = (await res.json()) as { error?: string; field?: FieldName };
    setLoading(false);
    if (!res.ok) {
      const message = data.error || 'Бүртгэл амжилтгүй.';
      setErrors(data.field ? { [data.field]: message } : { form: message });
      return;
    }
    sessionStorage.setItem('estel_verify_email', email);
    router.push(`/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <form ref={formRef} className={cn('flex flex-col', className)} {...props} onSubmit={onSubmit} noValidate={false}>
      <FieldGroup className="gap-4 [&_[data-slot=field]]:gap-1.5">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-[28px] leading-tight font-semibold">Бүртгүүлэх</h1>
          <p className="text-sm text-balance text-neutral-500">Хувь хэрэглэгчийн бүртгэл</p>
        </div>
        {errors.form ? <p className="text-sm font-medium text-destructive">{errors.form}</p> : null}

        <div className="grid grid-cols-2 gap-3">
          <Field data-invalid={errors.lastName ? true : undefined}>
            <FieldLabel htmlFor="last-name">Овог</FieldLabel>
            <Input
              id="last-name"
              type="text"
              placeholder="Овог"
              required
              aria-invalid={errors.lastName ? true : undefined}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError('lastName');
              }}
            />
            <FieldError>{errors.lastName || null}</FieldError>
          </Field>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="name">Нэр</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Нэр"
              required
              aria-invalid={errors.name ? true : undefined}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
            />
            <FieldError>{errors.name || null}</FieldError>
          </Field>
        </div>

        <Field data-invalid={errors.phone ? true : undefined}>
          <FieldLabel htmlFor="phone">Утас</FieldLabel>
          <div className="flex items-center gap-2">
            <span className="flex h-11 shrink-0 items-center rounded-xl border bg-neutral-50 px-3.5 text-sm text-neutral-500">
              +976
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="Утасны дугаар"
              required
              inputMode="numeric"
              maxLength={8}
              pattern="[6-9][0-9]{7}"
              data-validation-message="Утасны дугаараа 8 оронтой байхаар оруулна уу."
              aria-invalid={errors.phone ? true : undefined}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 8));
                clearError('phone');
              }}
            />
          </div>
          <FieldError>{errors.phone || null}</FieldError>
        </Field>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email">Имэйл</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Имэйл хаягаа оруулна уу..."
            required
            aria-invalid={errors.email ? true : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
          />
          {errors.email ? (
            <FieldError>{errors.email}</FieldError>
          ) : (
            <FieldDescription>Баталгаажуулах код илгээгдэхийг анхаарана уу !</FieldDescription>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="password">Нууц үг</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              placeholder="..............................................."
              data-validation-message="Нууц үг хамгийн багадаа 8 тэмдэгт байна."
              aria-invalid={errors.password ? true : undefined}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError('password');
              }}
            />
            <FieldError>{errors.password || null}</FieldError>
          </Field>
          <Field data-invalid={errors.confirm ? true : undefined}>
            <FieldLabel htmlFor="confirm-password">Нууц үг давтах</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              required
              minLength={8}
                    placeholder="..............................................."
              data-validation-message="Нууц үг хамгийн багадаа 8 тэмдэгт байна."
              aria-invalid={errors.confirm ? true : undefined}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                clearError('confirm');
              }}
            />
            <FieldError>{errors.confirm || null}</FieldError>
          </Field>
        </div>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? 'Илгээж байна...' : 'Бүртгүүлэх'}
          </Button>
        </Field>
        <FieldSeparator>Эсвэл</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Gmail-ээр бүртгүүлэх
          </Button>
          <FieldDescription className="text-center">
            Бүртгэл байгаа юу?{' '}
            <Link href="/login" className="underline underline-offset-4">
              Нэвтрэх
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
