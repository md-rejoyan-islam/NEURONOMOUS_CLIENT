import { IAttendanceDevice } from '@/lib/types';
import { Mail, School, Table, User, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const GroupAttendanceDeviceView = ({
  filteredDevices,
}: {
  filteredDevices: IAttendanceDevice[];
}) => {
  return (
    <Card>
      <CardContent>
        <div className="grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
          {filteredDevices?.map((device) => (
            <Card
              key={device.id}
              className="transition-all duration-300 hover:scale-[1.02] hover:transform hover:shadow-xl"
            >
              <CardContent>
                <Link href={`/devices/attendance/${device?._id}`}>
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
                          device?.allowed_users[0]?.email) ||
                          'No Instructor Email'}
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
                          <div className="text-xs text-gray-500">
                            Last Update
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredDevices?.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Table className="mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No devices found</h3>
            <p className="text-muted-foreground"></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupAttendanceDeviceView;
