import { useProfileQuery } from '@/queries/auth';
import { useGetAllDevicesQuery } from '@/queries/devices';
import {
  Bell,
  TabletsIcon as Devices,
  DoorClosedLocked,
  Mail,
  School,
  Search,
  User,
  UserCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import SimpleSummaryCard from '../cards/simple-summary-card';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

import { useGetAllAttendanceDevicesQuery } from '@/queries/attendance-device';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const AttendanceDevicesView = ({
  query,
}: {
  query?: { mode?: string; status?: string; search?: string; type?: string };
}) => {
  const { mode, status, search, type } = query || {};
  const {
    data: attendanceDevices,
    isLoading,
    error,
  } = useGetAllAttendanceDevicesQuery({});

  const queryString =
    `${mode ? `mode=${mode}&` : ''}${status ? `status=${status}&` : ''}${
      search ? `search=${search}&` : ''
    }${type ? `type=${type}&` : ''}
        `.slice(0, -1);

  const { data: devices = [] } = useGetAllDevicesQuery({ query: queryString });

  const { data: user } = useProfileQuery();

  const unUsedDevices =
    attendanceDevices?.reduce((acc, device) => {
      return acc + (device?.group ? 0 : 1);
    }, 0) || 0;

  const [searchTerm, setSearchTerm] = useState(query?.search || '');

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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 pt-4 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <SimpleSummaryCard
          label="Total Devices"
          value={attendanceDevices?.length || 0}
          icon={
            <DoorClosedLocked className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Online Devices"
          value={
            attendanceDevices?.filter((d) => d.status === 'online').length || 0
          }
          icon={<Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />}
          valueColor="text-green-600 dark:text-green-400"
        />

        <SimpleSummaryCard
          label="Offline Devices"
          value={
            attendanceDevices?.filter((d) => d.status === 'offline').length || 0
          }
          icon={
            <WifiOff className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          }
          valueColor="text-orange-600 dark:text-orange-400"
        />
        {user?.role === 'superadmin' && (
          <SimpleSummaryCard
            label="Unused Devices"
            value={unUsedDevices}
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
            <UserCheck className="text-primary h-5 w-5" /> Attendance Devices
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
        {attendanceDevices?.map((device) => (
          <Card
            key={device.id}
            className="transition-all duration-300 hover:scale-[1.02] hover:transform hover:shadow-xl"
          >
            <CardContent>
              <Link href={`/devices/attendance/${device._id}`}>
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 p-2">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {(device.allowed_users?.length &&
                            device?.allowed_users[0]?.first_name) ||
                            device.group?.admin.first_name ||
                            'No Admin Assigned'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Device Id: {device.id}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-2">
                      {device.status === 'online' ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )}
                      <Badge
                        variant={
                          device.status === 'online' ? 'default' : 'destructive'
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
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="text-primary mr-2 h-4 w-4" />
                      {(device.allowed_users?.length &&
                        device?.allowed_users[0]?.email) ||
                        device.group?.admin.email ||
                        'No Admin Assigned'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <School className="text-primary mr-2 h-4 w-4" />
                      {device?.group?.name || 'No Group Assigned'}
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          36
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Courses
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(device.last_seen).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Last Update</div>
                      </div>
                    </div>
                  </div>
                </div>
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
    </>
  );
};

export default AttendanceDevicesView;
