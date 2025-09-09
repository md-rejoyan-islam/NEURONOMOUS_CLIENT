'use client';
import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import AddDeviceModal from '@/components/groups/add-device-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UsersTable from '@/components/users/users-table';
import { IDevice } from '@/lib/types';
import {
  useGetAllUsersInGroupQuery,
  useGetGroupdByIdQuery,
} from '@/queries/group';
import {
  ArrowLeft,
  Bell,
  Search,
  TabletsIcon,
  UserPlus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import GroupSkeleton from '../loading/group-skeleton';
import BulkOperationModel from './bulk-operation-model';
import SingleGroupDevice from './single-group-device';

const SingleGroupComponent = ({ _id }: { _id: string }) => {
  const {
    data: group,
    isLoading,
    refetch: refetchGroup,
    error,
  } = useGetGroupdByIdQuery(_id as string);

  const [filteredDevices, setFilteredDevices] = useState<IDevice[]>([]);

  const {
    data: usersData,
    refetch,
    isLoading: isUserLoading,
  } = useGetAllUsersInGroupQuery(_id as string);

  console.log(usersData);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const lowerTerm = term.toLowerCase();
      const filtered = group?.devices.filter(
        (device) =>
          device.id.toLowerCase().includes(lowerTerm) ||
          device?.name?.toLowerCase().includes(lowerTerm)
      );
      setFilteredDevices(filtered ?? []);
    } else {
      setFilteredDevices(group?.devices ?? []);
    }
  };

  useEffect(() => {
    if (group?.devices) {
      setFilteredDevices(group?.devices);
    }
  }, [group?.devices]);

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
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle className="flex items-center gap-2">
                <TabletsIcon className="text-primary h-5 w-5" />
                All Devices
              </CardTitle>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <BulkOperationModel
                  devices={group?.devices ?? []}
                  refetch={refetchGroup}
                  setFilteredDevices={setFilteredDevices}
                />
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search devices..."
                    value={searchTerm}
                    disabled={group?.devices.length === 0}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.map((device) => (
                <SingleGroupDevice
                  key={device.id}
                  device={device}
                  groupId={_id}
                />
              ))}
            </div>

            {filteredDevices?.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <TabletsIcon className="mx-auto h-16 w-16" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No devices found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search terms.'
                    : 'Connect your IoT devices to get started.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* users table  */}

        <UsersTable users={usersData ?? []} refetch={refetch} />
      </div>
    </>
  );
};

export default SingleGroupComponent;
