import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IDevice } from '@/lib/types';
import { formatLastSeen, formatUptime } from '@/lib/utils';
import { useRemoveDeviceFromGroupMutation } from '@/queries/group';
import { Bell, Clock, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationModal from '../modal/delete-confirmation-modal';

const SingleGroupDevice = ({
  device,
  groupId,
}: {
  device: IDevice;
  groupId: string;
}) => {
  const [removeDeviceFromGroup] = useRemoveDeviceFromGroupMutation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const removeDevice = async () => {
    try {
      await removeDeviceFromGroup({
        id: groupId,
        deviceId: device._id,
      }).unwrap();
      toast.success('Device removed from group', {
        description: `Device ${device.name} has been removed from the group.`,
      });
      setOpenDeleteModal(false);
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to remove device', {
        description:
          error?.data?.message ||
          'An error occurred while removing the device.',
      });
    }
  };

  return (
    <>
      <Card
        key={device.id}
        className="transition-shadow duration-200 hover:shadow-lg"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <Link href={`/devices/${device._id}`}>
                <CardTitle className="truncate text-lg font-semibold">
                  {device.name}
                </CardTitle>
              </Link>
              <p className="text-muted-foreground text-sm">{device.id}</p>
            </div>
            <div className="ml-2 flex items-center gap-2">
              {device.status === 'online' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
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
            <span className="text-muted-foreground text-sm">Location:</span>
            <span className="text-sm font-medium">{device.location}</span>
          </div>

          {device.notice && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                Current Notice:
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {device.notice}
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">{formatUptime(device.uptime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Seen:</span>
              <span className="text-xs font-medium">
                {formatLastSeen(device.last_seen)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={`/devices/${device._id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
            <Button
              type="button"
              variant="destructive"
              className="w-full hover:opacity-80"
              onClick={() => setOpenDeleteModal(true)}
            >
              Remove device
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteConfirmationModal
        label="Remove Device from Group"
        description={`Are you sure you want to remove ${device.name} from this group? This action cannot be undone.`}
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        onConfirm={removeDevice}
      />
    </>
  );
};

export default SingleGroupDevice;
