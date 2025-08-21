'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AddDeviceToGroupInput,
  addDeviceToGroupSchema,
} from '@/lib/validations';
import { useAddDeviceToGroupMutation } from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, Plus, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import InputField from '../form/input-field';
import { Button } from '../ui/button';

const AddDeviceModal = ({
  groupId,
  refetchAllDevices,
}: {
  groupId: string;
  refetchAllDevices?: () => void;
}) => {
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddDeviceToGroupInput>({
    resolver: zodResolver(addDeviceToGroupSchema),
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const [addDevice, { isLoading }] = useAddDeviceToGroupMutation();

  const onSubmit = async (data: AddDeviceToGroupInput) => {
    try {
      setSaving(true);
      const response = await addDevice({ id: groupId, payload: data }).unwrap();
      refetchAllDevices?.();

      if (response.success) {
        toast.success('Device Added', {
          description: `Device ${data.deviceId} has been added successfully.`,
        });
        reset();
        setIsOpen(false);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Error creating group:', error);

      toast.error('Failed to add device', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PackagePlus className="mr-2 h-4 w-4" />
        Add Device
      </Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-3">
            <DialogTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-green-600" />
              Add New Device
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <InputField
                name="deviceId"
                label="Device ID"
                placeholder="Enter unique device ID"
                type="text"
                error={errors.deviceId?.message}
                props={register('deviceId')}
                disabled={isLoading}
                isOptional={false}
              />
              <p className="text-muted-foreground text-xs">
                Enter a unique identifier for the device
              </p>
            </div>
            <div>
              <InputField
                name="deviceName"
                label="Device Name"
                placeholder="Enter device name"
                type="text"
                error={errors.name?.message}
                disabled={isLoading}
                props={register('name')}
                isOptional={false}
              />
              <p className="text-muted-foreground text-xs">
                A friendly name for the device (auto-generated from ID)
              </p>
            </div>

            <InputField
              name="location"
              label="Location"
              type="text"
              error={errors.location?.message}
              props={register('location')}
              disabled={isLoading}
              placeholder="e.g. Living Room, Office"
            />

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="mb-2 flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Device Setup Instructions
                </span>
              </div>
              <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-xs">
                <li>
                  Configure the device with ID:{' '}
                  <code className="bg-muted rounded px-1">{'[device-id]'}</code>
                </li>
                <li>Connect the device to your network</li>
                <li>The device will appear online once connected</li>
              </ol>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Plus className="mr-2 h-4 w-4 animate-pulse" />
                    Adding Device...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDeviceModal;
