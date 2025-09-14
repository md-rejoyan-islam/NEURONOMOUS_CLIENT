'use client';
import NormalTable from '@/components/table/normal-table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllStudentsSummaryQuery } from '@/queries/student';
import { DoorClosedLocked } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  const { data } = useGetAllStudentsSummaryQuery(`page=${page}&limit=${limit}`);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Overall Student Summary
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is the overall summary of all students and their attendance
          </p>
        </div>
      </div>
      <Card className="mt-4 shadow-xs">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Search by name..."
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterReg">Registration #</Label>
              <Input
                type="text"
                id="filterReg"
                placeholder="Filter by registration..."
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterSession">Session</Label>
              <Input
                type="text"
                id="filterSession"
                className="h-9"
                placeholder="Filter by session..."
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
              'Name',
              'Registration',
              'Session',
              'Attendance',
              'Percentage',
              'Courses',
              'Retaken',
              'Department',
            ]}
            isLoading={false}
            totalItems={data?.pagination.items || 0}
            itemsPerPage={data?.pagination.limit || 20}
            currentPage={data?.pagination.page || 1}
            data={
              data?.data?.map((student, index) => [
                index +
                  1 +
                  ((data?.pagination.page || 1) - 1) *
                    (data?.pagination.limit || 20),
                <Link
                  key={student._id}
                  href={`/students-overview/${student._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {student.name}
                </Link>,
                student.registration_number,
                student.session,
                `${student.total_classes_attended} / ${student.total_classes_held}`,
                `${student.performance_percentage}%`,
                student.total_courses,
                student.retaken_courses,
                student.department.name,
              ]) || []
            }
            noDataMessage={'No students found.'}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
