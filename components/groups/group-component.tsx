'use client';

import GroupEditModal from '@/components/groups/group-edit-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  useDeleteGroupByIdMutation,
  useGetAllGroupsQuery,
} from '@/queries/group';
import {
  AlarmClock,
  Calculator,
  Component,
  FolderOpen,
  Settings,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import SimpleSummaryCard from '../cards/simple-summary-card';
import TableSkeleton from '../loading/table-skeleton';
import NormalTable from '../table/normal-table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const GroupComponent = () => {
  const searchParam = useSearchParams();
  const search = searchParam.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(search);

  const {
    data: groups = [],
    isLoading,
    error,
  } = useGetAllGroupsQuery(`search=${searchTerm}`);
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

  const router = useRouter();

  // handle search filter with debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const timeout = setTimeout(() => {
      if (term) {
        router.replace(`/groups/all?search=${term}`);
      } else {
        router.replace(`/groups/all`);
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 pt-4 pb-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <SimpleSummaryCard
          label="Total Groups"
          value={groups.length}
          icon={
            <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          }
          valueColor="text-purple-600 dark:text-purple-400"
        />
        <SimpleSummaryCard
          label="Total Clock Devices"
          value={groups.reduce((total, group) => total + group.clock, 0)}
          icon={
            <AlarmClock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Total Attendance Devices"
          value={groups.reduce((total, group) => total + group.attendance, 0)}
          icon={
            <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Total Users in Groups"
          value={
            groups.length > 0
              ? groups.reduce((total, group) => total + group.users, 0)
              : 0
          }
          icon={
            <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
          valueColor="text-green-600 dark:text-green-400"
        />
      </div>

      <Card className="py-4">
        <CardContent>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-nowrap items-center gap-2 text-lg text-nowrap">
              <Component className="text-primary h-6 w-6" />
              All Groups
            </div>
            <div>
              <Input
                type="text"
                placeholder="Search by name or EIIN..."
                className="w-full text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardContent>
      </Card>

      {/* Groups List */}
      <Card>
        <CardContent>
          <NormalTable
            currentPage={1}
            itemsPerPage={10}
            totalItems={groups.length}
            headers={[
              '#',
              'Name',
              'EIIN',
              'Devices',
              'Users',
              'Created',
              'Actions',
            ]}
            isLoading={isLoading}
            data={groups.map((group, index) => [
              index + 1,
              <Link href={`/groups/all/${group._id}`} key={group._id}>
                <span className="text-sm font-medium text-blue-600 hover:underline">
                  {group.name}
                </span>
              </Link>,
              group.eiin,
              <div key="devices" className="flex flex-wrap items-center gap-1">
                <Badge variant={'outline'}>{group.clock || 0} clock</Badge>
                <Badge variant={'outline'}>
                  {group.attendance || 0} attendance
                </Badge>
              </div>,
              <>
                {group.users}
                {group.users > 0 ? ' users' : ' user'}
              </>,
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
