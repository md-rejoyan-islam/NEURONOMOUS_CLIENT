'use client';

import { useProfileQuery } from '@/queries/auth';
import { Loader2 } from 'lucide-react';

export function AuthGuard({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { isLoading } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
