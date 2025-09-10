import InputField from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseInput, createCourseSchema } from '@/lib/validations';
import { useCreateCourseMutation } from '@/queries/course';
import {
  useGetAllGroupsForCourseCreationQuery,
  useGetAllUsersInGroupQuery,
} from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AddCourseModel = ({
  isLoading,
  groupId,
  refetch,
  instructorId,
}: {
  isLoading: boolean;
  groupId: string;
  refetch: () => void;

  instructorId: string;
}) => {
  const [open, setOpen] = useState(false);

  const { data: groupUsers } = useGetAllUsersInGroupQuery(groupId, {
    skip: !groupId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      instructor: instructorId,
    },
  });

  const { data: groups } = useGetAllGroupsForCourseCreationQuery();

  const [createCourse] = useCreateCourseMutation();

  const onSubmit = async (data: CourseInput) => {
    // Handle form submission logic here

    try {
      await createCourse({
        ...data,
        instructor: instructorId,
      }).unwrap();
      refetch();

      setOpen(false);
      toast.success('Teacher created & Assigned', {
        description: `Teacher has been assigned successfully.`,
      });
      setOpen(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to assign teacher', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <div>
      <Button disabled={isLoading} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add New Course
      </Button>
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Add New Course
            </DialogTitle>
            <DialogDescription>
              Create a new course and assign it to this device
            </DialogDescription>
          </DialogHeader>
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

            <InputField
              label="Session"
              placeholder="e.g., 2023-2024"
              name="session"
              error={errors.session?.message}
              isOptional={false}
              props={{
                ...register('session'),
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
                  setValue('department', value);
                }}
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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCourseModel;
