import { IAttendanceDevice } from '@/lib/types';
import {
  BoxesIcon,
  Mail,
  School,
  User,
  Wifi,
  WifiOff,
  WifiPen,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const GroupAttendanceDeviceView = ({
  filteredDevices,
  searchTerm = '',
  isLoading,
}: {
  filteredDevices: IAttendanceDevice[];
  searchTerm?: string;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton className="mb-4 h-40 w-full" />
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
            {filteredDevices?.map((device) => (
              <Card
                key={device.id}
                className="transition-all duration-300 hover:scale-[1.02] hover:transform hover:shadow-xl"
              >
                <CardContent>
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 p-2">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {(device.allowed_users?.length &&
                              device.allowed_users[0]?.first_name) ||
                              'Instructor not assigned'}
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
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="text-primary mr-2 h-4 w-4" />
                        {(device.allowed_users?.length &&
                          device.allowed_users[0]?.email) ||
                          'No Instructor Email'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <School className="text-primary mr-2 h-4 w-4" />
                        {device.group?.name || 'No Group Assigned'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <WifiPen className="text-primary mr-2 h-4 w-4" />
                        {new Date(device.last_seen).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-6 flex w-full items-center justify-between gap-4">
                      <div className="w-full">
                        <Link
                          href={`/devices/attendance/${device._id}`}
                          className="block"
                        >
                          <Button className="w-full">View Details</Button>
                        </Link>
                      </div>
                      <div className="w-full">
                        <Button className="w-full" variant="destructive">
                          Remove Access
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredDevices?.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-muted-foreground mb-4">
                <BoxesIcon className="mx-auto h-16 w-16" />
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
      )}
    </>
  );
};

export default GroupAttendanceDeviceView;
