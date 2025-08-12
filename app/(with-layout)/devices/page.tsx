import DevicesComponent from "@/components/devices/devices-component";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devices Management",
  description: "Manage your IoT devices efficiently",
};

const DevicesPage = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <DevicesComponent />
    </div>
  );
};

export default DevicesPage;
