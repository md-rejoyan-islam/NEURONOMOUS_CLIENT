import { getDeviceById } from "@/app/actions";
import SingleDevice from "@/components/devices/single-device";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const data = await getDeviceById(id);

    return {
      title: data.name || data.id,
      description: data.description || "Details of the device",
    };
  } catch {
    return {
      title: "Device Not Found",
      description: "The requested device does not exist.",
    };
  }
};

const SingleDevicePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <SingleDevice id={id} />;
};

export default SingleDevicePage;
