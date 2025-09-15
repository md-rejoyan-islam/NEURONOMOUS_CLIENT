'use client';

import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import UsersTable from '@/components/users/users-table';
import { useProfileQuery } from '@/queries/auth';
import { useGetAllUsersInGroupQuery } from '@/queries/group';
import { useGetUsersQuery } from '@/queries/users';
import clsx from 'clsx';
import { Shield, Users, UserX } from 'lucide-react';
import TableSkeleton from '../loading/table-skeleton';

export default function UsersComponent() {
  const { data: user } = useProfileQuery();

  // All users for superadmin
  const { data: allUsers, isLoading } = useGetUsersQuery(undefined, {
    skip: user?.role !== 'superadmin',
  });
  // All users in the group for admin
  const {
    data: allGroupUsers,
    isLoading: isGroupUsersLoading,
    refetch: groupUserRefetch,
  } = useGetAllUsersInGroupQuery(
    {
      id: user?.group || '',
      query: 'limit=1000',
    },
    {
      skip: user?.role !== 'admin' || !user?.group,
    }
  ) || {
    data: [],
  };

  const users =
    user?.role === 'superadmin' ? allUsers : allGroupUsers?.members || [];

  if (isLoading || isGroupUsersLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      {/* Stats Cards */}
      <div
        className={clsx(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6',
          user?.role === 'superadmin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        )}
      >
        <SimpleSummaryCard
          label="Total Users"
          value={users?.length || 0}
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          valueColor="text-blue-600 dark:text-blue-400"
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
      <UsersTable users={users || []} groupUserRefetch={groupUserRefetch} />
    </>
  );
}
