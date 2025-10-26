import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
