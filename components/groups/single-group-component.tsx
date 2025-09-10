'use client';
import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import AddDeviceModal from '@/components/groups/add-device-modal';
import { Button } from '@/components/ui/button';
import UsersTable from '@/components/users/users-table';
import {
  useGetAllUsersInGroupQuery,
  useGetGroupdByIdQuery,
} from '@/queries/group';
import {
  ArrowLeft,
  Bell,
  TabletsIcon,
  UserPlus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import GroupSkeleton from '../loading/group-skeleton';
import GroupDevicesView from './group-devices-view';

const SingleGroupComponent = ({ _id }: { _id: string }) => {
  const {
    data: group,
    isLoading,
    refetch: refetchGroup,
    error,
  } = useGetGroupdByIdQuery(_id as string);

  const {
    data: usersData,
    refetch,
    isLoading: isUserLoading,
  } = useGetAllUsersInGroupQuery(_id as string);

  if (isLoading || isUserLoading) {
    return <GroupSkeleton />;
  }

  if (error) {
    throw new Error('Failed to fetch group data');
  }

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link href={`/groups`}>
              <Button variant="outline" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Groups
              </Button>
            </Link>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <TabletsIcon className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
              {group?.name}
            </h1>

            <p className="text-muted-foreground mt-1">{group?.description}</p>
          </div>
          <div className="flex gap-2">
            <AddDeviceModal groupId={_id as string} />
            <Link href={'/create-user'}>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <SimpleSummaryCard
            label="Total Devices"
            value={group?.devices.length || 0}
            valueColor="text-primary"
            icon={
              <TabletsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            }
          />

          <SimpleSummaryCard
            label="Online"
            valueColor="text-green-600"
            value={
              group?.devices?.filter((d) => d.status === 'online').length ?? 0
            }
            icon={
              <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
            }
          />
          <SimpleSummaryCard
            label="Ofline"
            value={
              group?.devices.filter((d) => d.status === 'offline').length ?? 0
            }
            valueColor="text-red-600"
            icon={
              <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400" />
            }
          />

          <SimpleSummaryCard
            label="Notice Mode"
            valueColor="text-orange-600"
            value={
              group?.devices.filter((d) => d.mode === 'notice').length ?? 0
            }
            icon={
              <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            }
          />
        </div>

        {/* Search and Filter */}
        <GroupDevicesView group={group!} refetchGroup={refetchGroup} id={_id} />

        {/* users table  */}

        <UsersTable users={usersData ?? []} refetch={refetch} />
      </div>
    </>
  );
};

export default SingleGroupComponent;
