'use client';

import { useProfileQuery } from '@/queries/auth';
import { useGetAllDevicesQuery } from '@/queries/devices';
import { TabletsIcon as Devices } from 'lucide-react';
import SimpleSummaryCard from '../cards/simple-summary-card';

const TotalDevices = () => {
  const { data: user } = useProfileQuery();
  const { data: devices = [] } = useGetAllDevicesQuery();
  return (
    <>
      {user?.role !== 'user' && (
        <SimpleSummaryCard
          label="Total Devices"
          value={devices.length}
          icon={
            <Devices className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          valueColor="text-blue-600 dark:text-blue-400"
        />
      )}
    </>
  );
};

export default TotalDevices;
