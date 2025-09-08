import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DoorClosedLocked, Eye, Trash } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
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

  const dates = [
    { date: '2025-09-02T09:00:00Z', present: 110 },
    { date: '2025-09-04T09:00:00Z', present: 115 },
    { date: '2025-09-06T09:00:00Z', present: 112 },
    { date: '2025-09-08T09:00:00Z', present: 118 },
    { date: '2025-09-10T09:00:00Z', present: 120 },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Attendance Records for M-401
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
              <p className="mt-1 text-sm font-semibold">{course.name}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Course Code
              </h3>
              <p className="mt-1 text-sm font-semibold">{course.courseCode}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Students Enrolled
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {course.studentsEnrolled}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Classes Taken
              </h3>
              <p className="mt-1 text-sm font-semibold">{course.classTaken}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Session
              </h3>
              <p className="mt-1 text-sm font-semibold">{course.session}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Attendance Rate
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {course.attendanceRate}%
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Last Updated
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {new Date(course.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Enroll Link
              </h3>
              <a
                href={course.courseEnrollUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-blue-600 hover:underline"
              >
                {course.courseEnrollUrl}
              </a>
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

      <Card className="mt-4 pt-2">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Students Present</TableHead>
                <TableHead>Students Absent</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dates.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link
                      href={`/devices/attendance/001/courses/${course.id}/${entry.date}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Link>
                  </TableCell>
                  <TableCell>{entry.present}</TableCell>
                  <TableCell>
                    {course.studentsEnrolled - entry.present}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://example.com/attendance/${course.id}/${entry.date}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      <Eye className="inline-block h-4 w-4" />
                    </a>
                    <button className='transition" ml-2 cursor-pointer rounded-sm bg-red-100 p-1.5 hover:bg-red-200 dark:bg-red-700/20 dark:hover:bg-red-800/20'>
                      <Trash className="inline-block h-4 w-4 text-red-600 hover:text-red-800" />
                    </button>
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
