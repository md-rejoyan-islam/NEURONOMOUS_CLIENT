'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import DownloadFirmware from '@/components/firmware/download-firmware';
import FirmwareStatusChange from '@/components/firmware/firmware-status-change';
import FirmwareCreateForm from '@/components/form/firmware-create-form';
import NormalTable from '@/components/table/normal-table';
import {
  useDeleteFirmwareMutation,
  useGetAllFirmwareQuery,
} from '@/queries/firmware';
import { Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export interface Firmware {
  _id: string;
  version: number;
  type: 'single' | 'double';
  file: Buffer;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function FirmwareContent() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const { data, isFetching } = useGetAllFirmwareQuery(
    `page=${page}&limit=${limit}`
  );
  const firmwares = data?.data || [];
  const pagination = data?.pagination;

  const [deleteFirmware] = useDeleteFirmwareMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFirmware(deleteId).unwrap();
      toast.success('firmware deleted successfully', {
        description: `Firmware ${deleteId} has been deleted.`,
      });

      setDeleteId(null);

      // eslint-disable-next-line
    } catch (error) {
      toast.error('Delete failed', {
        description: 'Failed to delete firmware. Please try again.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //   if (isLoading) {
  //     return (
  //       <div className="flex h-64 items-center justify-center">
  //         <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
  //       </div>
  //     );
  //   }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Firmware Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage firmware versions for devices
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upload Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="sm:text-lg">Upload New Firmware</CardTitle>
            <CardDescription>
              Upload a new firmware version for your devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FirmwareCreateForm />
          </CardContent>
        </Card>

        {/* Firmware List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="sm:text-lg">Firmware Versions</CardTitle>
            <CardDescription>
              Manage all uploaded firmware versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NormalTable
              currentPage={pagination?.page || 1}
              itemsPerPage={pagination?.limit || 10}
              totalItems={pagination?.totalPages || 0}
              headers={[
                '#',
                'Version',
                'File Size',
                'Status',
                'Device Type',
                'Description',
                'Upload Date',
                'Actions',
              ]}
              isLoading={isFetching}
              noDataMessage="No firmware versions available."
              data={firmwares?.map((fw, index) => [
                index +
                  1 +
                  ((pagination?.page || 1) - 1) * (pagination?.limit || 10),
                <span key="version" className="font-medium">
                  {fw.version}
                </span>,
                <span key="size">{fw.size}</span>,
                <FirmwareStatusChange
                  key="status"
                  status={fw.status}
                  id={fw._id}
                />,
                <span key="device_type" className="capitalize">
                  {fw.device_type}
                </span>,
                <span key="description">{fw.description}</span>,
                <span key="createdAt">{formatDate(fw.createdAt)}</span>,
                <div key="actions" className="flex items-center gap-3">
                  <button
                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                    onClick={() => setDeleteId(fw._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <DownloadFirmware id={fw._id} />
                </div>,
              ])}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Firmware</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this firmware version? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
