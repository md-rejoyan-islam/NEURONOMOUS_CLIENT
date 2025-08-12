import CreateUserFrom from "@/components/form/create-user-from";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create User",
  description: "Add a new user to control IoT devices",
};

export default function CreateUserPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <Link href="/users">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-3 rounded-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Create New User</h1>
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
