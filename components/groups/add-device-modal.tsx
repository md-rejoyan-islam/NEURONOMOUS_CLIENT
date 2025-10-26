"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PackagePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import AttendanceDeviceAdd from "./attendance-device-add";
import ClockDeviceAdd from "./clock-device-add";

const AddDeviceModal = ({
  groupId,
  refetchAllDevices,
}: {
  groupId: string;
  refetchAllDevices?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deviceType, setDeviceType] = useState<"clock" | "attendance" | null>(
    null,
  );

  // const onSubmit = async (data: AddDeviceToGroupInput) => {
  //   try {
  //     setSaving(true);
  //     const response = await addDevice({ id: groupId, payload: data }).unwrap();
  //     refetchAllDevices?.();

  //     if (response.success) {
  //       toast.success('Device Added', {
  //         description: `Device ${data.deviceId} has been added successfully.`,
  //       });
  //       reset();
  //       setIsOpen(false);
  //     }
  //     // eslint-disable-next-line
  //   } catch (error: any) {
  //     console.log('Error creating group:', error);

  //     toast.error('Failed to add device', {
  //       description: error?.data?.message || 'Invalid email or password.',
  //     });
  //   } finally {
  //     setSaving(false);
  //   }
  // };

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

          <div>
            <Label className="mb-2 block">Select Device Type</Label>
            <Select
              onValueChange={(value) =>
                setDeviceType(value as "clock" | "attendance")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clock">Clock Device</SelectItem>
                <SelectItem value="attendance">Attendance Device</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {deviceType === null && (
            <p className="text-muted-foreground mt-4 text-sm">
              Please select a device type to proceed.
            </p>
          )}

          {deviceType === "clock" && (
            <ClockDeviceAdd
              refetchAllDevices={refetchAllDevices}
              groupId={groupId}
              setIsOpen={setIsOpen}
            />
          )}
          {deviceType === "attendance" && (
            <AttendanceDeviceAdd
              refetchAllDevices={refetchAllDevices}
              groupId={groupId}
              setIsOpen={setIsOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDeviceModal;
