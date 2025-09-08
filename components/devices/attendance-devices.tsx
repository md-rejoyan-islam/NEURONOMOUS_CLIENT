import { Mail, School, User, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const data = [
  {
    id: 'auth-001',
    authorName: 'Dr. Rahman',
    authorEmail: 'rahman@sust.edu',
    lastUpdate: '2025-09-08T10:30:00Z',
    totalClass: 42,
    department: 'Electrical and Electronic Engineering',
    status: 'online',
  },
  {
    id: 'auth-002',
    authorName: 'Prof. Ayesha Karim',
    authorEmail: 'ayesha.karim@sust.edu',
    lastUpdate: '2025-09-07T15:45:00Z',
    totalClass: 36,
    department: 'Computer Science and Engineering',
    status: 'offline',
  },
  {
    id: 'auth-003',
    authorName: 'Md. Saiful Islam',
    authorEmail: 'saiful.islam@sust.edu',
    lastUpdate: '2025-09-08T12:10:00Z',
    totalClass: 28,
    department: 'Civil Engineering',
    status: 'online',
  },
  {
    id: 'auth-004',
    authorName: 'Dr. Nazmul Hasan',
    authorEmail: 'nazmul.hasan@sust.edu',
    lastUpdate: '2025-09-06T09:20:00Z',
    totalClass: 50,
    department: 'Mechanical Engineering',
    status: 'offline',
  },
  {
    id: 'auth-005',
    authorName: 'Farhana Akter',
    authorEmail: 'farhana.akter@sust.edu',
    lastUpdate: '2025-09-08T11:55:00Z',
    totalClass: 31,
    department: 'Business Administration',
    status: 'online',
  },
  {
    id: 'auth-006',
    authorName: 'Dr. Imran Hossain',
    authorEmail: 'imran.hossain@sust.edu',
    lastUpdate: '2025-09-07T18:05:00Z',
    totalClass: 40,
    department: 'Mathematics',
    status: 'offline',
  },
];

const AttendanceDevices = () => {
  return (
    <>
      {data.map((device) => (
        <Card
          key={device.id}
          className="transition-all duration-300 hover:scale-[1.02] hover:transform hover:shadow-xl"
        >
          <CardContent>
            <Link href={`/devices/attendance/${device.id}`}>
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 p-2">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{device.authorName}</h3>
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
                    {device.authorEmail}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <School className="text-primary mr-2 h-4 w-4" />
                    {device.department}
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        36
                      </div>
                      <div className="text-xs text-gray-500">Total Classes</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Last Update
                      </div>
                      <div className="text-xs text-gray-500">
                        Sep 7, 09:45 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default AttendanceDevices;
