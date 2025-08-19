'use client';

import GroupCreateModal from '@/components/groups/group-create-modal';
import GroupEditModal from '@/components/groups/group-edit-modal';
import SmallLoading from '@/components/loading/small-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileQuery } from '@/queries/auth';
import { useGetAllGroupsQuery } from '@/queries/group';
import {
  TabletsIcon as Devices,
  FolderOpen,
  Settings,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const GroupComponent = () => {
  const { data: user, isLoading: loading } = useProfileQuery();

  const { data: groups = [] } = useGetAllGroupsQuery();

  const router = useRouter();

  const handleDeleteGroup = () => {
    toast.success('Group Deleted', {
      description: `Group  has been deleted.`,
    });
  };

  if (!user || user.role !== 'superadmin') {
    router.push('/');
  }

  if (loading) {
    return <SmallLoading />;
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Groups
                </p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Devices
                </p>
                <p className="text-2xl font-bold">
                  {groups.reduce(
                    (total, group) => total + group.devices.length,
                    0
                  )}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <Devices className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Users in Groups
                </p>
                <p className="text-2xl font-bold">
                  {groups.length > 0
                    ? groups.reduce(
                        (total, group) => total + group.members.length,
                        0
                      )
                    : 0}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card
                key={group._id}
                className="transition-shadow duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <Link href={`/groups/${group._id}`}>
                        <CardTitle className="truncate text-lg font-semibold">
                          {group.name}
                        </CardTitle>
                      </Link>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {group.description}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
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
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Devices:
                    </span>
                    <Badge variant="outline">
                      {group.devices.length} devices
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Users:
                    </span>
                    <Badge variant="outline">
                      {group.members?.length} user
                      {group.members?.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Created:
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/groups/${group._id}`}>
                      <Button className="flex-1" size="sm">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        View Group
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {groups.length === 0 && (
            <div className="py-12 text-center">
              <FolderOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No device groups</h3>
              <p className="text-muted-foreground mb-4">
                Create your first device group to organize your devices.
              </p>
              <GroupCreateModal />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default GroupComponent;
