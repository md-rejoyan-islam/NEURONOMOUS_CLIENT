'use client';
import NormalTable from '@/components/table/normal-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllCoursesQuery } from '@/queries/course';

import { DoorClosedLocked } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  // const courses = [
  //   {
  //     id: '001',
  //     name: 'Data Structures',
  //     studentsEnrolled: 45,
  //     classTaken: 30,
  //     courseCode: 'CSE201',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-07T20:00:00Z',
  //     author: 'Prof. John Doe',
  //     authorEmail: 'abc@gmail.com',
  //     session: '2020-2022',
  //   },
  //   {
  //     id: '002',
  //     name: 'Algorithms',
  //     studentsEnrolled: 50,
  //     classTaken: 28,
  //     courseCode: 'CSE202',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-06T18:30:00Z',
  //     author: 'Prof. Jane Smith',
  //     authorEmail: 'jane@gmail.com',
  //     session: '2023-2024',
  //   },
  //   {
  //     id: '003',
  //     name: 'Operating Systems',
  //     studentsEnrolled: 40,
  //     classTaken: 25,
  //     courseCode: 'CSE301',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-05T17:15:00Z',
  //     author: 'Prof. Emily Davis',
  //     authorEmail: 'emity@gmail.com',
  //     session: '2021-2022',
  //   },
  //   {
  //     id: '004',
  //     name: 'Database Systems',
  //     studentsEnrolled: 60,
  //     classTaken: 20,
  //     courseCode: 'CSE401',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-04T16:00:00Z',
  //     author: 'Prof. Michael Brown',
  //     authorEmail: 'michel@gmail.com',
  //     session: '2023-2024',
  //   },
  //   {
  //     id: '005',
  //     name: 'Computer Networks',
  //     studentsEnrolled: 55,
  //     classTaken: 22,
  //     courseCode: 'CSE501',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-03T15:30:00Z',
  //     author: 'Prof. Sarah Wilson',
  //     authorEmail: 'sarah@gmail.com',
  //     session: '2022-2024',
  //   },
  //   {
  //     id: '006',
  //     name: 'Software Engineering',
  //     studentsEnrolled: 70,
  //     classTaken: 18,
  //     courseCode: 'CSE601',
  //     courseEnrollUrl: '/abcd/enroll',
  //     lastUpdated: '2025-09-02T14:45:00Z',
  //     author: 'Prof. David Lee',
  //     authorEmail: 'david@gmail.com',
  //     session: '2023-2024',
  //   },
  // ];

  const { data } = useGetAllCoursesQuery('');
  console.log(data, ' all courses');

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            All Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all courses and attendance records
          </p>
        </div>
      </div>

      <Card className="mt-4 py-3 shadow-xs">
        <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-medium">
              Total Courses: {data?.pagination.items || 0}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder="Search By" className="h-10" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Session</SelectItem>
                  <SelectItem value="banana">Course Code</SelectItem>
                  <SelectItem value="blueberry">Instructor Name</SelectItem>
                  <SelectItem value="grapes">Instructor Email</SelectItem>
                  <SelectItem value="pineapple">Course Name</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Search courses..."
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent>
          <NormalTable
            headers={[
              '#',
              'Course Name',
              'Course Code',
              'Session',
              'Performance',
              'Classes Taken',
              'Instructor',
              'Last Updated',
            ]}
            isLoading={false}
            data={
              data?.courses?.map((course, index) => [
                index + 1,
                <Link
                  key={course._id}
                  href={'/devices/attendance/001/courses/' + course._id}
                  className="text-blue-600 hover:underline"
                >
                  {course.name}
                </Link>,
                course.session,
                course.code,
                course.attendanceRate,
                course.completedClasses,
                <p key={course.instructor}>
                  {course.instructor} ({course.instructor_email})
                </p>,
                new Date(course.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
              ]) || []
            }
            noDataMessage="No courses found."
            currentPage={data?.pagination.page || 1}
            itemsPerPage={data?.pagination.limit || 10}
            totalItems={data?.pagination.items || 0}
            limitOptions={[10, 20, 30, 50]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
