import { Button } from '@/components/ui/button';
import { useDeviceRestartByIdMutation } from '@/queries/devices';
import clsx from 'clsx';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const RestartDevice = ({ id, isActive }: { id: string; isActive: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceRestart, { isLoading: isLoadingRestart }] =
    useDeviceRestartByIdMutation();

  const handleDeviceRestart = async () => {
    try {
      await deviceRestart({ deviceId: id }).unwrap();

      toast.success('Device Restarted', {
        description: `Device is restarting.`,
      });
      setIsOpen(false);
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Restart Failed', {
        description: error?.data?.message || 'Failed to restart device.',
      });
    }
  };
  return (
    <>
      <Button
        size={'sm'}
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="group h-fit w-fit px-0 py-1.5 text-[12px]"
        disabled={!isActive || isLoadingRestart}
      >
        <RotateCcw
          className={clsx(
            isLoadingRestart ? 'animate-spin' : '',
            'group-hover:animate-spin'
          )}
        />
        Restart
      </Button>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-yellow-600" />
              Confirm Device Restart
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Are you sure you want to restart this device? This action will
              temporarily disconnect the device from the network. It may take a
              few moments for the device to come back online.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeviceRestart} disabled={isLoadingRestart}>
              <RotateCcw
                className={clsx(
                  isLoadingRestart ? 'animate-spin' : '',
                  'h-4 w-4'
                )}
              />
              Restart Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestartDevice;
