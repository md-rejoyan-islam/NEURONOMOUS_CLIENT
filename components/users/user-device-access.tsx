import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { getStatusColor, getStatusIcon } from '@/lib/helper';
import { IAttendanceDevice, IDevice } from '@/lib/types';
import {
  useGiveDeviceAccessToUserMutation,
  useRevolkDeviceAccessFromUserMutation,
} from '@/queries/devices';

import { MapPin } from 'lucide-react';
import { Label } from 'recharts';
import { toast } from 'sonner';

const UserDeviceAccess = ({
  devices = [],
  userId,
  refetchDevices,
}: {
  devices: {
    deviceType: string;
    device: IDevice | IAttendanceDevice;
  }[];
  userId: string;
  refetchDevices: () => void;
}) => {
  const [revolkDeviceAccess] = useRevolkDeviceAccessFromUserMutation();
  const [giveDeviceAccessToUsers] = useGiveDeviceAccessToUserMutation();

  const clockDevices = devices
    .filter(
      (
        d
      ): d is {
        deviceType: 'clock';
        device: IDevice;
      } => d.deviceType === 'clock'
    )
    .map(({ device }) => device);

  const attendanceDevices = devices
    .filter(
      (
        d
      ): d is {
        deviceType: 'attendance';
        device: IAttendanceDevice;
      } => d.deviceType === 'attendance'
    )
    .map(({ device }) => device);

  const handleDeviceAccessToggle = async (id: string, status: boolean) => {
    try {
      if (status) {
        await revolkDeviceAccess({
          userId: userId,
          deviceId: id,
        }).unwrap();
        toast.success('Device Access Revoked', {
          description: 'User access to the device has been revoked.',
        });
      } else {
        await giveDeviceAccessToUsers({
          userIds: [userId],
          deviceId: id,
        }).unwrap();
        toast.success('Device Access Granted', {
          description: 'User access to the device has been granted.',
        });
      }

      refetchDevices();

      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Error revoking access:', error);
      toast.error('Failed to revoke access', {
        description: error?.data?.message || 'Failed to revoke device access.',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Access</CardTitle>
        <CardDescription>
          Manage which devices this user can access and control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label className="text-sm font-medium">Clock Devices</Label>
          {clockDevices?.map((device) => (
            <div
              key={device._id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(
                    device.status
                  )}`}
                />
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" />
                    {device.location}
                    <span className="mx-1">•</span>
                    {getStatusIcon(device.status)}
                    <span className="capitalize">{device.status}</span>
                  </div>
                </div>
              </div>
              <Switch
                className="cursor-pointer"
                checked={device.allowed_users?.includes(userId)}
                onCheckedChange={() =>
                  handleDeviceAccessToggle(
                    device._id,
                    device.allowed_users?.includes(userId)
                  )
                }
              />
            </div>
          ))}

          <Label className="text-sm font-medium">Attendance Devices</Label>
          {attendanceDevices?.map((device) => (
            <div
              key={device._id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(
                    device.status
                  )}`}
                />
                <div>
                  <div className="font-medium">{device.id}</div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    {/* <MapPin className="h-3 w-3" /> */}
                    {/* {device.location}
                    <span className="mx-1">•</span> */}
                    {getStatusIcon(device.status)}
                    <span className="capitalize">{device.status}</span>
                  </div>
                </div>
              </div>
              <Switch
                className="cursor-pointer"
                checked={device.allowed_users?.includes(userId)}
                onCheckedChange={() =>
                  handleDeviceAccessToggle(
                    device._id,
                    device.allowed_users?.includes(userId)
                  )
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDeviceAccess;
