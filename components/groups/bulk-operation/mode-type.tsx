"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Clock } from "lucide-react";

const ModeType = ({
  mode,
  setMode,
}: {
  mode: "clock" | "notice";
  setMode: (mode: "clock" | "notice") => void;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="mode-select">Device Mode</Label>
      <Select
        value={mode}
        onValueChange={(value: "clock" | "notice") => setMode(value)}
      >
        <SelectTrigger>
          <SelectValue />
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
  );
};

export default ModeType;
