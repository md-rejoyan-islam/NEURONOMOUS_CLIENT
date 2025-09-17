'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { socketManager } from '@/lib/socket';
import { useProfileQuery } from '@/queries/auth';
import {
  useGetAllScheduledNoticesQuery,
  useGetDeviceQuery,
} from '@/queries/devices';
import { Bell, Clock, Cuboid, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import SmallLoading from '../loading/small-loading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import DeviceAllowedUsers from './device-allowed-users';
import FirmwareUpdate from './firmware-update';
import FontChange from './font-change';
import ModeChange from './mode-change';
import NoticeMessage from './notice-message';
import RestartDevice from './restart-device';
import ScheduledNotice from './scheduled-notice';
import TimeFormatChange from './time-format-change';

export default function SingleDevice({ id }: { id: string }) {
  const { data: user } = useProfileQuery();

  const {
    data: device,
    isLoading,
    error,
    refetch: refetchDevice,
  } = useGetDeviceQuery({ id });

  const { data: schedules, refetch } = useGetAllScheduledNoticesQuery({ id });

  useEffect(() => {
    if (!device) return;
    const socket = socketManager.connect();
    if (!socket) return;
    const handler = () => refetchDevice();
    console.log('mode change for device:', device.id);

    socket.on(`device:${device.id}:status`, handler);
    return () => {
      socket.off(`device:${device.id}:status`, handler);
    };
    // eslint-disable-next-line
  }, [device?.id]);

  if (isLoading) {
    return <SmallLoading />;
  }

  if (error || !device) {
    throw new Error('Device not found');
  }

  return (
    <div className="space-y-4 p-2 sm:p-6">
      {/* Header */}
      <div>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/devices">Devices</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{device?.name || device?._id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-row-reverse items-center gap-3">
            <RestartDevice
              id={id}
              isActive={device.status === 'online' ? true : false}
            />
            <div className="flex items-center gap-2">
              {device.status === 'online' ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <Badge
                variant={device.status === 'online' ? 'default' : 'destructive'}
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Cuboid className="text-primary h-5 w-5" />
                Device Information
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {user &&
                ['admin', 'superadmin'].includes(user?.role) &&
                device?.available_firmwares?.length > 0 && (
                  <div>
                    <FirmwareUpdate
                      version={device.available_firmwares[0].version}
                      id={id}
                      firmwareId={device.available_firmwares[0]._id}
                      disabled={device.status !== 'online'}
                    />
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Device ID
                </Label>
                <p className="font-semibold capitalize">{device?.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Device Name
                </Label>
                <p className="font-semibold capitalize">
                  {device?.name || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Status
                </Label>
                <p className="font-semibold capitalize">{device?.status}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Current Mode
                </Label>
                <div className="mt-1 flex items-center gap-2">
                  {device?.mode === 'clock' ? (
                    <Clock className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Bell className="h-4 w-4 text-orange-500" />
                  )}
                  <span className="font-semibold capitalize">
                    {device?.mode}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Location
                </Label>
                <p className="font-semibold">{device?.location || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Last Timestamp
                </Label>
                <p className="font-semibold">
                  {device?.timestamp
                    ? new Date(device?.timestamp).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Uptime
                </Label>
                <p className="font-semibold">{device?.uptime}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Current Font
                </Label>
                <p className="font-semibold">{device?.font || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Time Format
                </Label>
                <p className="text-sm font-semibold">
                  {device?.time_format || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm font-medium">
                  Current Version
                </Label>
                <p className="text-lg font-semibold">
                  {device?.firmware_version || 'N/A'}
                </p>
              </div>
              {user?.role === 'superadmin' && (
                <>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Mac ID
                    </Label>
                    <p className="text-lg font-semibold">
                      {device?.mac_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Free Heap
                    </Label>
                    <p className="text-lg font-semibold">
                      {device?.free_heap || 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {device?.notice && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/30 dark:bg-orange-900/20">
                <Label className="text-sm font-medium text-orange-800 dark:text-orange-400">
                  Current Notice
                </Label>
                <p className="mt-1 text-orange-700 dark:text-orange-300">
                  {device.notice}
                </p>
                {device.duration && (
                  <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                    Duration: {device.duration} minutes
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Mode Control */}
        <div className="space-y-6">
          {/* mode change  */}
          {<ModeChange device={device} id={id} />}
          {/* Notice Message Control */}
          <NoticeMessage id={id} refetch={refetch} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* font change  */}
        <FontChange device={device} />
        {/* time format    */}
        <TimeFormatChange device={device} />
      </div>
      {/* Scheduled Notices */}
      {schedules && schedules.length > 0 && (
        <div className="space-y-6">
          <ScheduledNotice id={id} schedules={schedules} />
        </div>
      )}

      {/* allowed users */}
      <DeviceAllowedUsers id={id} group={device.group} />
    </div>
  );
}
