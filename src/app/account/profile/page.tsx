'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profile = {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
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
        if (!data.user) {
          router.replace('/login?next=/account/profile');
          return;
        }
        setProfile(data.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError('');
    setMsg('');
    const body: Record<string, string> = {
      name: profile.name,
      lastName: profile.lastName,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      district: profile.district,
    };
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('Шинэ нууц үг таарахгүй байна.');
        setSaving(false);
        return;
      }
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }
    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Хадгалж чадсангүй');
      return;
    }
    setMsg('Хадгалагдлаа');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  if (loading || !profile) {
    return <section className="py-5"><div className="container text-center text-muted-foreground">Ачаалж байна...</div></section>;
  }

  const initial = profile.name?.slice(0, 1) || '?';

  return (
    <>
      <div className="d-lg-none border-bottom bg-white">
        <div className="container">
          <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Link href="/account/profile" className="btn btn-sm fs-13 fw-semibold fc-main py-2 text-start">Хувийн мэдээлэл</Link>
            <Link href="/account/address" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хүргэлтийн хаяг</Link>
            <Link href="/account/orders" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Миний захиалгууд</Link>
            <Link href="/wishlist" className="btn btn-sm fs-13 fc-secondary py-2 text-start">Хадгалсан бараа</Link>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-3 d-none d-lg-block">
              <div className="sticky-top" style={{ top: '88px' }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                  <div className="d-flex align-items-center justify-content-center bg-main fc-white fw-bold rounded-5 flex-shrink-0" style={{ width: '44px', height: '44px', fontSize: '18px' }}>{initial}</div>
                  <div style={{ minWidth: '0' }}>
                    <strong className="d-block fs-14 lh-sm text-truncate">{profile.name}</strong>
                    <span className="fs-12 fc-secondary d-block text-truncate">{profile.email}</span>
                  </div>
                </div>
                <nav className="d-flex flex-column">
                  <Link href="/account/profile" className="side-nav-item active">Хувийн мэдээлэл</Link>
                  <Link href="/account/address" className="side-nav-item">Хүргэлтийн хаяг</Link>
                  <Link href="/account/orders" className="side-nav-item">Миний захиалгууд</Link>
                  <Link href="/wishlist" className="side-nav-item">Хадгалсан бараа</Link>
                </nav>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.07)', marginTop: '8px', paddingTop: '8px' }}>
                  <button type="button" onClick={logout} className="side-nav-item border-0 bg-transparent text-start w-100" style={{ color: '#FF006E' }}>Системээс гарах</button>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <h1 className="fw-bold fs-5 mb-1">Хувийн мэдээлэл</h1>
              <p className="fc-secondary fs-13 mb-4">Таны бүртгэлийн мэдээлэл</p>

              {error ? <p className="text-danger fs-13 mb-3">{error}</p> : null}
              {msg ? <p className="text-success fs-13 mb-3">{msg}</p> : null}

              <form onSubmit={onSave}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Нэр</label>
                    <input type="text" className="form-control rounded-3" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Овог</label>
                    <input type="text" className="form-control rounded-3" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Утасны дугаар</label>
                    <input type="tel" className="form-control rounded-3" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">И-мэйл</label>
                    <input type="email" className="form-control rounded-3" value={profile.email} disabled />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Хот</label>
                    <input type="text" className="form-control rounded-3" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Дүүрэг</label>
                    <input type="text" className="form-control rounded-3" value={profile.district} onChange={(e) => setProfile({ ...profile, district: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fs-13 fw-semibold">Хаяг</label>
                    <input type="text" className="form-control rounded-3" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  </div>
                  <div className="col-12 mt-2">
                    <button type="submit" disabled={saving} className="btn btn-main px-4 py-2">{saving ? 'Хадгалж байна...' : 'Хадгалах'}</button>
                  </div>
                </div>

                <hr className="my-5" style={{ opacity: '.08' }} />

                <h2 className="fw-semibold fs-6 mb-3">Нууц үг солих</h2>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Одоогийн нууц үг</label>
                    <input type="password" className="form-control rounded-3" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Шинэ нууц үг</label>
                    <input type="password" className="form-control rounded-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fs-13 fw-semibold">Шинэ нууц үг давтах</label>
                    <input type="password" className="form-control rounded-3" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
