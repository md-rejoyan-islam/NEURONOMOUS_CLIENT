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
import Link from 'next/link';

const Page = () => {
  const students = [
    {
      id: '2023001',
      name: 'Alice Johnson',
      registration: '2023001',
      session: '2023-2024',
      totalClasses: 30,
      attendedClasses: 28,
    },
    {
      id: '2023002',
      name: 'Bob Smith',
      registration: '2023002',
      session: '2023-2024',
      totalClasses: 30,
      attendedClasses: 25,
    },
    {
      id: '2023003',
      name: 'Charlie Brown',
      registration: '2023003',
      session: '2022-2023',
      totalClasses: 30,
      attendedClasses: 20,
    },
    {
      id: '2023004',
      name: 'Diana Prince',
      registration: '2023004',
      session: '2023-2024',
      totalClasses: 30,
      attendedClasses: 30,
    },
    {
      id: '2023005',
      name: 'Ethan Hunt',
      registration: '2023005',
      session: '2021-2022',
      totalClasses: 30,
      attendedClasses: 22,
    },
  ];

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
          <Table>
            <TableHeader className="bg-gray-50 uppercase dark:bg-white/5">
              <TableHead>#</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Percentage</TableHead>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <TableCell className="py-2 text-sm">{index + 1}</TableCell>
                  <TableCell className="py-2 text-sm font-medium">
                    <Link
                      href={`/students-overview/${student.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {student.registration}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {student.session}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {student.attendedClasses} / {student.totalClasses}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {(
                      (student.attendedClasses / student.totalClasses) *
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
