import { Card } from '@/components/ui/card';
import { DoorClosedLocked } from 'lucide-react';

import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Page = () => {
  const data = {
    courseId: 'CSE101',
    courseName: 'Introduction to Computer Science',
    totalClasses: 30,
    data: '2025-09-07T21:45:00Z',
    session: '2023-2024',
    classDates: [
      '2025-09-02',
      '2025-09-04',
      '2025-09-06',
      '2025-09-08',
      '2025-09-10',
    ],
    enrollStudents: 15,
    attendanceRecords: [
      {
        registation: '2023001',
        studentName: 'Alice Johnson',
        status: 'present',
      },
      {
        registation: '2023002',
        studentName: 'Bob Smith',
        status: 'absent',
      },
      {
        registation: '2023003',
        studentName: 'Charlie Brown',
        status: 'present',
      },
      {
        registation: '2023004',
        studentName: 'Diana Prince',
        status: 'present',
      },
      {
        registation: '2023005',
        studentName: 'Ethan Hunt',
        status: 'absent',
      },
    ],
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Attendance Summary for M-401
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is the attendance summary for this course
          </p>
        </div>
      </div>
      <Card className="mt-4">
        <div className="flex flex-wrap justify-between gap-4 px-4">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Course ID
            </h3>
            <p className="mt-1 text-sm font-semibold">{data.courseId}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Course Name
            </h3>
            <p className="mt-1 text-sm font-semibold">{data.courseName}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">Date</h3>
            <p className="mt-1 text-sm font-semibold">
              {new Date(data.data).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Students
            </h3>
            <p className="mt-1 text-sm font-semibold">{data.enrollStudents}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Attendend Students
            </h3>
            <p className="mt-1 text-sm font-semibold">
              {data.attendanceRecords.length}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              Detailed Attendance Records
            </h2>
            <div className="flex w-full justify-end sm:w-auto">
              <Input
                type="text"
                placeholder="Search by name or registration"
                className="w-full sm:min-w-[260px]"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead> Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.attendanceRecords.map((record, index) => {
                return (
                  <TableRow key={record.registation}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.registation}</TableCell>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>
                      <Switch
                        className="scale-[1.1] cursor-pointer data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                        defaultChecked={record.status === 'present'}
                      />
                      {record.status === 'present' ? (
                        <span className="ml-2 font-medium text-green-600">
                          Present
                        </span>
                      ) : (
                        <span className="ml-2 font-medium text-red-600">
                          Absent
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
