'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { IUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Activity,
  BarChart3,
  Bell,
  TabletsIcon as Devices,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function MobileDrawer({ user }: { user?: IUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      roles: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Devices',
      href: '/devices',
      icon: Devices,
      roles: ['superadmin', 'admin', 'user'],
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['superadmin', 'admin'],
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      roles: ['superadmin', 'admin', 'user'],
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
      name: 'Create User',
      href: '/create-user',
      icon: UserCheck,
      roles: ['superadmin'],
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    setOpen(false);
    router.push('/login');
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="pb-0">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Zap className="text-primary-foreground h-5 w-5" />
            </div>
            IoT Hub
          </SheetTitle>
        </SheetHeader>

        <div className="mt-0 space-y-6 overflow-scroll px-1 pb-4">
          {/* User Info */}
          <div className="bg-muted/50 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Shield className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                {user.role === 'superadmin' ? 'Super Admin' : user.role}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <div className=" ">
            <h3 className="mb-3 px-2 text-sm font-semibold">Navigation</h3>
            <div className="space-y-1 overflow-y-scroll">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile & Logout */}
          <div className="border-t pt-4">
            <Link
              href="/profile"
              className={cn(
                'mb-2 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                isActive('/profile')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              onClick={() => setOpen(false)}
            >
              <Settings className="h-5 w-5" />
              Profile Settings
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
