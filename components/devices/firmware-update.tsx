import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { socketManager } from '@/lib/socket';
import { useUpdateDeviceFirmwareMutation } from '@/queries/devices';
import { Cog, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';

const FirmwareUpdate = ({
  version,
  id,
  firmwareId,
  disabled,
}: {
  version: string;
  id: string;
  firmwareId: string;
  disabled?: boolean;
}) => {
  const [updateDeviceFirmware, { isLoading }] =
    useUpdateDeviceFirmwareMutation();
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [failedUpdate, setFailedUpdate] = useState(false);

  const updateFirmware = async () => {
    try {
      await updateDeviceFirmware({ deviceId: id, firmwareId }).unwrap();
      setUpdateMessage(null);
      setIsOpen(false);
      setIsOpenProcess(true);
      setProgress(0);
      setFailedUpdate(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to send notice.',
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProcess, setIsOpenProcess] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!id) return;
    const socket = socketManager.connect();
    if (!socket) return;
    const handler = (message: { status: string }) => {
      const { status } = message;
      const messageValue = status.split(': ')[1];
      const value = +messageValue?.split('%')[0];

      // if (messageValue === 'Started') {
      //   setUpdateMessage('Starting update...');
      // } else

      if (+value >= 0 && +value <= 100) {
        setFailedUpdate(false);
        setUpdateMessage('');
        setProgress(+value);
      } else if (messageValue === 'Rebooting') {
        setFailedUpdate(false);
        setProgress(100);
        setUpdateMessage('Rebooting device...');
        setTimeout(() => {
          setIsOpenProcess(false);
          setUpdateMessage(null);
          setProgress(0);
          toast.success('Firmware updated successfully', {
            description: `Device ${id} has been updated to version ${version}.`,
          });
        }, 5000);
      } else if (messageValue === 'Failed') {
        setFailedUpdate(true);
        setUpdateMessage('Update failed. Please try again.');
        setIsOpenProcess(false);

        // setProgress(0);
        // toast.error('Firmware update failed', {
        //   description: `Device ${id} failed to update to version ${version}. Please try again.`,
        // });
      }
    };
    socket.on(`device:${id}:firmware`, handler);
    return () => {
      socket.off(`device:${id}:firmware`, handler);
    };
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Button
        className="group text-xs"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(true)}
      >
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
      <Dialog open={isOpenProcess}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <p className="pr-2">
                <Cog className="text-primary scale-150 animate-spin" />
              </p>
              <div>
                <h3 className="text-xl">Firmware Update in Progress</h3>
                <p className="text-xs">
                  Please do not turn off or unplug the device during the update.
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            {/* show percentage */}
            <div className="mb-2 flex justify-between text-xs opacity-80">
              <p>Installed</p>
              <p>{updateMessage ? updateMessage : `${progress}%`}</p>
            </div>
            <Progress value={progress} className="w-full" />

            <p className="mt-4 animate-pulse text-center text-sm opacity-70">
              This process may take several minutes. Please be patient.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={failedUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-md p-2 text-2xl">❌</div>
              <div>
                <h3 className="text-xl">Firmware Update Failed</h3>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="pb-3">
            <p className="mb-4 text-sm opacity-70">
              The firmware update has failed. Please try again. If the problem
              persists, contact support.
            </p>

            <div className="mb-2 flex justify-between text-xs opacity-80">
              <p>Installed</p>
              <p>{updateMessage ? updateMessage : `${progress}%`}</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setFailedUpdate(false)}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FirmwareUpdate;
