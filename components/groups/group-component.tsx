'use client';

import GroupEditModal from '@/components/groups/group-edit-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

const GroupComponent = () => {
  const { data: groups = [], isLoading } = useGetAllGroupsQuery();

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
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 dark:bg-primary/5">
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Devices</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-center">Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:text-white/70">
              {groups.length ? (
                groups.map((group, index) => (
                  <TableRow key={group._id}>
                    <TableCell className="w-12">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/groups/${group._id}`}>
                        <span className="text-sm font-medium hover:underline">
                          {group.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {group.devices.length} device
                        {group.devices.length !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {group.members.length} user
                        {group.members.length !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="mx-auto flex items-center justify-center">
                      <div className="flex items-center gap-2">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default GroupComponent;
