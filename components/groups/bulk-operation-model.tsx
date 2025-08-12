"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IDevice } from "@/lib/types";
import { format } from "date-fns";
import { Send, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeviceSelect from "./bulk-operation/device-select";
import ModeType from "./bulk-operation/mode-type";
import NoticeType from "./bulk-operation/notice-type";

const BulkOperationModel = ({ devices }: { devices: IDevice[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [operation, setOperation] = useState<"mode" | "notice">("notice");
  const [mode, setMode] = useState<"clock" | "notice">("clock");
  const [message, setMessage] = useState("");
  const [durationType, setDurationType] = useState<
    "unlimited" | "minutes" | "datetime"
  >("unlimited");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("12:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("12:00");
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
    setOperation("notice");
    setMode("clock");
    setMessage("");
    setDurationType("unlimited");
    setDurationMinutes("");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("12:00");
    setEndTime("12:00");
    setProcessing(false);
  };

  const handleSubmit = async () => {
    if (selectedDevices.length === 0) {
      return toast.error("Validation Error", {
        description: "Please select at least one device.",
      });
    }

    if (operation === "notice") {
      // Validate based on operation type
      if (!message.trim()) {
        return toast.error("Validation Error", {
          description: "Please enter a notice message.",
        });
      }
      // Validate duration settings
      else if (durationType === "minutes" && !durationMinutes) {
        return toast.error("Validation Error", {
          description: "Please enter duration in minutes.",
        });
      }

      // Validate start and end dates
      else if (durationType === "datetime" && (!startDate || !endDate)) {
        toast.error("Validation Error", {
          description: "Please select start and end dates.",
        });
        return;
      }
      // Validate start and end time
      else if (durationType === "datetime" && startDate && endDate) {
        const start = new Date(startDate).getDate();
        const end = new Date(endDate).getDate();

        if (start > end) {
          return toast.error("Validation Error", {
            description: "End date must be after start date.",
          });
        }
      }

      //  if start date and end date are same , then validae start time and end time
      else if (
        durationType === "datetime" &&
        startDate &&
        endDate &&
        startDate.getTime() === endDate.getTime()
      ) {
        const startHour = parseInt(startTime.split(":")[0]);
        const startMinute = parseInt(startTime.split(":")[1]);
        const endHour = parseInt(endTime.split(":")[0]);
        const endMinute = parseInt(endTime.split(":")[1]);

        if (
          startHour > endHour ||
          (startHour === endHour && startMinute >= endMinute)
        ) {
          return toast.error("Validation Error", {
            description: "End time must be after start time.",
          });
        }
      }
    }

    setProcessing(true);

    // Mesage to be sent
    let description = "";
    if (operation === "mode") {
      description = `Changed mode to ${mode} for ${selectedDevices.length} device(s).`;
    } else {
      let durationText = "unlimited time";
      if (durationType === "minutes" && durationMinutes) {
        durationText = `${durationMinutes} minutes`;
      } else if (durationType === "datetime" && startDate && endDate) {
        durationText = `from ${format(startDate, "PPP")} to ${format(
          endDate,
          "PPP"
        )}`;
      }
      description = `Notice sent to ${selectedDevices.length} device(s) for ${durationText}.`;
    }

    // API call to perform the operation
    toast.success("Operation Successful", {
      description,
    });

    // Reset form
    setSelectedDevices([]);
    setOperation("notice");
    setMode("clock");
    setMessage("");
    setDurationType("unlimited");
    setDurationMinutes("");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("12:00");
    setEndTime("12:00");
    setProcessing(false);
    onClose();
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Settings className="w-4 h-4 mr-2" />
        Bulk Operations
      </Button>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Bulk Device Operations
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Operation Type */}
            <div className="space-y-3">
              <Label>Operation Type</Label>
              <RadioGroup
                value={operation}
                onValueChange={(value: "mode" | "notice") =>
                  setOperation(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mode" id="mode" />
                  <Label htmlFor="mode" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Change Device Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notice" id="notice" />
                  <Label htmlFor="notice" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Notice Message
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Mode Selection (only for mode operation) */}
            {operation === "mode" && <ModeType mode={mode} setMode={setMode} />}

            {/* Notice Message (only for notice operation) */}
            {operation === "notice" && (
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
                onClick={handleSubmit}
                disabled={processing}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {operation === "mode" ? (
                      <Settings className="w-4 h-4 mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {operation === "mode" ? "Change Mode" : "Send Notice"}
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
