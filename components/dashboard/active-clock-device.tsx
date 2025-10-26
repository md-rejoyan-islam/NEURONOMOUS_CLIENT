import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { socketManager } from "@/lib/socket";
import { useGetAllDevicesQuery } from "@/queries/devices";

import { CheckCircle, Wifi } from "lucide-react";
import { useEffect } from "react";

const ActiveClockDevice = () => {
  const { data: devices, refetch: refetchAllDevices } = useGetAllDevicesQuery(
    {},
  );
  const activeDevices =
    devices?.filter((d) => d.status === "online").length || 0;

  useEffect(() => {
    const socket = socketManager.connect();
    if (!socket) return;
    const handler = () => refetchAllDevices();
    socket.on("device:status", handler);
    return () => {
      socket.off("device:status", handler);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
        <Wifi className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {activeDevices}/{devices?.length || 0}
        </div>
        <Progress
          value={(activeDevices / (devices?.length || 0)) * 100}
          className="mt-2"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle className="h-3 w-3" /> {activeDevices} online
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ActiveClockDevice;
