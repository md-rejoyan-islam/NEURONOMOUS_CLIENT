"use client";
import NormalTable from "@/components/table/normal-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetEnrolledStudentsByCourseIdQuery } from "@/queries/course";
import { DoorClosedLocked } from "lucide-react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const courseId = params?.courseId as string;

  const { data, isLoading } = useGetEnrolledStudentsByCourseIdQuery(
    {
      courseId,
    },
    {
      skip: !courseId,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <DoorClosedLocked className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            All Enrollment Students
          </h1>
          <p className="text-muted-foreground mt-1">
            Show all students enrolled in this course
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
              <p className="mt-1 text-sm font-semibold">{data?.name}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Course Code
              </h3>
              <p className="mt-1 text-sm font-semibold">{data?.code}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Department
              </h3>
              <p className="mt-1 text-sm font-semibold">{data?.department}</p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Students Enrolled
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {data?.students?.length || 0}
              </p>
            </div>
            <div className="">
              <h3 className="text-muted-foreground text-sm font-medium">
                Session
              </h3>
              <p className="mt-1 text-sm font-semibold">{data?.session}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="my-6 py-4 shadow-xs">
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold">Search Students</h2>
            <div>
              <Input
                type="text"
                placeholder="Search by student name or ID"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <NormalTable
            headers={["#", "Student Name", "Student ID", "Session", "Actions"]}
            currentPage={1}
            itemsPerPage={10}
            isLoading={false}
            totalItems={0}
            limitOptions={[10, 20, 50]}
            noDataMessage="No students enrolled yet."
            data={
              data?.students?.map((student, index) => [
                index + 1,
                student.name,
                student.registration_number,
                student.session,
                "delete",
              ]) || []
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
