'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useProfileQuery } from '@/queries/auth';
import { LogOut, Menu, Settings, Zap } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import navigationItems from '../navigation-items';

export function MobileDrawer() {
  const { data: user } = useProfileQuery();

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) =>
    pathname.split('/')[1] === path.split('/')[1];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    setOpen(false);
    router.push('/login');
  };

  if (
    user &&
    navigationItems.some(
      (item) => item.href === pathname && !item.roles.includes(user.role)
    )
  ) {
    redirect('/');
  }

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
            Neuronomous
          </SheetTitle>
        </SheetHeader>

        <div className="mt-0 space-y-6 overflow-scroll px-1 pb-4">
          {/* Navigation */}
          <div className=" ">
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
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
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
