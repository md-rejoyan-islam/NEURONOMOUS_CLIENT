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
