"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
const UserErrorPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="py-12 text-center">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The user you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/users">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserErrorPage;
