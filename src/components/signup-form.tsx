'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocalizedValidation } from '@/lib/useLocalizedValidation';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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

  function clearError(field: FieldName) {
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {};
    if (!lastName.trim()) next.lastName = 'Овгоо оруулна уу.';
    if (!name.trim()) next.name = 'Нэрээ оруулна уу.';
    if (!/^[6-9]\d{7}$/.test(phone)) next.phone = 'Утасны дугаараа 8 оронтой байхаар оруулна уу.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Имэйл хаягаа зөв оруулна уу.';
    if (password.length < 6) next.password = 'Нууц үг хамгийн багадаа 6 тэмдэгт байна.';
    else if (password !== confirm) next.confirm = 'Нууц үг таарахгүй байна.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastName, name, email: email.trim().toLowerCase(), phone: `+976${phone}`, password }),
    });
    const data = (await res.json()) as { error?: string; field?: FieldName; redirect?: string };
    setLoading(false);
    if (!res.ok) {
      const message = data.error || 'Бүртгэл амжилтгүй боллоо.';
      setErrors(data.field ? { [data.field]: message } : { form: message });
      return;
    }

    // Directly logged in, redirect smoothly to home
    router.push(data.redirect || '/');
    router.refresh();
  }

  return (
    <form ref={formRef} className={cn('flex flex-col gap-4', className)} {...props} onSubmit={onSubmit} noValidate={false}>
      <FieldGroup className="gap-3.5">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-[26px] leading-tight font-bold text-neutral-900">Бүртгүүлэх</h1>
          <p className="text-sm text-balance text-neutral-500">Шинээр хэрэглэгчийн бүртгэл үүсгэх</p>
        </div>

        {errors.form ? (
          <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
            {errors.form}
          </div>
        ) : null}

        {/* Name inputs */}
        <div className="grid grid-cols-2 gap-3">
          <Field data-invalid={errors.lastName ? true : undefined}>
            <FieldLabel htmlFor="last-name" className="text-neutral-700 font-medium text-xs">Овог</FieldLabel>
            <Input
              id="last-name"
              type="text"
              placeholder="Овог"
              required
              className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearError('lastName');
              }}
            />
            <FieldError>{errors.lastName || null}</FieldError>
          </Field>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="name" className="text-neutral-700 font-medium text-xs">Нэр</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Нэр"
              required
              className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
            />
            <FieldError>{errors.name || null}</FieldError>
          </Field>
        </div>

        {/* Phone */}
        <Field data-invalid={errors.phone ? true : undefined}>
          <FieldLabel htmlFor="phone" className="text-neutral-700 font-medium text-xs">Утасны дугаар</FieldLabel>
          <div className="flex items-center gap-2">
            <span className="flex h-10 shrink-0 items-center rounded-xl border border-[#90CAF9]/70 bg-[#E3F2FD] px-3 text-sm font-medium text-[#0D47A1]">
              +976
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="88001122"
              required
              inputMode="numeric"
              maxLength={8}
              className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 8));
                clearError('phone');
              }}
            />
          </div>
          <FieldError>{errors.phone || null}</FieldError>
        </Field>

        {/* Email */}
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email" className="text-neutral-700 font-medium text-xs">Имэйл хаяг</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="example@mail.com"
            required
            className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
          />
          <FieldError>{errors.email || null}</FieldError>
        </Field>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-3">
          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="password" className="text-neutral-700 font-medium text-xs">Нууц үг</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
              className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError('password');
              }}
            />
            <FieldError>{errors.password || null}</FieldError>
          </Field>
          <Field data-invalid={errors.confirm ? true : undefined}>
            <FieldLabel htmlFor="confirm-password" className="text-neutral-700 font-medium text-xs">Давтах</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
              className="bg-white/90 text-neutral-900 border-[#90CAF9]/70 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                clearError('confirm');
              }}
            />
            <FieldError>{errors.confirm || null}</FieldError>
          </Field>
        </div>

        {/* Submit */}
        <Field className="mt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2196F3] hover:bg-[#0D47A1] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
          >
            {loading ? 'Бүртгэл үүсгэж байна...' : 'Бүртгүүлэх'}
          </Button>
        </Field>

        <FieldDescription className="text-center text-sm text-neutral-600 mt-1">
          Бүртгэлтэй юу?{' '}
          <Link href="/login" className="font-semibold text-[#0D47A1] hover:text-[#2196F3] hover:underline">
            Нэвтрэх
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
