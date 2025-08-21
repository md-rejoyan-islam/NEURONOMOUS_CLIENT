'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { socketManager } from '@/lib/socket';
import {
  useGetAllScheduledNoticesQuery,
  useGetDeviceQuery,
} from '@/queries/devices';
import {
  ArrowLeft,
  Bell,
  Clock,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SmallLoading from '../loading/small-loading';
import DeviceAllowedUsers from './device-allowed-users';
import FontChange from './font-change';
import ModeChange from './mode-change';
import NoticeMessage from './notice-message';
import ScheduledNotice from './scheduled-notice';
import TimeFormatChange from './time-format-change';

export default function SingleDevice({ id }: { id: string }) {
  const router = useRouter();

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
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div>
          <Button
            onClick={() => router.push('/devices')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Devices
          </Button>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{device.name}</h1>
              <p className="text-muted-foreground mt-1">
                Device ID: {device.id}
              </p>
            </div>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Device Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="text-primary h-5 w-5" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Status
                  </Label>
                  <p className="text-lg font-semibold capitalize">
                    {device?.status}
                  </p>
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Location
                  </Label>
                  <p className="font-semibold">{device?.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Uptime
                  </Label>
                  <p className="font-semibold">{device?.uptime}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Current Font
                  </Label>
                  <p className="font-semibold">
                    {device?.font || 'Default Font'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Time Format
                  </Label>
                  <p className="text-sm font-semibold">
                    {device?.time_format === '12h'
                      ? '12-Hour Format'
                      : '24-Hour Format'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Free Heap
                  </Label>
                  <p className="text-lg font-semibold">{device?.free_heap}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Last Seen
                  </Label>
                  <p className="text-sm font-semibold">{device?.last_seen}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Version
                  </Label>
                  <p className="text-lg font-semibold">
                    {device?.version || '0.0.0'}
                  </p>
                </div>
              </div>

              {device?.notice && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Button className="group">
                    <Download className="h-4 w-4 group-hover:animate-bounce" />
                    <span>Update Firmware (v1.0.1 available)</span>
                  </Button>
                </div>
              </div>
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
        <div className="space-y-6">
          {/* Scheduled Notices */}
          <ScheduledNotice id={id} schedules={schedules} />
        </div>
        <div className="space-y-6">
          {/* allowed users */}
          <DeviceAllowedUsers id={id} group={device.group} />
        </div>
      </div>
    </>
  );
}
