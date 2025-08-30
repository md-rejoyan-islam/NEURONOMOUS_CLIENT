'use client';

import { socketManager } from '@/lib/socket';
import { useProfileQuery } from '@/queries/auth';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { isLoading, error, data } = useProfileQuery();

  useEffect(() => {
    if (!data) return;

    // Initialize socket connection when app starts (optional)
    console.log('Initializing socket connection2...');
    const socket = socketManager.connect();

    if (socket) {
      socket.auth = { userId: data._id };
      console.log('Socket manager initialized');
    } else {
      console.log('Running without socket connection (offline mode)');
    }
  }, [data]);

  if (error) {
    redirect('/login');
  }

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
