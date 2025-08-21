'use client';

import { AuthGuard } from '@/components/auth-guard';
import { DashboardHeader } from '@/components/shared/dashboard-header';
import { DashboardSidebar } from '@/components/shared/dashboard-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="bg-background flex h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
