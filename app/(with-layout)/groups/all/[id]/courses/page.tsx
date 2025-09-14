'use client';
import InputField from '@/components/form/input-field';
import NormalTable from '@/components/table/normal-table';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  CreateCourseForDepartmentInput,
  createCourseForDepartmentSchema,
} from '@/lib/validations';
import {
  useCreateCourseForDepartmentMutation,
  useEditCourseInDepartmentMutation,
  useGetDepartmentCoursesQuery,
  useRemoveCourseForDepartmentMutation,
} from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NotebookPen,
  PackagePlus,
  TabletsIcon,
  Trash2,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const GroupCourses = () => {
  const params = useParams();
  const { id: _id } = params;

  const { data: courses, isLoading } = useGetDepartmentCoursesQuery(
    String(_id),
    {
      skip: !_id,
    }
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const [createCourse] = useCreateCourseForDepartmentMutation();
  const [editCourse] = useEditCourseInDepartmentMutation();
  const [removeCourse] = useRemoveCourseForDepartmentMutation();

  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [editCourseId, setEditCourseId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateCourseForDepartmentInput>({
    resolver: zodResolver(createCourseForDepartmentSchema),
    defaultValues: {
      department: String(_id),
    },
  });

  const onSubmit = async (data: CreateCourseForDepartmentInput) => {
    try {
      if (modalType === 'edit' && editCourseId) {
        await editCourse({
          courseId: editCourseId,
          groupId: String(_id),
          name: data.name,
          code: data.code,
        }).unwrap();
        toast.success('Course Updated', {
          description: `Course ${data.name} has been updated successfully.`,
        });
        setIsOpen(false);
        reset();
        return;
      }

      await createCourse({
        code: data.code,
        name: data.name,
        groupId: data.department,
      }).unwrap();

      toast.success('Course Created', {
        description: `Course ${data.name} has been created successfully.`,
      });
      setIsOpen(false);
      reset();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to assign teacher', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    try {
      await removeCourse({ groupId: String(_id), courseId }).unwrap();
      toast.success('Course Removed', {
        description: `Course has been removed from the group successfully.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to remove course', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return courses?.courses || [];
    }
    const lowercasedValue = searchTerm.toLowerCase();

    return courses?.courses.filter(
      (course) =>
        course.name.toLowerCase().includes(lowercasedValue) ||
        course.code.toLowerCase().includes(lowercasedValue)
    );
  }, [courses?.courses, searchTerm]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/groups">Groups</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink asChild>
            <Link href={`/groups/all/${_id}`}>Group Details</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Courses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <TabletsIcon className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          Group Courses
        </h1>
        <div className="flex gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setIsOpen(true);
              setModalType('create');
              setEditCourseId(null);
              reset();
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>

      <Card className="py-3 shadow-xs">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium">
              Total Courses: {courses?.courses?.length}
            </h2>
            <div>
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <NormalTable
            headers={['# ', 'Course Name', 'Course Code', 'Action']}
            isLoading={isLoading}
            noDataMessage="No courses found."
            data={
              filteredCourses?.map((course, index) => [
                index + 1,
                course.name,
                course.code,
                <div key="actions" className="flex items-center gap-3">
                  <button
                    className="cursor-pointer rounded-md bg-blue-100/60 p-2 text-blue-500 hover:bg-blue-200 dark:bg-blue-200/10 dark:hover:bg-blue-200/20"
                    onClick={() => {
                      setModalType('edit');
                      setValue('name', course.name);
                      setValue('code', course.code);
                      setEditCourseId(course._id);
                      setIsOpen(true);
                    }}
                    title="Edit Course"
                  >
                    <NotebookPen className="h-4 w-4" />
                  </button>
                  <button
                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                    title="Delete Course"
                    onClick={() => handleRemoveCourse(course._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* <DownloadFirmware id={fw._id} /> */}
                </div>,
              ]) ?? []
            }
          />
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Add New Device
            </DialogTitle>
          </AlertDialogHeader>

          <form className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Course Name"
              placeholder="Enter course name"
              name="courseName"
              error={errors.name?.message}
              isOptional={false}
              props={{
                ...register('name'),
              }}
              type="text"
            />
            <InputField
              label="Course Code"
              placeholder="Enter course code"
              name="courseCode"
              error={errors.code?.message}
              isOptional={false}
              props={{
                ...register('code'),
              }}
              type="text"
            />

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Course
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupCourses;
