"use client";
import NormalTable from "@/components/table/normal-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetStudentCoursesQuery } from "@/queries/student";
import { DoorClosedLocked } from "lucide-react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const { id } = params;

  const { data } = useGetStudentCoursesQuery(id as string, {
    skip: !id,
  });

  console.log(data);

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
              <p className="mt-1 text-sm font-semibold">{data?.data?.name}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Registration Number
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {data?.data?.registration_number}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Session
              </h3>
              <p className="mt-1 text-sm font-semibold">{data?.data.session}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Total Courses
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {data?.data?.courses.length || 0}
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
          <NormalTable
            headers={[
              "#",
              "Course Id",
              "Course Name",
              "Session",
              "Attendance",
              "Percentage",
            ]}
            isLoading={false}
            data={
              data?.data?.courses.map((course, index) => [
                index + 1,
                course.code,
                course.name,
                course.session,
                `${course.attend} / ${course.total_class}`,
                `${course.percentage}%`,
              ]) || []
            }
            noDataMessage="No courses found."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
