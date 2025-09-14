'use client';
import NormalTable from '@/components/table/normal-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  useAddAttendanceRecordMutation,
  useDeleteAttendanceRecordMutation,
  useGetCourseByIdQuery,
} from '@/queries/course';
import { DoorClosedLocked, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

const Page = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const id = params?.id as string;

  const { data: coursee, isLoading } = useGetCourseByIdQuery(
    { id: courseId },
    { skip: !courseId }
  );

  const course = {
    id: '001',
    name: 'Introduction to Computer Science',
    studentsEnrolled: 120,
    classTaken: 15,
    courseCode: 'CSE101',
    courseEnrollUrl: 'https://example.com/enroll',
    lastUpdated: '2025-09-07T21:45:00Z',
    session: '2023-2024',
    attendanceRate: 92, // in percentage
  };

  const [deleteAttendanceRecord] = useDeleteAttendanceRecordMutation();
  const handleDeleteAttendanceRecord = async (date: string) => {
    try {
      await deleteAttendanceRecord({ courseId: courseId, date }).unwrap();
      toast.success('Attendance Record Deleted', {
        description: `Attendance record has been deleted successfully.`,
      });
      // refetch();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to delete record', {
        description:
          error?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  const [addAttendanceRecord] = useAddAttendanceRecordMutation();

  const handleAddRecord = async () => {
    // Get current date in DD-MM-YYYY format
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = d.getFullYear();
    const fdate = `${day}-${month}-${year}`;

    try {
      await addAttendanceRecord({ courseId: courseId, date: fdate }).unwrap();

      toast.success('Attendance Record Added', {
        description: `Attendance record for ${fdate} has been added successfully.`,
      });
      // refetch();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to add record', {
        description:
          error?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Attendance Records for {coursee?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor attendance records for this course
          </p>
        </div>
      </div>
      <Card className="mt-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Course Name
              </h3>
              <p className="mt-1 text-sm font-semibold">{coursee?.name}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Course Code
              </h3>
              <p className="mt-1 text-sm font-semibold">{coursee?.code}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Department
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {coursee?.department}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Students Enrolled
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {coursee?.studentsEnrolled}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Classes Taken
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {coursee?.completedClasses || 0}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Session
              </h3>
              <p className="mt-1 text-sm font-semibold">{coursee?.session}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Attendance Rate
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {coursee?.attendanceRate}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Last Updated
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {coursee?.updatedAt
                  ? new Date(coursee?.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Enroll Link
              </h3>
              <Link
                href={coursee?.enroll_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-blue-600 hover:underline"
              >
                {coursee?.enroll_link ? 'Link' : 'N/A'}
              </Link>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Enrolled List
              </h3>
              <Link
                href={`/devices/attendance/${id}/courses/${coursee?._id}/students`}
                className="mt-1 font-semibold text-blue-600 hover:underline"
              >
                View Students
              </Link>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Overview
              </h3>
              <Link
                href={`/devices/attendance/001/courses/${course.id}/overview`}
                className="mt-1 font-semibold text-blue-600 hover:underline"
              >
                View Overview
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex items-center justify-between gap-6">
          <h2 className="text-lg font-medium">Attendance Records</h2>
          <div>
            <Button onClick={handleAddRecord}>Add Record</Button>
          </div>
        </CardHeader>

        <CardContent>
          <NormalTable
            headers={['#', 'Date', 'Present', 'Absent', 'Rate(%)', 'Action']}
            isLoading={isLoading}
            noDataMessage="No attendance records found."
            data={
              coursee?.records.map((entry, index) => [
                index + 1,
                <Link
                  key={'link-' + entry.date}
                  href={`/devices/attendance/${id}/courses/${coursee._id}/${entry.date}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {entry.date}
                  {/* {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} */}
                </Link>,
                entry.present_students,
                <span key={'absent-' + entry.date}>
                  {coursee.studentsEnrolled - entry.present_students}
                </span>,
                (
                  ((entry.present_students || 0) / coursee.studentsEnrolled) *
                  100
                ).toFixed(2),
                <div
                  className="flex items-center gap-2"
                  key={entry.date + '-actions'}
                >
                  <button
                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                    onClick={() => handleDeleteAttendanceRecord(entry.date)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>,
              ]) || []
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
