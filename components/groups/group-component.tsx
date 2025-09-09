'use client';

import GroupEditModal from '@/components/groups/group-edit-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllGroupsQuery } from '@/queries/group';
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

  const handleDeleteGroup = () => {
    toast.success('Group Deleted', {
      description: `Group  has been deleted.`,
    });
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
              `${group.devices.length} device${group.devices.length !== 1 ? 's' : ''}`,
              <>
                {(() => {
                  const count = group.members.reduce(
                    (acc, m) => acc + (!m.is_guest ? 1 : 0),
                    0
                  );
                  return `${count} user${count !== 1 ? 's' : ''}`;
                })()}
              </>,
              <>
                {(() => {
                  const count = group.members.reduce(
                    (acc, m) => acc + (m.is_guest ? 1 : 0),
                    0
                  );
                  return `${count} user${count !== 1 ? 's' : ''}`;
                })()}
              </>,
              new Date(group.createdAt).toLocaleDateString(),

              <div className="flex items-center gap-2" key={'actions'}>
                <GroupEditModal
                  name={group.name}
                  description={group.description}
                  _id={group._id}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGroup()}
                  disabled={true}
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
