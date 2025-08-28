'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { socketManager } from '@/lib/socket';
import { useProfileQuery } from '@/queries/auth';
import { useGetAllDevicesQuery } from '@/queries/devices';
import {
  ArrowDown,
  Bell,
  Clock,
  TabletsIcon as Devices,
  Search,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SimpleSummaryCard from '../cards/simple-summary-card';
import AddDeviceModal from '../groups/add-device-modal';
import BulkOperationModel from '../groups/bulk-operation-model';
import DeviceSkeleton from '../loading/device-skeleton';

export default function DevicesComponent() {
  const {
    data: devices = [],
    isLoading,
    error,
    refetch: refetchAllDevices,
  } = useGetAllDevicesQuery();

  const { data: user } = useProfileQuery();

  const usedDevices = devices.reduce((acc, device) => {
    return acc + (device?.allowed_users?.length ? 1 : 0);
  }, 0);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSummaryDownload = () => {
    // Logic to generate and download the summary report
    console.log('Downloading summary report...');

    const data = devices.map((device) => ({
      id: device.id,
      mac_id: device.mac_id,
      name: device.name,
      type: device.type,
      firmware: device.firmware_version,
      location: device.location,
    }));

    // download json format of devices
    const headers = Object.keys(data[0]).join(',') + '\n';
    const rows = data
      .map((obj) =>
        Object.values(obj)
          .map((v) => `"${v}"`)
          .join(',')
      )
      .join('\n');

    const csv = headers + rows;

    // Create data URI
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'devices_summary.csv');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

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
            <Devices className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Device Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and control your IoT devices
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 pt-4 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <SimpleSummaryCard
          label="Total Devices"
          value={devices.length}
          icon={
            <Devices className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <SimpleSummaryCard
          label="Online Devices"
          value={filteredDevices.filter((d) => d.status === 'online').length}
          icon={<Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />}
          valueColor="text-green-600 dark:text-green-400"
        />

        <SimpleSummaryCard
          label="Notice Mode"
          value={filteredDevices.filter((d) => d.mode === 'notice').length}
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
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="flex items-center gap-2">
              <Devices className="text-primary h-5 w-5" />
              All Devices
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button variant={'outline'} onClick={handleSummaryDownload}>
                  <ArrowDown className="text-primary animate-bounce" />
                  Summary
                </Button>
              </div>
              <div className="flex gap-2">
                <BulkOperationModel devices={devices || []} />
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDevices.map((device) => (
              <Card
                key={device.id}
                className="transition-shadow duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between">
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
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Mode:</span>
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
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{device.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-xs font-medium">
                        {device.location || 'N/A'}
                      </span>
                    </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
