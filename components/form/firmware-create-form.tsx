'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FirmwareFormData, firmwareSchema } from '@/lib/validations';
import { useCreateFirmwareMutation } from '@/queries/firmware';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import InputField from './input-field';
import TextField from './text-field';

const FirmwareCreateForm = () => {
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FirmwareFormData>({
    resolver: zodResolver(firmwareSchema),
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

      const binFile = files.find((file) => file.name.endsWith('.bin'));

      if (binFile) {
        setValue('file', binFile);
        clearErrors('file');
        toast.success('File selected: ', {
          description: `Selected: ${binFile.name}`,
        });
      } else {
        toast.error('Invalid file type', {
          description: 'Please select a .bin file',
        });
      }
    },
    [setValue, clearErrors]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file);
    }
  };

  const [uploadFirmware, { isLoading: isUploading }] =
    useCreateFirmwareMutation();
  const onSubmit = async (data: FirmwareFormData) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('version', data.version);
      formData.append('description', data.description);
      formData.append('device_type', data.device_type);

      await uploadFirmware(formData).unwrap();
      toast.success('Firmware uploaded successfully', {
        description: `Version ${data.version} has been uploaded.`,
      });

      reset();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Upload failed', {
        description:
          error?.data?.message ||
          'Failed to upload firmware. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* File Upload Area */}
      <div className="space-y-2">
        <Label>
          Firmware File (.bin)
          <span className="text-red-500">*</span>
        </Label>
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-6 text-center transition-colors',
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
            <Label
              htmlFor="file-upload"
              className="cursor-pointer justify-center"
            >
              <span className="text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </Label>
            <Input
              id="file-upload"
              type="file"
              // Accept=.bin , pdf
              accept=".bin,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Only .bin files up to 5MB
          </p>
          {watch('file') && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {(watch('file') as File)?.name}
            </p>
          )}
        </div>
        {errors.file && (
          <p className="text-sm text-red-600">
            {errors.file &&
            typeof errors.file === 'object' &&
            'message' in errors.file
              ? String((errors.file as { message?: string }).message)
              : null}
          </p>
        )}
      </div>

      {/* Version Input */}
      <InputField
        name="version"
        label="Firmware Version"
        placeholder="e.g., 2.1.0"
        isOptional={false}
        error={errors.version?.message}
        props={{ ...register('version') }}
      />
      <div className="space-y-2">
        <Label>
          Device Type
          <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) =>
            setValue('device_type', value as 'clock' | 'attendance', {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select device type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clock">Clock</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
          </SelectContent>
        </Select>
        {errors.device_type && (
          <p className="text-sm text-red-600">{errors.device_type.message}</p>
        )}
      </div>

      {/* Description */}
      <TextField
        name="description"
        label="Firmware Description"
        placeholder="Brief description of this firmware version..."
        error={errors.description?.message}
        props={{ ...register('description') }}
        isOptional={false}
      />

      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Firmware'}
      </Button>
    </form>
  );
};

export default FirmwareCreateForm;
