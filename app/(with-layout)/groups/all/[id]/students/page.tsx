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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  EditStudentInDepartmentInput,
  editStudentInDepartmentSchema,
  StudentsUploadInput,
  studentsUploadSchema,
} from '@/lib/validations';
import {
  useAddStudentsInDepartmentMutation,
  useEditStudentInDepartmentMutation,
  useGetDepartmentStudentsQuery,
  useRemoveStudentForDepartmentMutation,
} from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NotebookPen,
  PackagePlus,
  TabletsIcon,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';

const GroupStudents = () => {
  const params = useParams();
  const { id: _id } = params;

  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';
  const search = searchParams.get('search') || '';

  const { data: students, isLoading } = useGetDepartmentStudentsQuery(
    {
      id: String(_id),
      query: `page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
    },
    {
      skip: !_id,
    }
  );

  console.log(students, ' students data');

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const router = useRouter();
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const query = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      query.set('search', value);
    } else {
      query.delete('search');
    }
    query.delete('page');
    const timer = setTimeout(() => {
      router.push(`${window.location.pathname}?${query.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const [editStudent] = useEditStudentInDepartmentMutation();
  const [removeStudent] = useRemoveStudentForDepartmentMutation();
  const [editStudentId, setEditStudentId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditStudentInDepartmentInput>({
    resolver: zodResolver(editStudentInDepartmentSchema),
  });

  const [dragActive, setDragActive] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const {
    handleSubmit: handleFileSubmit,
    watch,
    setValue: setFile,
    clearErrors,
    reset: resetFile,
    formState: { errors: fileErros },
  } = useForm<StudentsUploadInput>({
    resolver: zodResolver(studentsUploadSchema),
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);

      const binFile = files.find((file) => file.name.endsWith('.json'));

      if (binFile) {
        setFile('file', binFile);
        clearErrors('file');
        toast.success('File selected: ', {
          description: `Selected: ${binFile.name}`,
        });
      } else {
        toast.error('Invalid file type', {
          description: 'Please select a .json file',
        });
      }
    },
    [clearErrors, setFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile('file', file);
    }
  };

  const [uploadStudents] = useAddStudentsInDepartmentMutation();

  const onSubmit = async (data: EditStudentInDepartmentInput) => {
    try {
      await editStudent({
        groupId: String(_id),
        name: data.name,
        email: data.email,
        studentId: String(editStudentId),
        registration_number: data.registration_number,
        session: data.session,
        rfid: data.rfid,
      }).unwrap();
      toast.success('Student Updated', {
        description: `Student ${data.name} has been updated successfully.`,
      });
      setIsOpen(false);
      reset();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to update student', {
        description: error?.data?.message || 'Failed to update student.',
      });
    }
  };

  const onFileSubmit = async (data: StudentsUploadInput) => {
    try {
      if (!data.file) {
        return toast.error('Validation Error', {
          description: 'Please select a .json file to upload.',
        });
      }

      const formData = new FormData();

      formData.append('students', data.file);
      formData.append('groupId', String(_id));

      await uploadStudents(formData).unwrap();

      toast.success('Students Uploaded', {
        description: `Students have been uploaded successfully.`,
      });
      setCreateModal(false);
      resetFile();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to upload students', {
        description: error?.data?.message || 'Failed to upload students.',
      });
    }
  };

  const handleRemoveStudent = async (id: string) => {
    try {
      await removeStudent({
        groupId: String(_id),
        studentId: id,
      }).unwrap();
      toast.success('Student Removed', {
        description: `Student has been removed from the group successfully.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to remove student', {
        description: error?.data?.message || 'Failed to remove student.',
      });
    }
  };

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
            <BreadcrumbPage>Students</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <TabletsIcon className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          Group Students
        </h1>
        <div className="flex gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setCreateModal(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Students
          </Button>
        </div>
      </div>

      <Card className="py-3 shadow-xs">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium">
              Total Students: {students?.pagination.total}
            </h2>
            <div>
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <NormalTable
            headers={[
              '# ',
              'Registation ',
              'Name',
              'Session',
              'Email',
              'Action',
            ]}
            isLoading={isLoading}
            noDataMessage="No courses found."
            currentPage={students?.pagination.page || 1}
            itemsPerPage={students?.pagination.limit || 10}
            totalItems={students?.pagination.total || 0}
            limitOptions={[10, 20, 30, 50, 70, 100]}
            data={
              students?.students?.map((student, index) => [
                index + 1,
                student.registration_number,
                student.name,
                student.session,
                student.email,
                <div key="actions" className="flex items-center gap-3">
                  <button
                    className="cursor-pointer rounded-md bg-blue-100/60 p-2 text-blue-500 hover:bg-blue-200 dark:bg-blue-200/10 dark:hover:bg-blue-200/20"
                    onClick={() => {
                      setEditStudentId(student._id);
                      setValue('name', student.name);
                      setValue('email', student.email);
                      setValue(
                        'registration_number',
                        student.registration_number
                      );
                      setValue('session', student.session);
                      setValue('rfid', student.rfid || '');
                      setIsOpen(true);
                    }}
                    title="Edit Student"
                  >
                    <NotebookPen className="h-4 w-4" />
                  </button>
                  <button
                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                    title="Delete Student"
                    onClick={() => handleRemoveStudent(student._id)}
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
              Edit Student
            </DialogTitle>
          </AlertDialogHeader>

          <form className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Student Name"
              placeholder="Enter student name"
              name="name"
              error={errors.name?.message}
              isOptional={false}
              props={{
                ...register('name'),
              }}
              type="text"
            />
            <InputField
              label="Email"
              placeholder="Enter student email"
              name="email"
              error={errors.email?.message}
              isOptional={false}
              props={{
                ...register('email'),
              }}
              type="email"
            />
            <InputField
              label="Registration Number"
              placeholder="Enter registration number"
              name="registration_number"
              error={errors.registration_number?.message}
              isOptional={false}
              props={{
                ...register('registration_number'),
              }}
              type="text"
            />
            <InputField
              label="Session"
              placeholder="Enter session"
              name="session"
              error={errors.session?.message}
              isOptional={false}
              props={{
                ...register('session'),
              }}
              type="text"
            />
            <InputField
              label="RFID"
              placeholder="Enter RFID"
              name="rfid"
              error={errors.rfid?.message}
              isOptional={true}
              props={{
                ...register('rfid'),
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
      <Dialog open={createModal} onOpenChange={() => setCreateModal(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Add New Device
            </DialogTitle>
          </AlertDialogHeader>

          <form
            className="space-y-4 py-4"
            onSubmit={handleFileSubmit(onFileSubmit)}
          >
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>
                Students File (.json)
                <span className="text-red-500">*</span>
              </Label>
              <Label htmlFor="file-upload" className="w-full pt-1">
                <div
                  className={cn(
                    'w-full rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <div
                      // htmlFor="file-upload"
                      className="w-full cursor-pointer justify-center"
                    >
                      <span className="text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      // accept=".bin,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Only .json files up to 10MB
                  </p>
                  {watch('file') && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {(watch('file') as File)?.name}
                    </p>
                  )}
                </div>
              </Label>
              {fileErros.file && (
                <p className="text-sm text-red-600">
                  {fileErros.file &&
                  typeof fileErros.file === 'object' &&
                  'message' in fileErros.file
                    ? String((fileErros.file as { message?: string }).message)
                    : null}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Upload Students
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupStudents;
