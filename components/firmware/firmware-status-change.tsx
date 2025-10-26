import { Switch } from "@/components/ui/switch";
import { useFirmwareStatusChangeMutation } from "@/queries/firmware";
import { toast } from "sonner";

const FirmwareStatusChange = ({
  status,
  id,
}: {
  status: "active" | "inactive";
  id: string;
}) => {
  const [statusChange, { isLoading }] = useFirmwareStatusChangeMutation();

  const handleStatusChange = async () => {
    try {
      await statusChange({
        id,
        status: status === "active" ? "inactive" : "active",
      }).unwrap();

      toast.success("Status changed.", {
        description: `Firmware ${id} status has been changed to ${status === "active" ? "inactive" : "active"}.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Download failed", {
        description:
          error?.data?.message || "Failed to change status. Please try again.",
      });
    }
  };

  return (
    <div>
      <Switch
        className="before:width-9 cursor-pointer before:mt-2!"
        checked={status === "active"}
        onClick={handleStatusChange}
        disabled={isLoading}
      />
    </div>
  );
};

export default FirmwareStatusChange;
