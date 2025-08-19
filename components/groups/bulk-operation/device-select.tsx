'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IDevice } from '@/lib/types';

const DeviceSelect = ({
  devices,
  selectedDevices,
  handleDeviceToggle,
  setSelectedDevices,
}: {
  devices: IDevice[];
  selectedDevices: string[];
  handleDeviceToggle: (deviceId: string) => void;
  setSelectedDevices: (devices: string[]) => void;
}) => {
  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map((d) => d._id));
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Select Devices</Label>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {selectedDevices.length === devices.length
            ? 'Deselect All'
            : 'Select All'}
        </Button>
      </div>

      <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="hover:bg-muted/50 flex items-center space-x-3 rounded p-2"
          >
            <Checkbox
              id={device._id}
              checked={selectedDevices.includes(device._id)}
              onCheckedChange={() => handleDeviceToggle(device._id)}
            />
            <Label
              htmlFor={device._id}
              className="flex flex-1 cursor-pointer items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">{device.name}</div>
                <div className="text-muted-foreground text-xs">
                  {device.id} • {device.location}
                </div>
              </div>
              <Badge
                variant={device.status === 'online' ? 'default' : 'secondary'}
                className={`text-xs ${
                  device.status === 'online'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                    : ''
                }`}
              >
                {device.status}
              </Badge>
            </Label>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        {selectedDevices.length} of {devices.length} devices selected
      </p>
    </div>
  );
};

export default DeviceSelect;
