'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PublicUser } from '@/lib/auth/types';
import { positionLabel, roleLabel } from '@/lib/auth/roles';

export function AdHeaderUser({ user }: { user: PublicUser | null }) {
  const router = useRouter();
  const name = user?.name || 'Ажилтан';
  const email = user?.email || 'staff@estel.mn';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login/staff');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="ad-header-user" aria-label="Хэрэглэгчийн цэс">
          <Avatar className="size-8 shrink-0 rounded-lg">
            <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
              {name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="ad-header-user__name hidden max-w-[7rem] truncate sm:inline">{name}</span>
          <ChevronsUpDown className="ad-header-user__chevron size-4 shrink-0 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="ad-header-user-menu w-64 min-w-[15rem] rounded-xl p-1.5"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar className="size-9 shrink-0 rounded-lg">
              <AvatarFallback className="rounded-lg text-sm font-semibold">{name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{name}</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                {positionLabel(user?.position) || roleLabel(user?.role)}
              </p>
              <p className="truncate text-xs leading-tight text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="ad-header-menu-item">
            <Link href="/ad/staff">
              <User className="size-4" />
              Миний мэдээлэл
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="ad-header-menu-item">
            <Link href="/ad/staff">
              <Settings className="size-4" />
              Тохиргоо
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="ad-header-logout-item"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Системээс гарах
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
