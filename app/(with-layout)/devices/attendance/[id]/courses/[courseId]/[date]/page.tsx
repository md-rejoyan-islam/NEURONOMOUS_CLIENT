'use client';
import { Card } from '@/components/ui/card';
import { DoorClosedLocked } from 'lucide-react';

import NormalTable from '@/components/table/normal-table';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  useGetAttendanceRecordByDateQuery,
  useManuallyAttendanceRecordToggleMutation,
} from '@/queries/course';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const date = params?.date as string;

  const { data: record, isLoading } = useGetAttendanceRecordByDateQuery(
    { courseId: courseId, date },
    { skip: !courseId || !date }
  );

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecord = useMemo(() => {
    if (!searchTerm) return record;
    const lowercasedTerm = searchTerm.toLowerCase();
    return {
      ...record,
      enrolled_students: record?.enrolled_students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowercasedTerm) ||
          student.registration_number.toLowerCase().includes(lowercasedTerm) ||
          student.session.toLowerCase().includes(lowercasedTerm)
      ),
    };
  }, [record, searchTerm]);

  const [recordToggle, { isLoading: isToggleLoading }] =
    useManuallyAttendanceRecordToggleMutation();

  const handleAttendanceToggle = async (studentId: string) => {
    try {
      await recordToggle({ courseId: courseId, date, studentId }).unwrap();
      toast.success('Attendance Record Updated', {
        description: `Attendance record has been updated successfully.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to update record', {
        description:
          error?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Attendance Summary for {record?.code}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is the attendance summary for this course
          </p>
        </div>
      </div>
      <Card className="mt-4">
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Course ID
              </h3>
              <p className="mt-1 text-sm font-semibold">{record?.code}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Course Name
              </h3>
              <p className="mt-1 text-sm font-semibold">{record?.name}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Date
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {record?.date}
                {/* {new Date(data.data).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })} */}
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Total Students
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {record?.enrolled_students?.length || 0}
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Attendend Students
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {record?.present_students?.length || 0}
              </p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">
                Attendance Rate
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {record?.enrolled_students &&
                record?.enrolled_students.length > 0
                  ? (
                      (record?.present_students?.length /
                        record?.enrolled_students.length) *
                      100
                    ).toFixed(2) + '%'
                  : '0%'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 py-4 shadow-xs">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              Detailed Attendance Records
            </h2>
            <div className="flex w-full justify-end sm:w-auto">
              <Input
                type="text"
                placeholder="Search by name or registration"
                className="w-full sm:min-w-[260px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <NormalTable
            headers={[
              '#',
              'Registration',
              'Student Name',
              'Sesstion',
              'PresentBy',
              'Status',
            ]}
            isLoading={isLoading}
            noDataMessage="No attendance records found."
            data={
              filteredRecord?.enrolled_students?.map((rcd, index) => [
                index + 1,
                rcd.registration_number,
                rcd.name,
                rcd.session,
                <Badge variant={'outline'} key={'badge-' + rcd._id}>
                  {record?.present_students?.find(
                    (student) =>
                      student.student.registration_number ===
                      rcd.registration_number
                  )?.presentBy || ''}
                </Badge>,
                <div className="flex items-center" key={'div-' + rcd._id}>
                  <Switch
                    className="scale-[1.1] cursor-pointer data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                    defaultChecked={record?.present_students.some(
                      (student) =>
                        student.student.registration_number ===
                        rcd.registration_number
                    )}
                    onCheckedChange={() => handleAttendanceToggle(rcd._id)}
                    disabled={isToggleLoading}
                    //
                  />
                  {record?.present_students.some(
                    (student) =>
                      student.student.registration_number ===
                      rcd.registration_number
                  ) ? (
                    <span className="ml-2 font-medium text-green-600">
                      Present
                    </span>
                  ) : (
                    <span className="ml-2 font-medium text-red-600">
                      Absent
                    </span>
                  )}
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
