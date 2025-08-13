import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const DeviceNotFound = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Device not found</h3>
        <p className="text-muted-foreground mb-4">
          The requested device could not be found.
        </p>
        <Link href={"/devices"}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DeviceNotFound;
