'use client';

import * as React from 'react';

import { NavMain } from '@/components/ad/nav-main';
import { NavUser } from '@/components/ad/nav-user';
import { TeamSwitcher } from '@/components/ad/team-switcher';
import { allNavItems } from '@/lib/ad/nav-config';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { PublicUser } from '@/lib/auth/types';

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: PublicUser | null }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={allNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? null} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
