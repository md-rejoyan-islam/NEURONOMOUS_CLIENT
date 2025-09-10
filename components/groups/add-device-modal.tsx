'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, PackagePlus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import AttendanceDeviceAdd from './attendance-device-add';
import ClockDeviceAdd from './clock-device-add';

const AddDeviceModal = ({
  groupId,
  refetchAllDevices,
}: {
  groupId: string;
  refetchAllDevices?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PackagePlus className="mr-2 h-4 w-4" />
        Add Device
      </Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="">
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Add New Device
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="clock">
            <TabsList className="w-full">
              <TabsTrigger value="clock" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Clock & Notice
                <span className="hidden sm:block">&nbsp;Device </span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="w-full">
                <UserCheck className="mr-2 h-4 w-4" />
                Attendance{' '}
                <span className="hidden sm:block">&nbsp;Device </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="clock" className="mt-5">
              <ClockDeviceAdd
                refetchAllDevices={refetchAllDevices}
                groupId={groupId}
                setIsOpen={setIsOpen}
              />
            </TabsContent>
            <TabsContent value="attendance" className="mt-5">
              <AttendanceDeviceAdd
                refetchAllDevices={refetchAllDevices}
                groupId={groupId}
                setIsOpen={setIsOpen}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDeviceModal;
