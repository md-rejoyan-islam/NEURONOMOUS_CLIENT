import CreateUserFrom from '@/components/form/create-user-from';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create User',
  description: 'Add a new user to control IoT devices',
};

export default function CreateUserPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <Link href="/users">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-600 p-3">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Create New User</h1>
            <p className="text-muted-foreground mt-1">
              Add a new user to control IoT devices
            </p>
          </div>
        </div>
      </div>

      <CreateUserFrom />
    </div>
  );
}
