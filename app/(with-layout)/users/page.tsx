'use client';

import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import { CreateUserModal } from '@/components/create-user-modal';
import { Button } from '@/components/ui/button';
import UsersTable from '@/components/users/users-table';
import { useProfileQuery } from '@/queries/auth';
import {
  useGetAllGroupDevicesQuery,
  useGetAllUsersInGroupQuery,
} from '@/queries/group';
import { useGetUsersQuery } from '@/queries/users';
import { Plus, Shield, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'superAdmin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin: string;
  deviceAccess: string[];
  groupName?: string;
}

export default function UsersPage() {
  const { data: user } = useProfileQuery();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // All users for superadmin
  const { data: allUsers, isLoading } = useGetUsersQuery(undefined, {
    skip: user?.role !== 'superadmin',
  });
  // All users in the group for admin
  const {
    data: allGroupUsers,
    isLoading: isGroupUsersLoading,
    refetch: groupUserRefetch,
  } = useGetAllUsersInGroupQuery(user?.group || '', {
    skip: user?.role !== 'admin' || !user?.group,
  }) || {
    data: [],
  };

  const users = user?.role === 'superadmin' ? allUsers : allGroupUsers || [];

  // Get all group devices
  const { data: allGroupDevices } = useGetAllGroupDevicesQuery(
    user?.group || '',
    {
      skip: user?.role !== 'admin' || !user?.group,
    }
  );

  if (isLoading || isGroupUsersLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="p-4 sm:p-6">
  //       <div className="text-center py-12">
  //         <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
  //         <h3 className="text-lg font-medium mb-2">Failed to load users</h3>
  //         <p className="text-muted-foreground">
  //           Please try refreshing the page.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
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
        {user?.role === 'admin' && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <SimpleSummaryCard
          label="Total Users"
          value={users?.length || 0}
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Active Users"
          value={users?.filter((user) => user.status === 'active').length || 0}
          icon={
            <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
          valueColor="text-green-600 dark:text-green-400"
        />
        <SimpleSummaryCard
          label="Banned Users"
          value={
            users?.filter((user) => user.status === 'inactive').length || 0
          }
          icon={<UserX className="h-6 w-6 text-red-600 dark:text-red-400" />}
          valueColor="text-red-600 dark:text-red-400"
        />
        <SimpleSummaryCard
          label="Admins"
          value={users?.filter((user) => user.role === 'admin').length || 0}
          icon={
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          }
          valueColor="text-purple-600 dark:text-purple-400"
        />
        {user?.role === 'superadmin' && (
          <SimpleSummaryCard
            label="Super Admins"
            value={
              users?.filter((user) => user.role === 'superadmin').length || 0
            }
            icon={
              <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            }
            valueColor="text-yellow-600 dark:text-yellow-400"
          />
        )}
      </div>

      {/* Users List */}
      <UsersTable users={users || []} />

      {/* Create Admin Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        devices={allGroupDevices || []}
        groupId={user?.group || ''}
        groupUserRefetch={groupUserRefetch}
      />
    </div>
  );
}
