'use client';

import { useProfileQuery } from '@/queries/auth';
import { useGetAllDevicesQuery } from '@/queries/devices';

import { Clock, DoorClosedLocked, UserCheck } from 'lucide-react';
import AddDeviceModal from '../groups/add-device-modal';
import DeviceSkeleton from '../loading/device-skeleton';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceDevicesView from './attendance-devices-view';
import ClockDevicesView from './clock-devices-view';

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

  const { refetch: refetchAllDevices } = useGetAllDevicesQuery({
    query: queryString,
  });

  const { data: user, isLoading } = useProfileQuery();

  if (isLoading) {
    return <DeviceSkeleton />;
  }

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
            <ClockDevicesView query={query} />
          </TabsContent>
          <TabsContent value="attendance">
            <AttendanceDevicesView query={query} />
          </TabsContent>
        </Tabs>
      </div>

      {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
}
