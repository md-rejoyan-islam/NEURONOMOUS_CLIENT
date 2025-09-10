'use client';

import GroupEditModal from '@/components/groups/group-edit-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDeleteGroupByIdMutation,
  useGetAllGroupsQuery,
} from '@/queries/group';
import {
  TabletsIcon as Devices,
  FolderOpen,
  Settings,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import SimpleSummaryCard from '../cards/simple-summary-card';
import TableSkeleton from '../loading/table-skeleton';
import NormalTable from '../table/normal-table';

const GroupComponent = () => {
  const { data: groups = [], isLoading, error } = useGetAllGroupsQuery();
  const [deleteGroup] = useDeleteGroupByIdMutation();

  const handleDeleteGroup = (id: string) => {
    try {
      deleteGroup(id).unwrap();

      toast.success('Group Deleted', {
        description: `Group  has been deleted.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Group Deletion Failed', {
        description: error?.data?.message || 'Could not delete the group.',
      });
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <SimpleSummaryCard
          label="Total Groups"
          value={groups.length}
          icon={
            <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          }
          valueColor="text-purple-600 dark:text-purple-400"
        />
        <SimpleSummaryCard
          label="Total Devices"
          value={groups.reduce(
            (total, group) => total + group.devices.length,
            0
          )}
          icon={
            <Devices className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Total Users in Groups"
          value={
            groups.length > 0
              ? groups.reduce((total, group) => total + group.members.length, 0)
              : 0
          }
          icon={
            <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
          valueColor="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Groups List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="text-primary h-5 w-5" />
            Device Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NormalTable
            headers={[
              '#',
              'Name',
              'EIIN',
              'Devices',
              'Regular Users',
              'Guests Users',
              'Created',
              'Actions',
            ]}
            isLoading={isLoading}
            data={groups.map((group, index) => [
              index + 1,
              <Link href={`/groups/${group._id}`} key={group._id}>
                <span className="text-sm font-medium text-blue-600 hover:underline">
                  {group.name}
                </span>
              </Link>,
              group.eiin,
              `${group.devices.length} device${group.devices.length !== 1 ? 's' : ''}`,
              <>
                {group.members.length}
                {group.members.length > 0 ? ' users' : ' user'}
              </>,
              'not set',
              new Date(group.createdAt).toLocaleDateString(),

              <div className="flex items-center gap-2" key={'actions'}>
                <GroupEditModal
                  name={group.name}
                  description={group.description}
                  _id={group._id}
                  eiin={group.eiin} // to be added later
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGroup(group._id)}
                  className="h-8 w-8 cursor-pointer bg-red-200/50 p-1 text-red-600 hover:text-red-700 dark:bg-red-200/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>,
            ])}
            noDataMessage="No groups available."
          />
        </CardContent>
      </Card>
    </>
  );
};

export default GroupComponent;
