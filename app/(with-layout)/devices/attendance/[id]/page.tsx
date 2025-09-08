import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  DoorClosedLocked,
  Link2,
  Mail,
  Plus,
  Printer,
  School,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const teacher = {
    name: 'Prof. John Doe',
    email: 'jogn@gmail.com',
    department: 'Computer Science Department',
    lastUpdate: '2025-09-07T21:45:00Z',
    status: 'online', // or 'offline'
    deviceId: 'auth-001',
  };

  const courses = [
    {
      id: '001',
      name: 'Data Structures',
      studentsEnrolled: 45,
      classTaken: 30,
      courseCode: 'CSE201',
      courseEnrollUrl: '/abcd/enroll',
      lastUpdated: '2025-09-07T20:00:00Z',
      session: '2023-2024',
    },
    {
      id: '002',
      name: 'Algorithms',
      studentsEnrolled: 50,
      classTaken: 28,
      courseCode: 'CSE202',
      courseEnrollUrl: '/abcd/enroll',
      lastUpdated: '2025-09-06T18:30:00Z',
      session: '2023-2024',
    },
    {
      id: '003',
      name: 'Operating Systems',
      studentsEnrolled: 40,
      classTaken: 25,
      courseCode: 'CSE301',
      courseEnrollUrl: '/abcd/enroll',
      lastUpdated: '2025-09-05T17:15:00Z',
      session: '2023-2024',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/devices">Devices</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Attendance Devices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Teacher Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor course details and attendance records
          </p>
        </div>
      </div>

      <Card className="my-4">
        <CardContent>
          <div className="flex items-center justify-between">
            <h1 className="flex items-center text-2xl font-bold">
              <User className="mr-2 inline-block h-6 w-6" />

              {teacher.name}
            </h1>
            <div className="ml-2 flex items-center gap-2">
              {teacher.status === 'online' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  teacher.status === 'online' ? 'default' : 'destructive'
                }
                className={
                  teacher.status === 'online'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    : ''
                }
              >
                {teacher.status}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3">
            <p className="text-muted-foreground mt-2 flex items-center">
              <School className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Department:
              </span>
              <span>Computer Science Department</span>
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Mail className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Mail:
              </span>
              John@gmail.com
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Calendar className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Last Update:
              </span>
              Sep 7, 09:45 PM
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Printer className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Last Update:
              </span>
              auth-001
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="pb-2">
        <CardHeader className="flex items-center justify-between">
          <div>
            <Input
              type="text"
              placeholder="Search classes..."
              className="max-w-md sm:w-sm"
            />
          </div>
          <Link href="/devices/attendance/new" className="ml-2">
            <Button>
              <Plus className="h-4 w-4" />
              Add New Course
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead className="text-center">Enrolled</TableHead>
                <TableHead className="text-center">Classes Taken</TableHead>
                <TableHead className="text-center">Session</TableHead>
                <TableHead className="text-center">Last Updated</TableHead>
                <TableHead className="text-center">Enroll Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/devices/attendance/${teacher.deviceId}/courses/${course.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell className="text-center">
                    {course.studentsEnrolled}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.classTaken}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.session}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(course.lastUpdated).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={course.courseEnrollUrl} target="_blank">
                      <Link2 className="inline-block h-4 w-4 text-blue-500 hover:text-blue-600" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
