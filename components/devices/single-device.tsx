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
import {
  useChangeDeviceModeMutation,
  useGetAllScheduledNoticesQuery,
  useGetDeviceQuery,
  useSendNoticeToDeviceMutation,
  useSendScheduledNoticeMutation,
  useUpdateDeviceMutation,
} from "@/queries/devices";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Clock,
  RefreshCw,
  Save,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DatetimeRange from "../groups/bulk-operation/datetime-range";
import DurationMinutes from "../groups/bulk-operation/duration-minutes";
import SmallLoading from "../loading/small-loading";

export default function SingleDevice({ id }: { id: string }) {
  const router = useRouter();

  const { data: device, isLoading, error } = useGetDeviceQuery({ id });

  const [updateDevice, { isLoading: isUpdating }] = useUpdateDeviceMutation();
  const { data: schedules, refetch } = useGetAllScheduledNoticesQuery({ id });
  console.log(schedules);

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

    let duration: number | undefined;

    // if (durationType === "datetime" && startDate && endDate) {
    //   const start = new Date(startDate);
    //   const [startHours, startMinutes] = startTime.split(":").map(Number);
    //   start.setHours(startHours, startMinutes, 0, 0);

    //   const end = new Date(endDate);
    //   const [endHours, endMinutes] = endTime.split(":").map(Number);
    //   end.setHours(endHours, endMinutes, 0, 0);

    //   duration = Math.floor((end.getTime() - start.getTime()) / 1000);

    //   if (duration <= 0) {
    //     toast.error("Validation Error", {
    //       description: "End date/time must be after start date/time.",
    //     });
    //     return;
    //   }
    // }

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

      // await sendNotice({
      //   id,
      //   notice,
      //   duration,
      // }).unwrap();

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

  if (isLoading) {
    return <SmallLoading />;
  }

  if (error || !device) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Device not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested device could not be found.
          </p>
          <Button onClick={() => router.push("/devices")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </div>
      </div>
    );
  }

  return (
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
            <p className="text-muted-foreground mt-1">Device ID: {device.id}</p>
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
                    Duration: {Math.floor(device.duration / 60)} minutes
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
              disabled={isUpdating || mode === device?.mode || !mode}
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
                onValueChange={(value: "unlimited" | "minutes" | "datetime") =>
                  setDurationType(value)
                }
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
                  <strong>Duration:</strong> From {format(startDate, "PPP")} at{" "}
                  {startTime} to {format(endDate, "PPP")} at {endTime}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Scheduled Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules && schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 bg-muted/50 rounded-lg border border-muted"
                  >
                    <h4 className="font-medium">{notice.notice}</h4>
                    <p className="text-sm text-muted-foreground">
                      Scheduled from
                      {format(new Date(notice.start_time), "PPPpp")}
                      {" to "}
                      {format(new Date(notice.end_time), "PPPpp")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Scheduled Notices
                </h3>
                <p className="text-muted-foreground">
                  There are currently no scheduled notices for this device.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
