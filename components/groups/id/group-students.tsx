'use client';
import InputField from '@/components/form/input-field';
import NormalTable from '@/components/table/normal-table';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
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
  ShieldUser,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';

const GroupStudents = ({
  _id,
  page,
  search,
  limit,
}: {
  _id: string;
  page: string;
  search: string;
  limit: string;
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(search);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const { data: students, isLoading } = useGetDepartmentStudentsQuery(
    {
      id: String(_id),
      query: `page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
    },
    {
      skip: !_id,
    }
  );
  const [editStudent, { isLoading: isEditLoading }] =
    useEditStudentInDepartmentMutation();
  const [removeStudent, { isLoading: isRemoveLoading }] =
    useRemoveStudentForDepartmentMutation();
  const [uploadStudents, { isLoading: isfileLoading }] =
    useAddStudentsInDepartmentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditStudentInDepartmentInput>({
    resolver: zodResolver(editStudentInDepartmentSchema),
  });
  const {
    handleSubmit: handleFileSubmit,
    setValue: setFile,
    clearErrors,
    reset: resetFile,
    formState: { errors: fileErros },
  } = useForm<StudentsUploadInput>({
    resolver: zodResolver(studentsUploadSchema),
  });

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const currentUrl = new URL(window.location.href);
    if (value) {
      currentUrl.searchParams.set('search', value);
    } else {
      currentUrl.searchParams.delete('search');
    }
    currentUrl.searchParams.delete('page');
    const timer = setTimeout(() => {
      router.push(
        `${window.location.pathname}?${currentUrl.searchParams.toString()}`
      );
    }, 500);

    return () => clearTimeout(timer);
  };
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
        setSelectedFile(binFile);
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
      setSelectedFile(file);
    }
  };

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
      setSelectedFile(null);
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
    <>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <ShieldUser className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
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
              Total Students: {students?.pagination.items || 0}
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
              'phone',
              'Email',
              'Action',
            ]}
            isLoading={isLoading}
            noDataMessage="No courses found."
            currentPage={students?.pagination.page || 1}
            itemsPerPage={students?.pagination.limit || 10}
            totalItems={students?.pagination.items || 0}
            limitOptions={[10, 20, 30, 50, 70, 100]}
            data={
              students?.students?.map((student, index) => [
                (students?.pagination.page - 1) * students?.pagination.limit +
                  index +
                  1,
                student.registration_number,
                student.name,
                student.session,
                student.phone || 'N/A',
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
                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                    title="Delete Student"
                    onClick={() => handleRemoveStudent(student._id)}
                    disabled={isRemoveLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
              <Button type="submit" className="w-full" disabled={isEditLoading}>
                {isEditLoading ? 'Updating...' : 'Update Student'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={createModal}
        onOpenChange={() => {
          setCreateModal(false);
          setSelectedFile(null);
          resetFile();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Upload Students
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
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </Label>
              {fileErros.file && (
                <p className="text-sm text-red-600">
                  {typeof fileErros.file === 'object' &&
                  'message' in fileErros.file
                    ? String((fileErros.file as { message?: string }).message)
                    : null}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isfileLoading}>
                {isfileLoading ? 'Uploading...' : 'Upload Students'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupStudents;
