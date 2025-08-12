"use client";

import SimpleSummaryCard from "@/components/cards/simple-summary-card";
import { CreateAdminModal } from "@/components/create-admin-modal";
import { Button } from "@/components/ui/button";
import UsersTable from "@/components/users/users-table";
import { useGetUsersQuery } from "@/queries/users";
import {
  AlertTriangle,
  Plus,
  Shield,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "superAdmin";
  status: "active" | "inactive" | "banned";
  createdAt: string;
  lastLogin: string;
  deviceAccess: string[];
  groupName?: string;
}

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // RTK Query hooks
  const { data: users, isLoading, error } = useGetUsersQuery();

  console.log(users);

  useEffect(() => {
    // Load current user
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load users</h3>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage admin users and their permissions
          </p>
        </div>
        {(currentUser?.role === "superAdmin" ||
          currentUser?.role === "admin") && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <SimpleSummaryCard
          label="Total Users"
          value={users?.length || 0}
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Active Users"
          value={users?.filter((user) => user.status === "active").length || 0}
          icon={
            <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
          }
          valueColor="text-green-600 dark:text-green-400"
        />
        <SimpleSummaryCard
          label="Banned Users"
          value={
            users?.filter((user) => user.status === "inactive").length || 0
          }
          icon={<UserX className="w-6 h-6 text-red-600 dark:text-red-400" />}
          valueColor="text-red-600 dark:text-red-400"
        />
        <SimpleSummaryCard
          label="Admins"
          value={users?.filter((user) => user.role === "admin").length || 0}
          icon={
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          }
          valueColor="text-purple-600 dark:text-purple-400"
        />
        <SimpleSummaryCard
          label="Super Admins"
          value={
            users?.filter((user) => user.role === "superadmin").length || 0
          }
          icon={
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          }
          valueColor="text-yellow-600 dark:text-yellow-400"
        />
      </div>

      {/* Users List */}
      <UsersTable users={users || []} />

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
