'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { socketManager } from '@/lib/socket';
import { useProfileQuery } from '@/queries/auth';
import { useGetAllDevicesQuery } from '@/queries/devices';

import {
  Bell,
  Clock,
  TabletsIcon as Devices,
  DoorClosedLocked,
  Search,
  UserCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimpleSummaryCard from '../cards/simple-summary-card';
import AddDeviceModal from '../groups/add-device-modal';
import BulkOperationModel from '../groups/bulk-operation-model';
import DeviceSkeleton from '../loading/device-skeleton';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceDevices from './attendance-devices';

export default function DevicesComponent({
  query,
}: {
  query?: { mode?: string; status?: string; search?: string; type?: string };
}) {
  const { mode, status, search, type } = query || {};
  const queryString =
    `${mode ? `mode=${mode}&` : ''}${status ? `status=${status}&` : ''}${
      search ? `search=${search}&` : ''
    }${type ? `type=${type}&` : ''}
      `.slice(0, -1);

  const {
    data: devices = [],
    isLoading,
    error,
    refetch: refetchAllDevices,
  } = useGetAllDevicesQuery({ query: queryString });

  const { data: user } = useProfileQuery();

  const usedDevices = devices.reduce((acc, device) => {
    return acc + (device?.allowed_users?.length ? 1 : 0);
  }, 0);

  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      params.set('search', e.target.value);
    } else {
      params.delete('search');
    }
    router.push(`/devices?${params.toString()}`);
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSorting = (value: string) => {
    if (value === 'all') {
      params.delete('status');
      params.delete('mode');
      params.delete('type');
    } else if (value === 'online') {
      params.delete('mode');
      params.delete('type');
      params.set('status', 'online');
    } else if (value === 'offline') {
      params.delete('mode');
      params.delete('type');
      params.set('status', 'offline');
    } else if (value === 'notice') {
      params.delete('status');
      params.delete('type');
      params.set('mode', 'notice');
    } else if (value === 'clock') {
      params.delete('status');
      params.delete('type');
      params.set('mode', 'clock');
    } else if (value === 'single') {
      params.delete('status');
      params.delete('mode');
      params.set('type', 'single');
    } else if (value === 'double') {
      params.delete('status');
      params.delete('mode');
      params.set('type', 'double');
    }
    router.push(`/devices?${params.toString()}`);
  };

  useEffect(() => {
    const socket = socketManager.connect();
    if (!socket) return;
    const handler = () => refetchAllDevices();
    socket.on('device:status', handler);
    return () => {
      socket.off('device:status', handler);
    };
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <DeviceSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">Failed to load devices</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Regular Device List View (for admins or when viewing specific group/all devices)
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Device Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and control all your IoT devices from one place.
          </p>
        </div>
        {user?.role === 'admin' && user?.group && (
          <div>
            <AddDeviceModal
              groupId={user?.group}
              refetchAllDevices={refetchAllDevices}
            />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-6 py-3">
        <Tabs defaultValue="clock">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="clock" className="w-full sm:w-fit">
              <Clock className="mr-2 h-4 w-4" />
              Clock & Notice
              <span className="hidden sm:block">&nbsp;Device </span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="w-full sm:w-fit">
              <UserCheck className="mr-2 h-4 w-4" />
              Attendance <span className="hidden sm:block">&nbsp;Device </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="clock">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 pt-4 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <SimpleSummaryCard
                label="Total Devices"
                value={devices.length}
                icon={
                  <DoorClosedLocked className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                }
                valueColor="text-blue-600 dark:text-blue-400"
              />
              <SimpleSummaryCard
                label="Online Devices"
                value={
                  filteredDevices.filter((d) => d.status === 'online').length
                }
                icon={
                  <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
                }
                valueColor="text-green-600 dark:text-green-400"
              />

              <SimpleSummaryCard
                label="Notice Mode"
                value={
                  filteredDevices.filter((d) => d.mode === 'notice').length
                }
                icon={
                  <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                }
                valueColor="text-orange-600 dark:text-orange-400"
              />
              {user?.role === 'superadmin' && (
                <SimpleSummaryCard
                  label="Unused Devices"
                  value={devices.length - usedDevices}
                  icon={
                    <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  }
                  valueColor="text-orange-600 dark:text-orange-400"
                />
              )}
            </div>

            {/* Search and Filter */}
            {/* <Card>
        <CardHeader> */}
            <Card className="py-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-4 px-4 sm:flex-row sm:items-center">
                <CardTitle className="flex items-center gap-2 text-lg text-nowrap">
                  <Clock className="text-primary h-5 w-5" /> Clock & Notice
                  Devices
                </CardTitle>

                {/* sort by status  with select */}
                <div className="min-w-[130px]">
                  <Select
                    onValueChange={(value) => {
                      handleSorting(value);
                    }}
                    disabled={isLoading}
                    defaultValue={status || mode || type || 'all'}
                  >
                    <SelectTrigger className="w-full text-sm sm:text-base">
                      <SelectValue placeholder="Filter devices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="clock">Clock</SelectItem>
                      <SelectItem value="single">Single Board</SelectItem>
                      <SelectItem value="double">Double Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Operation & Search */}

                <div className="flex gap-2 min-[500px]:ml-auto">
                  <BulkOperationModel devices={devices || []} />
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search devices..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e)}
                      className="w-full pl-10 sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </Card>
            {/* </CardHeader>
        <CardContent> */}
            <div className="mt-5 grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
              {filteredDevices.map((device) => (
                <Card
                  key={device.id}
                  className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <CardHeader className="pb-1">
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-lg font-semibold">
                          {device.name || device.id}
                        </CardTitle>
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        {device.status === 'online' ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            device.status === 'online'
                              ? 'default'
                              : 'destructive'
                          }
                          className={
                            device.status === 'online'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                              : ''
                          }
                        >
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Mode:
                      </span>
                      <div className="flex items-center gap-1">
                        {device.mode === 'clock' ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Bell className="h-4 w-4 text-orange-500" />
                        )}
                        <Badge variant="outline" className="capitalize">
                          {device.mode}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Boards:
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {device.type}
                      </Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Timestamp:
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(device.timestamp).toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-xs font-medium">
                        {device.location || 'N/A'}
                      </span>
                    </div>

                    {device.notice && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/30 dark:bg-orange-900/20">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                          Current Notice:
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {device.notice}
                        </p>
                      </div>
                    )}

                    <Link href={`/devices/${device._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDevices.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Devices className="mx-auto h-16 w-16" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No devices found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search terms.'
                    : 'Connect your IoT devices to get started.'}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="attendance">
            <div className="grid grid-cols-1 gap-4 pt-4 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <SimpleSummaryCard
                label="Total Devices"
                value={5}
                icon={
                  <DoorClosedLocked className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                }
                valueColor="text-blue-600 dark:text-blue-400"
              />
              <SimpleSummaryCard
                label="Online Devices"
                value={2}
                icon={
                  <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
                }
                valueColor="text-green-600 dark:text-green-400"
              />

              <SimpleSummaryCard
                label="Offline Devices"
                value={3}
                icon={
                  <WifiOff className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                }
                valueColor="text-orange-600 dark:text-orange-400"
              />
              {user?.role === 'superadmin' && (
                <SimpleSummaryCard
                  label="Unused Devices"
                  value={3}
                  icon={
                    <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  }
                  valueColor="text-orange-600 dark:text-orange-400"
                />
              )}
            </div>
            <Card className="py-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-4 px-4 sm:flex-row sm:items-center">
                <CardTitle className="flex items-center gap-2 text-lg text-nowrap">
                  <UserCheck className="text-primary h-5 w-5" /> Attendance
                  Devices
                </CardTitle>

                {/* sort by status  with select */}
                <div className="min-w-[130px]">
                  <Select
                    onValueChange={(value) => {
                      handleSorting(value);
                    }}
                    disabled={isLoading}
                    defaultValue={status || mode || type || 'all'}
                  >
                    <SelectTrigger className="w-full text-sm sm:text-base">
                      <SelectValue placeholder="Filter devices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search devices..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e)}
                      className="w-full pl-10 sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-5 grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
              <AttendanceDevices />
            </div>

            {filteredDevices.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Devices className="mx-auto h-16 w-16" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No devices found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search terms.'
                    : 'Connect your IoT devices to get started.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
}
