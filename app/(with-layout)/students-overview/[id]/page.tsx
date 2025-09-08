import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DoorClosedLocked } from 'lucide-react';

const Page = () => {
  const student = {
    id: '2023001',
    name: 'Alice Johnson',
    registration: '2023001',
    session: '2023-2024',
    courses: [
      {
        courseId: 'CSE201',
        courseName: 'Data Structures',
        session: '2020-2022',
        totalClasses: 30,
        attendedClasses: 28,
      },
      {
        courseId: 'CSE202',
        courseName: 'Algorithms',
        totalClasses: 28,
        session: '2023-2024',
        attendedClasses: 25,
      },
      {
        courseId: 'CSE301',
        courseName: 'Operating Systems',
        totalClasses: 25,
        session: '2022-2023',
        attendedClasses: 20,
      },
      {
        courseId: 'CSE401',
        courseName: 'Database Systems',
        totalClasses: 20,
        session: '2023-2024',
        attendedClasses: 18,
      },
    ],
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Student Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is the detailed overview of the selected student
          </p>
        </div>
      </div>
      <Card className="mt-6">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Student Name
              </h3>
              <p className="mt-1 text-sm font-semibold">{student.name}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Registration Number
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {student.registration}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Session
              </h3>
              <p className="mt-1 text-sm font-semibold">{student.session}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Total Courses
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {student.courses.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4 py-3">
        <CardContent className="flex flex-col items-center gap-x-4 gap-y-2 sm:flex-row">
          <Label className="text-nowrap">Search by course name or ID</Label>
          <Input
            type="text"
            placeholder="Search courses..."
            className="mt-2 h-9 max-w-sm"
          />
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50 uppercase dark:bg-white/5">
              <TableHead>#</TableHead>
              <TableHead>Course Id</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Percentage</TableHead>
            </TableHeader>
            <TableBody>
              {student?.courses.map((course, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <TableCell className="py-2 text-sm">{index + 1}</TableCell>
                  <TableCell className="py-2 text-sm font-medium">
                    {course.courseId}
                  </TableCell>
                  <TableCell className="py-2 text-sm font-medium">
                    {course.courseName}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {course.session}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {course.attendedClasses} / {course.totalClasses}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {(
                      (course.attendedClasses / course.totalClasses) *
                      100
                    ).toFixed(2)}
                    %
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
