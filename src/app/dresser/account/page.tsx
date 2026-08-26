'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/auth/PasswordInput';

export default function DresserAccountPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/profile')
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== 'salon') {
          router.replace('/login?kind=salon');
          return;
        }
        setName(data.user.name || '');
        setCode(data.user.salonCode || '');
        setPhone(data.user.phone || '');
        setDiscount(data.user.discountPercent || 0);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!newPassword) {
      setError('Шинэ нууц үгээ оруулна уу.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Шинэ нууц үг таарахгүй байна.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Хадгалж чадсангүй');
      return;
    }
    setMsg('Нууц үг солигдлоо.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  if (loading) {
    return <p className="container py-5 text-sm text-muted-foreground">Ачаалж байна...</p>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <Link href="/dresser" className="fs-13 text-decoration-none fc-secondary d-inline-block mb-3">
        ← Салоны портал
      </Link>
      <h1 className="fs-4 fw-bold mb-1">Миний бүртгэл</h1>
      <p className="fs-13 fc-secondary mb-4">Нэвтрэх нууц үгээ солих</p>

      <div className="rounded-4 border bg-white p-4 mb-4">
        <p className="fw-semibold mb-1">{name}</p>
        <p className="fs-13 fc-secondary mb-0">Код: {code}</p>
        <p className="fs-13 fc-secondary mb-0">Утас: {phone}</p>
        <p className="fs-13 fc-secondary mb-0">Хөнгөлөлт: {discount}%</p>
      </div>

      <form onSubmit={onSave} className="rounded-4 border bg-white p-4 d-flex flex-column gap-3">
        <label className="d-block">
          <span className="fs-12 fw-semibold text-secondary d-block mb-1">Одоогийн нууц үг</span>
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="form-control rounded-3"
            placeholder="Утасны дугаар эсвэл шинэчилсэн нууц үг"
          />
        </label>
        <label className="d-block">
          <span className="fs-12 fw-semibold text-secondary d-block mb-1">Шинэ нууц үг</span>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="form-control rounded-3"
          />
        </label>
        <label className="d-block">
          <span className="fs-12 fw-semibold text-secondary d-block mb-1">Шинэ нууц үг давтах</span>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="form-control rounded-3"
          />
        </label>
        {error ? <p className="text-danger fs-13 mb-0">{error}</p> : null}
        {msg ? <p className="text-success fs-13 mb-0">{msg}</p> : null}
        <button type="submit" disabled={saving} className="btn btn-main rounded-pill py-2 fw-semibold">
          {saving ? 'Хадгалж байна...' : 'Нууц үг солих'}
        </button>
      </form>
    </div>
  );
}
