import UsersComponent from "@/components/users/users-component";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management",
  description: "Manage users and their permissions within the application",
};

const UsersPage = () => {
  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Users className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage admin users and their permissions
            </p>
          </div>
        </div>
        <UsersComponent />
      </div>
    </>
  );
};

export default UsersPage;
