import { Settings, Wifi, WifiOff, XCircle } from "lucide-react";
import { toast } from "sonner";

export const dateTimeDurationValidation = ({
  durationType,
  durationMinutes,
  startDate,
  endDate,
  startTime,
  endTime,
}: {
  durationType: "unlimited" | "minutes" | "datetime";
  durationMinutes?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
}) => {
  if (durationType === "minutes") {
    if (
      !durationMinutes ||
      isNaN(Number(durationMinutes)) ||
      Number(durationMinutes) <= 0
    ) {
      toast.error("Validation Error", {
        description: "Please enter a valid duration in minutes.",
      });
      return false;
    }
  } else if (durationType === "datetime") {
    if (!startDate || !endDate) {
      toast.error("Validation Error", {
        description: "Please select start and end dates.",
      });
      return false;
    }
    const start = new Date(startDate).getDate();
    const end = new Date(endDate).getDate();

    if (start > end) {
      toast.error("Validation Error", {
        description: "End date must be after start date.",
      });
      return false;
    }
    if (!startTime || !endTime) {
      toast.error("Validation Error", {
        description: "Please select start and end times.",
      });
      return false;
    }

    if (startDate.getTime() === endDate.getTime()) {
      const startHour = parseInt(startTime.split(":")[0]);
      const startMinute = parseInt(startTime.split(":")[1]);
      const endHour = parseInt(endTime.split(":")[0]);
      const endMinute = parseInt(endTime.split(":")[1]);

      if (
        startHour > endHour ||
        (startHour === endHour && startMinute >= endMinute)
      ) {
        toast.error("Validation Error", {
          description: "End time must be after start time.",
        });
        return false;
      }
    }
  }
  return true;
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <Wifi className="h-4 w-4" />;
    case "offline":
      return <WifiOff className="h-4 w-4" />;
    case "maintenance":
      return <Settings className="h-4 w-4" />;
    default:
      return <XCircle className="h-4 w-4" />;
  }
};

export const getRoleColor = (role: "admin" | "superadmin" | "user") => {
  switch (role) {
    case "superadmin":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "admin":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    default:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  }
};

export const getRoleLabel = (role: "admin" | "superadmin" | "user") => {
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "banned":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
