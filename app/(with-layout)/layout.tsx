import { DashboardLayout } from '@/components/shared/layout/dashboard-layout';

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  console.log('Rendering Dashboard Layout');
  console.log('Rendering Dashboard Layout');

  return <DashboardLayout>{children}</DashboardLayout>;
}
