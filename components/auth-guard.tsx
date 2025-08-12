"use client";

import { useProfileQuery } from "@/queries/auth";
import { Loader2 } from "lucide-react";

export function AuthGuard({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { isLoading, error, data } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
