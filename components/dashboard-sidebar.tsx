'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProfileQuery } from '@/queries/auth';
import {
  Activity,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  HardDrive,
  Layers,
  LayoutDashboard,
  User,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: SidebarProps) {
  const { data: user } = useProfileQuery();

  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      roles: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Groups',
      href: '/groups',
      icon: Layers,
      roles: ['superadmin'],
    },
    {
      name: 'Devices',
      href: '/devices',
      icon: Cpu,
      roles: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Firmware',
      href: '/firmware',
      icon: HardDrive,
      roles: ['superadmin'],
    },
    {
      name: 'Create User',
      href: '/create-user',
      icon: UserCheck,
      roles: ['superadmin'],
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      roles: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['superadmin', 'admin'],
    },

    {
      name: 'Activity Logs',
      href: '/user-activity',
      icon: Activity,
      roles: ['superadmin'],
    },
    {
      name: 'System Logs',
      href: '/system-logs',
      icon: FileText,
      roles: ['superadmin'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      roles: ['superadmin', 'admin', 'user'],
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  if (!user) return null;

  return (
    <div
      className={cn(
        'bg-card relative hidden h-full flex-col border-r transition-all duration-300 md:flex',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link href="/" className="block">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="text-lg font-bold">IoT Hub</span>
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
              {user.first_name[0]}
              {user.last_name[0]}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.first_name} {user.last_name}
              </p>
              <Badge variant="outline" className="text-xs">
                {user.role === 'superadmin' ? 'Super Admin' : user.role}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
