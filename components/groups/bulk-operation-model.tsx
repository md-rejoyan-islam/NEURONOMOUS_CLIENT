'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { dateTimeDurationValidation } from '@/lib/helper';
import { IDevice } from '@/lib/types';
import {
  useChangeSelectedDeviceModeMutation,
  useSendNoticeToSelectedDevicesMutation,
  useSendScheduledNoticeToSelectedDevicesMutation,
} from '@/queries/devices';
import { format } from 'date-fns';
import { Send, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeviceSelect from './bulk-operation/device-select';
import ModeType from './bulk-operation/mode-type';
import NoticeType from './bulk-operation/notice-type';

const BulkOperationModel = ({
  devices,
  setFilteredDevices,
}: {
  devices: IDevice[];
  refetch?: () => void;
  setFilteredDevices?: (devices: IDevice[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [operation, setOperation] = useState<'mode' | 'notice'>('notice');
  const [mode, setMode] = useState<'clock' | 'notice'>('clock');
  const [message, setMessage] = useState('');
  const [durationType, setDurationType] = useState<
    'unlimited' | 'minutes' | 'datetime'
  >('unlimited');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState('12:00');
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState('12:00');
  const [processing, setProcessing] = useState(false);

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };
  const onClose = () => {
    setIsOpen(false);
    setSelectedDevices([]);
    setOperation('notice');
    setMode('clock');
    setMessage('');
    setDurationType('unlimited');
    setDurationMinutes('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime('12:00');
    setEndTime('12:00');
    setProcessing(false);
  };

  const [changeDevicesMode] = useChangeSelectedDeviceModeMutation();

  const handleModeSubmit = async () => {
    try {
      if (!mode) {
        return toast.error('Validation Error', {
          description: 'Please select a valid mode to update.',
        });
      }

      if (selectedDevices.length === 0) {
        return toast.error('Validation Error', {
          description: 'Please select at least one device.',
        });
      }

      await changeDevicesMode({
        deviceIds: selectedDevices,
        mode,
      }).unwrap();

      setFilteredDevices?.(
        devices.map((device) => {
          const isSelected = selectedDevices.includes(device._id);
          return isSelected ? { ...device, mode } : device;
        })
      );
      toast.success('Device Mode Updated', {
        description: `Device mode changed to ${mode}.`,
      });
      setIsOpen(false);
      setSelectedDevices([]);
      setOperation('notice');
      setMode('clock');

      // eslint-disable-next-line
    } catch (error: any) {
      toast('Update Failed', {
        description: error?.data?.message || 'Failed to update device mode.',
      });
    }
  };

  const [sendNoticeToSelectedDevice] = useSendNoticeToSelectedDevicesMutation();
  const [sendScheduledNoticeToSelectedDevices] =
    useSendScheduledNoticeToSelectedDevicesMutation();

  const handleNoticeSubmit = async () => {
    if (selectedDevices.length === 0) {
      return toast.error('Validation Error', {
        description: 'Please select at least one device.',
      });
    }
    if (!message.trim()) {
      toast('Validation Error', {
        description: 'Please enter a notice message.',
      });
      return;
    }

    try {
      const response = dateTimeDurationValidation({
        durationType,
        durationMinutes,
        startDate,
        endDate,
        startTime,
        endTime,
      });
      if (!response) return;

      if (durationType === 'unlimited') {
        setProcessing(true);
        await sendNoticeToSelectedDevice({
          deviceIds: selectedDevices,
          notice: message,
        }).unwrap();
      } else if (durationType === 'minutes') {
        setProcessing(true);
        await sendNoticeToSelectedDevice({
          deviceIds: selectedDevices,
          notice: message,
          duration: +durationMinutes,
        }).unwrap();
      } else if (durationType === 'datetime') {
        setProcessing(true);
        // get unix time from startDate and StartTime
        if (!startDate || !endDate) {
          toast.error('Validation Error', {
            description: 'Please select start and end dates.',
          });
          return;
        }

        const startTimeInUnix = new Date(
          `${format(startDate, 'yyyy-MM-dd')}T${startTime}:00`
        ).getTime();
        const endTimeInUnix = new Date(
          `${format(endDate, 'yyyy-MM-dd')}T${endTime}:00`
        ).getTime();

        await sendScheduledNoticeToSelectedDevices({
          deviceIds: selectedDevices,
          notice: message,
          startTime: startTimeInUnix,
          endTime: endTimeInUnix,
        }).unwrap();

        // refetch();
      }

      toast.success('Notice Sent', {
        description: `Notice message sent to device successfully.`,
      });
      setFilteredDevices?.(
        devices.map((device) => {
          const isSelected = selectedDevices.includes(device._id);
          return isSelected
            ? {
                ...device,
                notice: message,
              }
            : device;
        })
      );

      // Reset form
      setSelectedDevices([]);
      setOperation('notice');
      setMode('clock');
      setMessage('');
      setDurationType('unlimited');
      setDurationMinutes('');
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTime('12:00');
      setEndTime('12:00');
      setProcessing(false);
      onClose();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to send notice.',
      });
    }
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        Bulk Operations
      </Button>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="text-primary h-5 w-5" />
              Bulk Device Operations
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Operation Type */}
            <div className="space-y-3">
              <Label>Operation Type</Label>
              <RadioGroup
                value={operation}
                onValueChange={(value: 'mode' | 'notice') =>
                  setOperation(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mode" id="mode" />
                  <Label htmlFor="mode" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Change Device Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notice" id="notice" />
                  <Label htmlFor="notice" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Notice Message
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Mode Selection (only for mode operation) */}
            {operation === 'mode' && <ModeType mode={mode} setMode={setMode} />}

            {/* Notice Message (only for notice operation) */}
            {operation === 'notice' && (
              <NoticeType
                message={message}
                setMessage={setMessage}
                durationType={durationType}
                setDurationType={setDurationType}
                durationMinutes={durationMinutes}
                setDurationMinutes={setDurationMinutes}
                startDate={startDate}
                setStartDate={setStartDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endDate={endDate}
                setEndDate={setEndDate}
                endTime={endTime}
                setEndTime={setEndTime}
              />
            )}

            {/* Device Selection */}
            <DeviceSelect
              devices={devices}
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              handleDeviceToggle={handleDeviceToggle}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  operation === 'mode' ? handleModeSubmit : handleNoticeSubmit
                }
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {operation === 'mode' ? (
                      <Settings className="mr-2 h-4 w-4" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {operation === 'mode' ? 'Change Mode' : 'Send Notice'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkOperationModel;
