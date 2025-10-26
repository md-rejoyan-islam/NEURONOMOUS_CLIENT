import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, DoorClosedLocked, Download, X } from "lucide-react";

const Page = () => {
  const data = {
    courseId: "CSE101",
    courseName: "Introduction to Computer Science",
    totalClasses: 30,
    classDates: [
      "2025-09-02",
      "2025-09-04",
      "2025-09-06",
      "2025-09-08",
      "2025-09-10",
    ],
    attendanceRecords: [
      {
        registation: "2023001",
        studentName: "Alice Johnson",
        attendDates: ["2025-09-02", "2025-09-04", "2025-09-06"],
      },
      {
        registation: "2023002",
        studentName: "Bob Smith",
        attendDates: ["2025-09-02", "2025-09-04", "2025-09-06", "2025-09-08"],
      },
      {
        registation: "2023003",
        studentName: "Charlie Brown",
        attendDates: ["2025-09-02", "2025-09-04"],
      },
      {
        registation: "2023004",
        studentName: "Diana Prince",
        attendDates: [
          "2025-09-02",
          "2025-09-04",
          "2025-09-06",
          "2025-09-08",
          "2025-09-10",
        ],
      },
      {
        registation: "2023005",
        studentName: "Ethan Hunt",
        attendDates: ["2025-09-02", "2025-09-04", "2025-09-06"],
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
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Classes
            </h3>
            <p className="mt-1 text-sm font-semibold">{data.totalClasses}</p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Class Dates
            </h3>
            <p className="mt-1 text-sm font-semibold">
              {data.classDates.length}
            </p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Total Students
            </h3>
            <p className="mt-1 text-sm font-semibold">
              {data.attendanceRecords.length}
            </p>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Summary Download
            </h3>
            <button className="bg-primary/10 text-primary mx-auto mt-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-2">
              <span className="">
                <Download className="h-4 w-4 animate-bounce" />
              </span>
            </button>
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
                <TableHead>Name</TableHead>
                <TableHead>Classes Attended</TableHead>
                <TableHead>Percentage(%)</TableHead>
                {data.classDates.map((date) => (
                  <TableHead key={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.attendanceRecords.map((record, index) => {
                const attendCount = data.classDates.filter((date) =>
                  record.attendDates.includes(date),
                ).length;
                const attendancePercentage = Math.round(
                  (attendCount / data.classDates.length) * 100,
                );
                return (
                  <TableRow key={record.registation}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.registation}</TableCell>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell>
                      {attendCount}/{data.classDates.length}
                    </TableCell>
                    <TableCell>{attendancePercentage}%</TableCell>
                    {data.classDates.map((date) => (
                      <TableCell key={date}>
                        {record.attendDates.includes(date) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                    ))}
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
