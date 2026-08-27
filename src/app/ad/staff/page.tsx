'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users,
  AlertCircle,
  Mail,
  User,
  ShieldCheck,
  Briefcase,
  X,
} from 'lucide-react';
import type { PublicUser, StaffRole } from '@/lib/auth/types';
import {
  STAFF_POSITIONS,
  canDeleteStaffTarget,
  canInviteDirectors,
  positionLabel,
  roleLabel,
} from '@/lib/auth/roles';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function makeTempPassword() {
  return `Estel${Math.floor(1000 + Math.random() * 9000)}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || 'ST').toUpperCase();
}

function roleBadgeStyle(role: string) {
  switch (role) {
    case 'owner':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'director':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'manager':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'operator':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default function StaffInvitePage() {
  const router = useRouter();
  const [me, setMe] = useState<PublicUser | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('operator');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [temp, setTemp] = useState('');
  const [copied, setCopied] = useState(false);
  const [tempCopied, setTempCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const ownerCount = useMemo(() => users.filter((user) => user.role === 'owner').length, [users]);
  const canAddDirector = canInviteDirectors(me?.role);

  async function load() {
    try {
      const [meRes, staffRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/auth/staff')]);
      const meData = (await meRes.json()) as { user?: PublicUser | null };
      const data = (await staffRes.json()) as { users?: PublicUser[]; error?: string };
      setMe(meData.user || null);
      if (!staffRes.ok) {
        setAllowed(false);
        setError(data.error || 'Хандах эрхгүй.');
        return;
      }
      setAllowed(true);
      setUsers(data.users || []);
    } catch {
      setError('Мэдээлэл ачаалахад алдаа гарлаа.');
    }
  }

  async function removeUser(user: PublicUser) {
    const self = user.id === me?.id;
    const ok = window.confirm(
      self ? 'Өөрийн бүртгэлийг устгах уу? Системээс гарна.' : `${user.name} ажилтны бүртгэлийг устгах уу?`,
    );
    if (!ok) return;
    setError('');
    try {
      const res = await fetch('/api/auth/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      });
      const data = (await res.json()) as { error?: string; self?: boolean };
      if (!res.ok) {
        setError(data.error || 'Устгаж чадсангүй.');
        return;
      }
      if (data.self) {
        router.replace('/login/staff');
        return;
      }
      load();
    } catch {
      setError('Устгахад алдаа гарлаа.');
    }
  }

  async function copyToClipboard(value: string, isTemp = false) {
    try {
      await navigator.clipboard.writeText(value);
      if (isTemp) {
        setTempCopied(true);
        window.setTimeout(() => setTempCopied(false), 1600);
      } else {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      // Fallback
    }
  }

  useEffect(() => {
    setPassword(makeTempPassword());
    load();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setTemp('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, position, password }),
      });
      const data = (await res.json()) as { error?: string; tempPassword?: string };
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Амжилтгүй.');
        return;
      }
      setTemp(data.tempPassword || password);
      setEmail('');
      setName('');
      setPosition('');
      setPassword(makeTempPassword());
      load();
    } catch {
      setLoading(false);
      setError('Сүлжээний алдаа гарлаа.');
    }
  }

  const filteredUsers = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.position && positionLabel(u.position).toLowerCase().includes(q)) ||
        roleLabel(u.role).toLowerCase().includes(q),
    );
  }, [users, searchFilter]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Users className="size-6 text-blue-600" />
            Ажилтнуудын удирдлага
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Системийн эрх болон албан тушаалтай ажилтнуудыг бүртгэх, удирдах
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Нийт {users.length} ажилтан
          </span>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Temp Password Banner */}
      {temp ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <KeyRound className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">Шинэ ажилтны түр нууц үг амжилттай үүслээ</p>
              <p className="text-xs text-amber-800/80 mt-0.5">Энэ нууц үгийг ажилтанд өгч нэвтрүүлнэ үү.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <code className="rounded-xl border border-amber-200 bg-white px-3.5 py-2 font-mono text-sm font-bold text-slate-900 shadow-2xs">
              {temp}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(temp, true)}
              className="gap-1.5 border-amber-300 bg-white hover:bg-amber-100/50"
            >
              {tempCopied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              {tempCopied ? 'Хуулагдлаа' : 'Хуулах'}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Main Grid: 2 Cards Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Create Staff Form (5 cols) */}
        <Card className="lg:col-span-5 shadow-sm border border-slate-200/90 bg-white rounded-3xl">
          <CardHeader className="border-b border-slate-100 p-auto">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
                <UserPlus className="size-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900">Шинэ ажилтан үүсгэх</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Системийн эрх болон албан тушаал оноож бүртгэнэ
            </CardDescription>
          </CardHeader>

          <CardContent className="p-auto top-0">
            {allowed === false ? (
              <p className="text-sm text-slate-500 text-center py-6">Та энэ үйлдлийг хийх эрхгүй байна.</p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Mail className="size-3.5 text-blue-600 shrink-0" />
                    <span>Имэйл хаяг</span>
                    <span className="text-rose-500">*</span>
                  </div>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Имэйл хаяг оруулна уу"
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-2xs transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <User className="size-3.5 text-blue-600 shrink-0" />
                    <span>Ажилтны нэр</span>
                    <span className="text-rose-500">*</span>
                  </div>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Жишээ: Бат-Эрдэнэ"
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-2xs transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Role & Position (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <ShieldCheck className="size-3.5 text-blue-600 shrink-0" />
                      <span>Системийн эрх</span>
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffRole)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-2xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="operator">Оператор</option>
                      <option value="manager">Менежер</option>
                      {canAddDirector ? <option value="director">Захирал</option> : null}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Briefcase className="size-3.5 text-blue-600 shrink-0" />
                      <span>Албан тушаал</span>
                    </div>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-2xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    >
                      <option value="">Сонгох</option>
                      {STAFF_POSITIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Temp Password Generator Box */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <KeyRound className="size-3.5 text-blue-600 shrink-0" />
                      <span>Түр нууц үг</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Автоматаар үүсгэгдсэн</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 flex-1 rounded-xl border border-slate-200 bg-white font-mono text-sm font-bold text-slate-900 tracking-wide focus-visible:border-blue-600 focus-visible:ring-blue-100"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPassword(makeTempPassword())}
                      className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                      title="Шинээр үүсгэх"
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => copyToClipboard(password, false)}
                      className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                      title="Хуулах"
                    >
                      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full  hover:bg-primary/90 hover:shadow-sm active:scale-95 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="size-4" />
                  {loading ? 'Үүсгэж байна...' : 'Ажилтан үүсгэх'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Right Card: Staff List & Directory (7 cols) */}
        <Card className="lg:col-span-7 shadow-sm border border-slate-200/90 bg-white rounded-3xl">
          <CardHeader className="border-b border-slate-100 p-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-900">Бүртгэлтэй ажилтнууд</CardTitle>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {filteredUsers.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Системд нэвтрэх эрхтэй</span>
            </div>

            {/* Search Input (Full Width Inline Flex) */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="size-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Ажилтны нэр, имэйл, албан тушаалаар хайх..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none border-none p-0 focus:ring-0 focus:outline-none"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
                  title="Арилгах"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="size-8 mx-auto opacity-40 mb-2" />
                <p className="text-sm font-medium text-slate-600">Ажилтан олдсонгүй</p>
                <p className="text-xs mt-0.5">Шүүлтүүрээ өөрчилж эсвэл шинээр ажилтан нэмнэ үү.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => {
                  const canDelete = me ? canDeleteStaffTarget(me, user, ownerCount) : false;
                  const title = positionLabel(user.position);

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-200 hover:shadow-xs transition-all"
                    >
                      {/* Left: Avatar + Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200/70 shadow-2xs">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                            {user.id === me?.id && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                                Та
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          {title ? (
                            <p className="text-[11px] font-semibold text-blue-600 truncate mt-0.5">{title}</p>
                          ) : null}
                        </div>
                      </div>

                      {/* Right: Badge + Actions */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs',
                            roleBadgeStyle(user.role),
                          )}
                        >
                          {roleLabel(user.role)}
                        </span>

                        {canDelete ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeUser(user)}
                            className="size-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                            title={user.id === me?.id ? 'Өөрийгөө устгах' : 'Ажилтан устгах'}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
