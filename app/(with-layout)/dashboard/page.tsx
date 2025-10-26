import Dashboard from '@/components/dashboard/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your IoT devices and system status',
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
