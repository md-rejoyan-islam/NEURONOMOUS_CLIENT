"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IDevice } from "@/lib/types";

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
      setSelectedDevices(devices.map((d) => d.id));
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Select Devices</Label>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {selectedDevices.length === devices.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
          >
            <Checkbox
              id={device.id}
              checked={selectedDevices.includes(device.id)}
              onCheckedChange={() => handleDeviceToggle(device.id)}
            />
            <Label
              htmlFor={device.id}
              className="flex-1 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-sm">{device.name}</div>
                <div className="text-xs text-muted-foreground">
                  {device.id} • {device.location}
                </div>
              </div>
              <Badge
                variant={device.status === "online" ? "default" : "secondary"}
                className={`text-xs ${
                  device.status === "online"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                    : ""
                }`}
              >
                {device.status}
              </Badge>
            </Label>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {selectedDevices.length} of {devices.length} devices selected
      </p>
    </div>
  );
};

export default DeviceSelect;
