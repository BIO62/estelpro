'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { isNavHrefActive } from '@/lib/ad/nav-active';

export type NavMainItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: { title: string; url: string }[];
};

function NavCollapsibleItem({
  item,
  pathname,
  searchParams,
}: {
  item: NavMainItem;
  pathname: string;
  searchParams: URLSearchParams;
}) {
  const groupActive =
    item.items?.some((sub) => isNavHrefActive(sub.url, pathname, searchParams)) ?? false;
  const [open, setOpen] = React.useState(false);
  const Icon = item.icon;

  React.useEffect(() => {
    setOpen(groupActive);
  }, [groupActive]);

  if (!item.items?.length) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={groupActive}>
            {Icon ? <Icon /> : null}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((sub) => (
              <SidebarMenuSubItem key={sub.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isNavHrefActive(sub.url, pathname, searchParams)}
                >
                  <Link href={sub.url}>
                    <span>{sub.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavMainInner({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SidebarGroup className="p-auto">
      <SidebarGroupLabel className="pb-2">Удирдлага</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.url && !item.items?.length) {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isNavHrefActive(item.url, pathname, searchParams)}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    {Icon ? <Icon /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          if (!item.items?.length) return null;

          return (
            <NavCollapsibleItem
              key={item.title}
              item={item}
              pathname={pathname}
              searchParams={searchParams}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  return (
    <Suspense fallback={null}>
      <NavMainInner items={items} />
    </Suspense>
  );
}
