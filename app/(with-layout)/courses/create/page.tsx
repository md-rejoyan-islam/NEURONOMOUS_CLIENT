'use client';
import InputField from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateCourseForDepartmentInput,
  createCourseForDepartmentSchema,
} from '@/lib/validations';
import {
  useCreateCourseForDepartmentMutation,
  useGetAllGroupsForCourseCreationQuery,
} from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Page = () => {
  const { data: groups } = useGetAllGroupsForCourseCreationQuery();

  const [createCourse] = useCreateCourseForDepartmentMutation();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    resetField,
    formState: { errors },
    reset,
  } = useForm<CreateCourseForDepartmentInput>({
    resolver: zodResolver(createCourseForDepartmentSchema),
    defaultValues: {
      name: '',
      code: '',
      department: '',
    },
  });

  const onSubmit = async (data: CreateCourseForDepartmentInput) => {
    // Handle form submission logic here

    try {
      await createCourse({
        code: data.code,
        name: data.name,
        groupId: data.department,
      }).unwrap();

      toast.success('Course Created', {
        description: `Course ${data.name} has been created successfully.`,
      });
      reset();
      resetField('department');
      setValue('department', '');

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to assign teacher', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      {/* <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Plus className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
              Create Group with Admin
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new group and assign an admin to manage it.
            </p>
          </div>
        </div> */}
      <div className="mx-auto sm:max-w-[600px]">
        <Card>
          <CardContent>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                  <Plus className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                  Create Course
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create a new course and assign it to a department.
                </p>
              </div>
            </div>
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

              <div className="space-y-2">
                <Label htmlFor="user">
                  Select Department <span className="text-red-500">*</span>
                  <span className="text-[9px]">(Department Name - EIIN)</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue('department', value, {
                      shouldValidate: true,
                    });
                    if (value) {
                      clearErrors('department');
                    }
                  }}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.map((dp) => (
                      <SelectItem key={dp._id} value={dp._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {dp.name} - {dp.eiin}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Create Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
