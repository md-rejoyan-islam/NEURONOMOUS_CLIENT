"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dateTimeDurationValidation } from "@/lib/helper";
import { socketManager } from "@/lib/socket";
import {
  useCancelScheduledNoticeMutation,
  useChangeDeviceModeMutation,
  useGetAllowedUsersForDeviceQuery,
  useGetAllScheduledNoticesQuery,
  useGetDeviceQuery,
  useGiveDeviceAccessToUserMutation,
  useRevolkDeviceAccessFromUserMutation,
  useSendNoticeToDeviceMutation,
  useSendScheduledNoticeMutation,
} from "@/queries/devices";
import { useGetAllUsersInGroupQuery } from "@/queries/group";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Clock,
  KeyRound,
  LogOut,
  RefreshCw,
  Save,
  Trash,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DatetimeRange from "../groups/bulk-operation/datetime-range";
import DurationMinutes from "../groups/bulk-operation/duration-minutes";
import SmallLoading from "../loading/small-loading";
import DeviceNotFound from "../not-found/device-not-found";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function SingleDevice({ id }: { id: string }) {
  const router = useRouter();

  const {
    data: device,
    isLoading,
    error,
    refetch: refetchDevice,
  } = useGetDeviceQuery({ id });

  const { data: allowedUsers, refetch: refetchAllowUsers } =
    useGetAllowedUsersForDeviceQuery({ id });

  const [cancelScheduledNotice] = useCancelScheduledNoticeMutation();

  const { data: schedules, refetch } = useGetAllScheduledNoticesQuery({ id });

  const [revolkDeviceAccess] = useRevolkDeviceAccessFromUserMutation();

  const [changeMode] = useChangeDeviceModeMutation();
  const [sendNotice] = useSendNoticeToDeviceMutation();
  const [sendScheduleNotice] = useSendScheduledNoticeMutation();

  // Form states
  const [mode, setMode] = useState<"clock" | "notice" | undefined>(
    device?.mode || undefined
  );
  const [notice, setNotice] = useState("");

  const [durationType, setDurationType] = useState<
    "unlimited" | "minutes" | "datetime"
  >("unlimited");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("12:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("12:00");
  const [isChangeFontTime, setIsChangeFontTime] = useState(false);
  const [giveDeviceAccess] = useGiveDeviceAccessToUserMutation();
  const [isUpdating] = useState(false);

  const handleRevokeAccess = async (userId: string) => {
    try {
      await revolkDeviceAccess({ userId, deviceId: id }).unwrap();
      toast.success("Device Access Revoked", {
        description: "User access to the device has been revoked.",
      });
      refetchAllowUsers();
      // eslint-disable-next-line
    } catch (error: any) {
      console.log("Error revoking access:", error);
      toast.error("Failed to revoke access", {
        description: error?.data?.message || "Failed to revoke device access.",
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const { data: groupMembers } =
    useGetAllUsersInGroupQuery(device?.group || "") || [];
  const handleAddUserToDevice = async () => {
    try {
      await giveDeviceAccess({ userIds: selectedUsers, deviceId: id }).unwrap();
      toast.success("Device Access Granted", {
        description: "Selected users have been granted access to the device.",
      });
      setSelectedUsers([]);
      setIsOpen(false);
      refetchAllowUsers();

      // eslint-disable-next-line
    } catch (error: any) {
      console.log("Error creating group:", error);

      toast.error("Failed to add device", {
        description: error?.data?.message || "Invalid email or password.",
      });
    }
  };

  const withoutAccessUsers =
    groupMembers?.filter(
      (user) =>
        !allowedUsers?.some((u) => u._id === user._id) && user.role !== "admin"
    ) || [];

  useEffect(() => {
    if (!device) return;
    const socket = socketManager.connect();
    if (!socket) return;
    const handler = () => refetchDevice();
    socket.on(`device:${device.id}:status`, handler);
    return () => {
      socket.off(`device:${device.id}:status`, handler);
    };
    // eslint-disable-next-line
  }, [device?.id]);

  // useEffect(() => {
  //   // Connect to socket for real-time updates (optional)
  //   const socket = socketManager.connect();

  //   if (socket && socketManager.isConnected()) {
  //     // Listen for device updates
  //     socket.on(`device:${id}:updated`, (updatedDevice) => {
  //       console.log("Device updated via socket:", updatedDevice);
  //       refetch();
  //       toast.success("Device Updated", {
  //         description: "Device has been updated in real-time.",
  //       });
  //     });

  //     socket.on(`device:${id}:status`, (status) => {
  //       console.log("Device status changed:", status);
  //       refetch();
  //     });

  //     // Join device room for real-time updates
  //     socket.emit("join:device", id);

  //     return () => {
  //       socket.off(`device:${id}:updated`);
  //       socket.off(`device:${id}:status`);
  //       socket.emit("leave:device", id);
  //     };
  //   } else {
  //     console.log(
  //       "Socket not available - real-time updates disabled for device:",
  //       id
  //     );
  //   }
  // }, [id, refetch]);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleModeSubmit = async () => {
    try {
      if (!mode || mode === device?.mode) {
        return toast("Validation Error", {
          description: "Please select a valid mode to update.",
        });
      }
      await changeMode({ id, mode }).unwrap();

      toast.success("Device Mode Updated", {
        description: `Device mode changed to ${mode}.`,
      });
      // refetch();
      // eslint-disable-next-line
    } catch (error: any) {
      toast("Update Failed", {
        description: error?.data?.message || "Failed to update device mode.",
      });
    }
  };

  const handleNoticeSubmit = async () => {
    if (!notice.trim()) {
      toast("Validation Error", {
        description: "Please enter a notice message.",
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

      if (durationType === "unlimited") {
        await sendNotice({
          id,
          notice,
        }).unwrap();
      } else if (durationType === "minutes") {
        await sendNotice({
          id,
          notice,
          duration: +durationMinutes,
        }).unwrap();
      } else if (durationType === "datetime") {
        // get unix time from startDate and StartTime
        if (!startDate || !endDate) {
          toast.error("Validation Error", {
            description: "Please select start and end dates.",
          });
          return;
        }

        const startTimeInUnix = new Date(
          `${format(startDate, "yyyy-MM-dd")}T${startTime}:00`
        ).getTime();
        const endTimeInUnix = new Date(
          `${format(endDate, "yyyy-MM-dd")}T${endTime}:00`
        ).getTime();

        await sendScheduleNotice({
          id,
          notice,
          startTime: startTimeInUnix,
          endTime: endTimeInUnix,
        }).unwrap();

        refetch();
      }

      toast.success("Notice Sent", {
        description: `Notice message sent to device successfully.`,
      });

      setNotice("");
      setDurationType("unlimited");
      setDurationMinutes("");
      setStartDate(undefined);
      setStartTime("12:00");
      setEndDate(undefined);
      setEndTime("12:00");
      setIsChangeFontTime(false);
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error?.data?.message || "Failed to send notice.",
      });
    }
  };

  const cancelScheduledNoticeHandler = async (noticeId: string) => {
    try {
      await cancelScheduledNotice({ id, noticeId }).unwrap();
      toast.success("Scheduled Notice Cancelled", {
        description: "The scheduled notice has been cancelled successfully.",
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Cancellation Failed", {
        description:
          error?.data?.message || "Failed to cancel scheduled notice.",
      });
    }
  };

  if (isLoading) {
    return <SmallLoading />;
  }

  if (error || !device) {
    return <DeviceNotFound />;
  }

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <Button
            onClick={() => router.push("/devices")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{device.name}</h1>
              <p className="text-muted-foreground mt-1">
                Device ID: {device.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {device.status === "online" ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <Badge
                variant={device.status === "online" ? "default" : "destructive"}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <p className="text-lg font-semibold capitalize">
                    {device.status}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Current Mode
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    {device.mode === "clock" ? (
                      <Clock className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Bell className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="font-semibold capitalize">
                      {device.mode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Location
                  </Label>
                  <p className="text-lg font-semibold">{device.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Uptime
                  </Label>
                  <p className="text-lg font-semibold">{device.uptime}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Current Font
                  </Label>
                  <p className="text-lg font-semibold">
                    {device.font || "Default Font"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Time Format
                  </Label>
                  <p className="text-sm font-semibold">
                    {device.time_format === "12h"
                      ? "12-Hour Format"
                      : "24-Hour Format"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Free Heap
                  </Label>
                  <p className="text-lg font-semibold">{device.free_heap}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Last Seen
                  </Label>
                  <p className="text-sm font-semibold">{device.last_seen}</p>
                </div>
              </div>

              {device.notice && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Label className="text-sm font-medium text-orange-800 dark:text-orange-400">
                    Current Notice
                  </Label>
                  <p className="text-orange-700 dark:text-orange-300 mt-1">
                    {device.notice}
                  </p>
                  {device.duration && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                      Duration: {device.duration} minutes
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Mode Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Device Mode Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Device Mode</Label>
                <Select
                  value={mode}
                  onValueChange={(value: "clock" | "notice") => setMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Device Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clock">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Clock Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="notice">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notice Mode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleModeSubmit}
                disabled={mode === device?.mode || !mode}
                className="w-full"
                variant="outline"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Mode
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notice Message Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notice Message Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notice">Notice Message</Label>
                <Textarea
                  id="notice"
                  placeholder="Enter notice message..."
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Duration Settings */}
              <div className="space-y-4">
                <Label>Display Duration</Label>
                <RadioGroup
                  value={durationType}
                  onValueChange={(
                    value: "unlimited" | "minutes" | "datetime"
                  ) => setDurationType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unlimited" id="unlimited" />
                    <Label htmlFor="unlimited">Unlimited Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minutes" id="minutes" />
                    <Label htmlFor="minutes">Duration in Minutes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="datetime" id="datetime" />
                    <Label htmlFor="datetime">Specific Date & Time Range</Label>
                  </div>
                </RadioGroup>

                {/* Minutes Input */}
                {durationType === "minutes" && (
                  <DurationMinutes
                    durationMinutes={durationMinutes}
                    setDurationMinutes={setDurationMinutes}
                  />
                )}

                {/* Date Time Range */}
                {durationType === "datetime" && (
                  <DatetimeRange
                    endDate={endDate}
                    setEndDate={setEndDate}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    startTime={startTime}
                    setStartTime={setStartTime}
                  />
                )}

                {durationType === "datetime" && startDate && endDate && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Duration:</strong> From {format(startDate, "PPP")}{" "}
                    at {startTime} to {format(endDate, "PPP")} at {endTime}
                  </div>
                )}
              </div>

              <Button
                onClick={handleNoticeSubmit}
                disabled={isUpdating || !notice.trim()}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending Notice...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          {/* Notice Message Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Font & Time Format Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notice">Select Font</Label>
                <Select value={device.font} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Settings */}
              <div className="space-y-4">
                <Label>Select Time Format</Label>
                <RadioGroup value={device.time_format} onValueChange={() => {}}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12h" id="12h" />
                    <Label htmlFor="12h">12-Hour Format</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="24h" />
                    <Label htmlFor="24h">24-Hour Format</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleNoticeSubmit}
                disabled={isChangeFontTime}
                className="w-full"
              >
                {isChangeFontTime ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating Font/Time Format...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Update Font/Time Format
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {/* Scheduled Notices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Scheduled Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
                <div className="min-w-[800px]">
                  {(schedules?.length ?? 0) > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            From
                          </TableHead>
                          <TableHead>To</TableHead>

                          <TableHead className="hidden md:table-cell">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules?.map((notice, index) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{index + 1}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>{notice.notice}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {format(new Date(notice.start_time), "PPPpp")}
                              {/* {format(
                            new Date(notice.start_time),
                            "yyyy-MM-dd hh:mm:ss a"
                          )} */}
                            </TableCell>
                            <TableCell>
                              {format(new Date(notice.end_time), "PPPpp")}
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                              <Trash
                                className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-600"
                                onClick={() =>
                                  cancelScheduledNoticeHandler(notice.id)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No Scheduled Notices
                      </h3>
                      <p className="text-muted-foreground">
                        There are currently no scheduled notices for this
                        device.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* allowed users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Allowed Users
                </div>
                <Button
                  variant="default"
                  className="text-sm"
                  onClick={() => setIsOpen(true)}
                >
                  Add Allowed User
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
                <div className="min-w-[800px]">
                  {(allowedUsers?.length ?? 0) > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Name
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>

                          <TableHead className="hidden md:table-cell">
                            Revoke Access
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allowedUsers?.map((user, index) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>{index + 1}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {user?.first_name} {user?.last_name}
                            </TableCell>
                            <TableCell>{user?.email}</TableCell>
                            <TableCell>{user?.role}</TableCell>

                            <TableCell
                              className="text-sm text-muted-foreground hidden md:table-cell"
                              // title="Remove User from Allowed List"
                            >
                              <button
                                disabled={user.role === "admin"}
                                onClick={() => handleRevokeAccess(user._id)}
                                className="disabled:text-red-200 disabled:cursor-default text-red-500 cursor-pointer hover:text-red-600"
                              >
                                <LogOut className="w-5 h-5 " />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No Allowed Users
                      </h3>
                      <p className="text-muted-foreground">
                        There are currently no users allowed to access this
                        device.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Add New Allowed User
            </DialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4">
            {withoutAccessUsers.length ? (
              withoutAccessUsers?.map((user) => (
                <div key={user._id} className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Select User
                  </Label>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={user._id}
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => handleUserToggle(user._id)}
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={user._id} className="cursor-pointer">
                        <div className="font-medium text-sm">
                          {user.first_name + " " + user.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Users Available</h3>
                <p className="text-muted-foreground">
                  There are no users available to add to this device.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  withoutAccessUsers.length === 0 || selectedUsers.length === 0
                }
                onClick={handleAddUserToDevice}
              >
                {isLoading ? (
                  <>
                    <KeyRound className="w-4 h-4 mr-2 animate-spin" />
                    Adding User...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Add User
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
