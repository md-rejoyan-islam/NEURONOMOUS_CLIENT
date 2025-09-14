'use client';

import AddCourseModel from '@/components/devices/attendance-device/add-new-course-modal';
import TeacherAssignModel from '@/components/devices/attendance-device/teacher-assign-model';
import NormalTable from '@/components/table/normal-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetAttendanceDeviceByIdQuery } from '@/queries/attendance-device';
import {
  Calendar,
  Cpu,
  DoorClosedLocked,
  IdCardLanyard,
  Link2,
  Mail,
  NotebookTabs,
  School,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();

  const {
    data: attendanceDevice,
    isLoading,
    refetch,
  } = useGetAttendanceDeviceByIdQuery(
    {
      id: id as string,
    },
    {
      skip: !id,
    }
  );

  const assignedUser =
    attendanceDevice?.allowed_users?.find((u) => u.role !== 'admin') || null;

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

              {assignedUser
                ? assignedUser.first_name + ' ' + assignedUser.last_name
                : 'No teacher assigned'}
            </h1>
            <div className="ml-2 flex items-center gap-2">
              {attendanceDevice?.status === 'online' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge
                variant={
                  attendanceDevice?.status === 'online'
                    ? 'default'
                    : 'destructive'
                }
                className={
                  attendanceDevice?.status === 'online'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    : ''
                }
              >
                {attendanceDevice?.status || 'N/A'}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3">
            <p className="text-muted-foreground mt-2 flex items-center">
              <School className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Group:
              </span>
              <span>
                {attendanceDevice?.group?.name ||
                  'Devices not assigned to any group'}
              </span>
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Mail className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Mail:
              </span>
              {attendanceDevice?.group
                ? attendanceDevice?.allowed_users?.find(
                    (u) => u.role === 'admin'
                  )?.email
                : 'N/A'}
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <NotebookTabs className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Mac Address:
              </span>
              {attendanceDevice?.mac_id || 'N/A'}
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <IdCardLanyard className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Id:
              </span>
              {attendanceDevice?.id || 'N/A'}
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Cpu className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Firmware:
              </span>
              {attendanceDevice?.firmware_version || 'N/A'}
            </p>
            <p className="text-muted-foreground mt-2 flex items-center">
              <Calendar className="mr-2 inline-block h-4 w-4" />
              <span className="mr-1 font-medium text-slate-700 dark:text-white/90">
                Last Update:
              </span>
              {attendanceDevice?.last_seen
                ? new Date(attendanceDevice.last_seen).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
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

          {attendanceDevice?.group &&
            (assignedUser ? (
              <AddCourseModel
                isLoading={isLoading}
                groupId={attendanceDevice?.group?._id as string}
                instructorId={assignedUser?._id as string}
                refetch={refetch}
              />
            ) : (
              <TeacherAssignModel
                isLoading={isLoading}
                refetch={refetch}
                groupId={attendanceDevice?.group?._id as string}
                deviceId={attendanceDevice?._id as string}
              />
            ))}
        </CardHeader>

        <CardContent>
          <NormalTable
            currentPage={1}
            itemsPerPage={10}
            totalItems={attendanceDevice?.courses?.length || 0}
            limitOptions={[10, 20, 50]}
            headers={[
              '#',
              'Course Name',
              'Course Code',
              'Enrolled',
              'Completed Classes',
              'Session',
              'Last Updated',
              'Enroll Link',
            ]}
            isLoading={isLoading}
            noDataMessage="No courses available."
            data={
              attendanceDevice?.courses?.map((course, index) => [
                index + 1,
                <Link
                  href={`/devices/attendance/${id}/courses/${course._id}`}
                  key={course._id}
                >
                  <span className="font-medium text-blue-600 hover:underline">
                    {course.name}
                  </span>
                </Link>,
                course.code,
                <>{course.studentsEnrolled}</>,
                <>{course.completedClasses}</>,
                <>{course.session}</>,
                <>
                  {new Date(course.updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </>,
                <>
                  <Link href={course.enroll_link} target="_blank">
                    <Link2 className="inline-block h-4 w-4 text-blue-500 hover:text-blue-600" />
                  </Link>
                </>,
              ]) || []
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
