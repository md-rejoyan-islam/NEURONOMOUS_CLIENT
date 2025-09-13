'use client';

import { useProfileQuery } from '@/queries/auth';
import { useGetAllGroupsQuery } from '@/queries/group';
import { FolderOpen } from 'lucide-react';
import SimpleSummaryCard from '../cards/simple-summary-card';

const TotalGroups = () => {
  const { data: user } = useProfileQuery();
  const { data: groups = [] } = useGetAllGroupsQuery('');
  return (
    <>
      {user?.role === 'superadmin' && (
        <SimpleSummaryCard
          label="Total Groups"
          value={groups.length}
          icon={
            <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          }
          valueColor="text-purple-600 dark:text-purple-400"
        />
      )}
    </>
  );
};

export default TotalGroups;
