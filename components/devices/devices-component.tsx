"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { socketManager } from "@/lib/socket";
import { useProfileQuery } from "@/queries/auth";
import { useGetAllDevicesQuery } from "@/queries/devices";
import {
  Bell,
  Clock,
  TabletsIcon as Devices,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SimpleSummaryCard from "../cards/simple-summary-card";
import AddDeviceModal from "../groups/add-device-modal";
import BulkOperationModel from "../groups/bulk-operation-model";
import SmallLoading from "../loading/small-loading";

export default function DevicesComponent() {
  const {
    data: devices = [],
    isLoading,
    error,
    refetch: refetchAllDevices,
  } = useGetAllDevicesQuery();

  const { data: user } = useProfileQuery();

  const usedDevices = devices.reduce((acc, device) => {
    return acc + (device?.allowed_users?.length ? 1 : 0);
  }, 0);

  const [searchTerm, setSearchTerm] = useState("");

  // const { data: devices = [], isLoading, error } = useGetDevicesQuery();

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device?.location?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatLastSeen = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  if (isLoading) {
    return <SmallLoading />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Failed to load devices</h3>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Regular Device List View (for admins or when viewing specific group/all devices)
  return (
    <>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Devices className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Device Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and control your IoT devices
            </p>
          </div>
          {user?.role === "admin" && user?.group && (
            <div>
              <AddDeviceModal
                groupId={user?.group}
                refetchAllDevices={refetchAllDevices}
              />
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid pt-4 grid-cols-1 sm:grid-cols-2 pb-6 lg:grid-cols-4 gap-4 sm:gap-6">
          <SimpleSummaryCard
            label="Total Devices"
            value={devices.length}
            icon={
              <Devices className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            }
            valueColor="text-blue-600 dark:text-blue-400"
          />
          <SimpleSummaryCard
            label="Online Devices"
            value={filteredDevices.filter((d) => d.status === "online").length}
            icon={
              <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
            }
            valueColor="text-green-600 dark:text-green-400"
          />
          <SimpleSummaryCard
            label="Offline Devices"
            value={filteredDevices.filter((d) => d.status === "offline").length}
            icon={
              <WifiOff className="w-6 h-6 text-red-600 dark:text-red-400" />
            }
            valueColor="text-red-600 dark:text-red-400"
          />
          <SimpleSummaryCard
            label="Notice Mode"
            value={filteredDevices.filter((d) => d.mode === "notice").length}
            icon={
              <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            }
            valueColor="text-orange-600 dark:text-orange-400"
          />
          {user?.role === "superadmin" && (
            <SimpleSummaryCard
              label="Unused Devices"
              value={devices.length - usedDevices}
              icon={
                <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              }
              valueColor="text-orange-600 dark:text-orange-400"
            />
          )}
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Devices className="w-5 h-5 text-primary" />
                All Devices
              </CardTitle>
              <div className="flex gap-3 items-center">
                <div className="flex gap-2">
                  <BulkOperationModel devices={devices || []} />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search devices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDevices.map((device) => (
                <Card
                  key={device.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg font-semibold truncate">
                          {device.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {device.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {device.status === "online" ? (
                          <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            device.status === "online"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            device.status === "online"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                              : ""
                          }
                        >
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Mode:
                      </span>
                      <div className="flex items-center gap-1">
                        {device.mode === "clock" ? (
                          <Clock className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Bell className="w-4 h-4 text-orange-500" />
                        )}
                        <Badge variant="outline" className="capitalize">
                          {device.mode}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Location:
                      </span>
                      <span className="text-sm font-medium">
                        {device.location}
                      </span>
                    </div>

                    {device.notice && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-orange-800 dark:text-orange-400 font-medium">
                          Current Notice:
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {device.notice}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{device.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Seen:
                        </span>
                        <span className="font-medium text-xs">
                          {formatLastSeen(device.last_seen)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/devices/${device._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDevices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Devices className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">No devices found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "Connect your IoT devices to get started."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
