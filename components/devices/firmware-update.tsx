import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateDeviceFirmwareMutation } from '@/queries/devices';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const FirmwareUpdate = ({
  version,
  id,
  firmwareId,
}: {
  version: string;
  id: string;
  firmwareId: string;
}) => {
  const [updateDeviceFirmware, { isLoading }] =
    useUpdateDeviceFirmwareMutation();

  const updateFirmware = async () => {
    try {
      await updateDeviceFirmware({ deviceId: id, firmwareId }).unwrap();

      toast.success('Firmware updated successfully', {
        description: `Device ${id} has been updated to version ${version}.`,
      });

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to send notice.',
      });
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Button className="group text-xs" onClick={() => setIsOpen(true)}>
        <Download className="h-4 w-4 group-hover:animate-bounce" />
        <span>Update Firmware (v{version} available)</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-md p-2 text-2xl">⚠️</div>
              <div>
                <h3 className="text-xl">
                  Confirm Firmware Update to v{version}
                </h3>
                <p className="text-xs">
                  Please follow these instructions carefully to ensure a
                  successful update.
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <ul className="text-muted-foreground space-y-4 pl-5 text-sm">
                <li className="">
                  <strong>🔌 Plugin with a Power Source:</strong> Connect the
                  device to a reliable power outlet during the update to prevent
                  it from shutting down unexpectedly.
                </li>
                <li>
                  <strong>📶 Stable WiFi Connection:</strong> If the update
                  requires an internet connection, make sure you are on a stable
                  and strong WiFi network.
                </li>
                <li>
                  <strong>🚧 Do Not Interrupt:</strong> Once the update begins,
                  do not turn off, unplug, or use the device until the process
                  is fully complete.
                </li>
                <li>
                  <strong>⏳ Time Required:</strong> The update may take several
                  minutes. Please be patient and wait for the device to restart
                  automatically.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={updateFirmware} disabled={isLoading}>
              Update Firmware
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FirmwareUpdate;
