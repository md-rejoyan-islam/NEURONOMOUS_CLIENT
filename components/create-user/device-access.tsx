'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IDevice } from '@/lib/types';
import { TableIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
const DeviceAccess = ({
  selectedDevices,
  devices,
  handleSelectAllDevices,
  handleDeviceToggle,
}: {
  selectedDevices: string[];
  devices: IDevice[];
  handleSelectAllDevices: () => void;
  handleDeviceToggle: (deviceId: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="text-primary h-5 w-5" />
          Device Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Select Devices</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllDevices}
          >
            {selectedDevices.length === devices.length
              ? 'Deselect All'
              : 'Select All'}
          </Button>
        </div>

        <div className="max-h-64 space-y-3 overflow-y-auto">
          {devices.map((device) => (
            <div
              key={device._id}
              className="flex items-start space-x-3 rounded-lg border p-3"
            >
              <Checkbox
                id={device._id}
                checked={selectedDevices.includes(device._id)}
                onCheckedChange={() => handleDeviceToggle(device._id)}
              />
              <div className="min-w-0 flex-1">
                <Label htmlFor={device._id} className="cursor-pointer">
                  <div className="text-sm font-medium">{device.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {device.location}
                  </div>
                  <Badge
                    variant={
                      device.status === 'online' ? 'default' : 'secondary'
                    }
                    className={`mt-1 text-xs ${
                      device.status === 'online'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : ''
                    }`}
                  >
                    {device.status}
                  </Badge>
                </Label>
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm">
          <strong>{selectedDevices.length}</strong> of{' '}
          <strong>{devices.length}</strong> devices selected
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceAccess;
