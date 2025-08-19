import DevicesComponent from '@/components/devices/devices-component';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devices Management',
  description: 'Manage your IoT devices efficiently',
};

const DevicesPage = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DevicesComponent />
    </div>
  );
};

export default DevicesPage;
