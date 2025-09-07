'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProfileQuery } from '@/queries/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useState } from 'react';
import navigationItems from './navigation-items';

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const { data: user } = useProfileQuery();

  const isActive = (path: string) =>
    pathname.split('/')[1] === path.split('/')[1];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  if (
    user &&
    navigationItems.some(
      (item) => item.href === pathname && !item.roles.includes(user.role)
    )
  ) {
    redirect('/');
  }

  return (
    <div
      className={cn(
        'bg-card relative hidden h-full flex-col border-r transition-all duration-300 md:flex',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3.5">
        {!collapsed && (
          <Link href="/dashboard" className="block">
            <div className="flex items-center gap-2">
              <Image
                src={'/logo.png'}
                alt="Logo"
                width={36}
                height={36}
                className="h-9 w-9"
              />

              <span className="text-lg font-bold">Neuronomous</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-scroll p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={isActive(item.href) ? 'secondary' : 'ghost'}
                className={cn(
                  'h-10 w-full justify-start gap-3',
                  collapsed && 'px-2',
                  isActive(item.href) &&
                    'bg-primary/10 text-primary hover:bg-primary/20',
                  collapsed && 'w-10'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-medium">
              {user?.first_name[0]}
              {user?.last_name[0]}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium capitalize">
                {user?.first_name} {user?.last_name}
              </p>
              <Badge variant="outline" className="text-xs capitalize">
                {user?.role === 'superadmin' ? 'Super Admin' : user?.role}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
