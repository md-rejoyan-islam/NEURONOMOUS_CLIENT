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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import DownloadFirmware from '@/components/firmware/download-firmware';
import FirmwareCreateForm from '@/components/form/firmware-create-form';
import {
  useDeleteFirmwareMutation,
  useGetFirmwareQuery,
} from '@/queries/firmware';
import { Trash2 } from 'lucide-react';
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

  const { data: firmware = [], isLoading } = useGetFirmwareQuery();

  const [deleteFirmware] = useDeleteFirmwareMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFirmware(deleteId).unwrap();
      toast.success('firmware deleted successfully', {
        description: `Firmware ${deleteId} has been deleted.`,
      });

      setDeleteId(null);
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
            <CardTitle>Upload New Firmware</CardTitle>
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
            <CardTitle>Firmware Versions</CardTitle>
            <CardDescription>
              Manage all uploaded firmware versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmware.length > 0 ? (
                    firmware.map((fw) => (
                      <TableRow key={fw._id}>
                        <TableCell className="font-medium">
                          {fw.version}
                        </TableCell>

                        <TableCell>{fw.size}</TableCell>
                        <TableCell>{formatDate(fw.createdAt)}</TableCell>
                        <TableCell className="flex items-center gap-3">
                          <button
                            className="cursor-pointer rounded-md bg-red-100 p-2 text-red-500 hover:bg-red-200 dark:bg-red-200/10 dark:hover:bg-red-200/20"
                            onClick={() => setDeleteId(fw._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <DownloadFirmware id={fw._id} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-3 text-center">
                        No firmware versions available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
