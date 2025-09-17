import Firmware from '@/components/firmware/firmware';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Firmware Management',
  description: 'Manage and update firmware for your IoT devices',
};

const FirmwarePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}) => {
  const { page, limit } = await searchParams;

  return (
    <section className="space-y-6 p-2 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold">Firmware Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage firmware versions for devices
        </p>
      </div>
      <Firmware page={+(page || 1)} limit={+(limit || 10)} />
    </section>
  );
};

export default FirmwarePage;
