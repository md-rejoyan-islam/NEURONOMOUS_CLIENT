'use client';
import { useProfileQuery } from '@/queries/auth';
import { useGetAllUsersInGroupQuery } from '@/queries/group';
import { useGetUsersQuery } from '@/queries/users';
import { Users } from 'lucide-react';
import SimpleSummaryCard from '../cards/simple-summary-card';

const TotalUsers = () => {
  const { data: user } = useProfileQuery();

  const { data: allUsers } = useGetUsersQuery(undefined, {
    skip: user?.role !== 'superadmin',
  });

  // All users in the group for admin
  const { data: allGroupUsers } = useGetAllUsersInGroupQuery(
    { id: user?.group || '' },
    {
      skip: user?.role !== 'admin' || !user?.group,
    }
  ) || {
    data: [],
  };

  const users = user?.role === 'superadmin' ? allUsers : allGroupUsers || [];

  return (
    <>
      {user?.role !== 'user' && (
        <SimpleSummaryCard
          label="Total Users"
          value={
            user?.role === 'superadmin'
              ? allUsers?.length || 0
              : allGroupUsers?.pagination.items || 0
          }
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          valueColor="text-blue-600 dark:text-blue-400"
        />
      )}
    </>
  );
};

export default TotalUsers;
