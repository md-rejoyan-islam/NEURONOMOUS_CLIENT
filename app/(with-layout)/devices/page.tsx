import DevicesComponent from "@/components/devices/devices-component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devices Management",
  description: "Manage your IoT devices efficiently",
};

const DevicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    status?: string;
    search?: string;
    type?: string;
    deviceType?: "clock" | "attendance";
  }>;
}) => {
  const { mode, status, search, type, deviceType } = await searchParams;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DevicesComponent
        query={{ mode, status, search, type }}
        dType={deviceType}
      />
    </div>
  );
};

export default DevicesPage;
