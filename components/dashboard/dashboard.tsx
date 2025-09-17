'use client';
import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import ActiveClockDevice from '@/components/dashboard/active-clock-device';
import ActiveUsers from '@/components/dashboard/active-users';
import CpuUsage from '@/components/dashboard/cpu-usage';
import MemoryUsage from '@/components/dashboard/memory-usage';
import TimeDateShow from '@/components/dashboard/time-date.show';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useDownloadAttendancesSummaryMutation,
  useDownloadClocksSummaryMutation,
  useDownloadStudentsSummaryMutation,
  useGetDashboardPageSummaryQuery,
} from '@/queries/summary';
import {
  AlertTriangle,
  ArrowDown,
  Calculator,
  Clock9,
  Component,
  User,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import TableSkeleton from '../loading/table-skeleton';

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboardPageSummaryQuery(
    undefined,
    {
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );

  const [downloadStudentsSummary] = useDownloadStudentsSummaryMutation();
  const [downloadClocksSummary] = useDownloadClocksSummaryMutation();
  const [downloadattendancesSummary] = useDownloadAttendancesSummaryMutation();

  const handleDownloadStudent = async () => {
    try {
      await downloadStudentsSummary().unwrap();

      toast.success('Download successful', {
        description: `Students summary has been downloaded.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Download failed', {
        description:
          error?.data?.message ||
          'Failed to download students summary. Please try again.',
      });
    }
  };
  const handleDownloadClocks = async () => {
    try {
      await downloadClocksSummary().unwrap();
      toast.success('Download successful', {
        description: `Clock devices summary has been downloaded.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Download failed', {
        description:
          error?.data?.message ||
          'Failed to download clock devices summary. Please try again.',
      });
    }
  };
  const handleDownloadAttendance = async () => {
    try {
      await downloadattendancesSummary().unwrap();

      toast.success('Download successful', {
        description: `Attendance devices summary has been downloaded.`,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Download failed', {
        description:
          error?.data?.message ||
          'Failed to download attendance devices summary. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <TableSkeleton />;
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="py-12 text-center">
          <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-medium">
            Failed to load dashboard data
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, {data?.first_name + ' ' + data?.last_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here{"'"}s what{"'"}s happening with your IoT system today.
          </p>
        </div>
        <TimeDateShow />
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {data?.role === 'superadmin' && data?.cpu && (
          <CpuUsage cpu={data?.cpu} />
        )}
        {data?.role === 'superadmin' && data?.memory && (
          <MemoryUsage memory={data?.memory} />
        )}

        <ActiveClockDevice />
        {data?.role !== 'user' && <ActiveUsers />}

        <SimpleSummaryCard
          label="Total Clocks Devices"
          value={data?.totalClockDevices || 0}
          icon={<Clock9 className="text-primary h-6 w-6" />}
          valueColor="text-primary"
        />
        <SimpleSummaryCard
          label="Total Attendance Devices"
          value={data?.totalAttendanceDevices || 0}
          icon={<Calculator className="text-primary h-6 w-6" />}
          valueColor="text-primary"
        />

        {data?.role === 'superadmin' && (
          <SimpleSummaryCard
            label="Total Groups"
            value={data?.totalGroups || 0}
            icon={<Component className="text-primary h-6 w-6" />}
            valueColor="text-primary"
          />
        )}

        {data?.role !== 'user' && (
          <SimpleSummaryCard
            label="Total Users"
            value={data?.totalUsers || 0}
            icon={<Users className="text-primary h-6 w-6" />}
            valueColor="text-primary"
          />
        )}
        {data?.role !== 'user' && (
          <SimpleSummaryCard
            label="Total Students"
            value={data?.totalStudents || 0}
            icon={<User className="text-primary h-6 w-6" />}
            valueColor="text-primary"
          />
        )}
        {/* <SimpleSummaryCard
          label="Attendance Performance"
          value={70 + '%'}
          icon={<Sigma className="text-primary h-6 w-6" />}
          valueColor="text-primary"
        /> */}

        {/* summary download options for superadmin ( clock devices, attendance devices, users, groups ) */}
      </div>

      <hr />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-primary pb-2 font-medium">
              Clock Devices Report
            </p>

            <p className="text-muted-foreground mb-4 text-xs">
              Download a summary report of all registered clock devices.
            </p>
            <Button variant={'outline'} onClick={handleDownloadClocks}>
              <ArrowDown className="text-primary animate-bounce" />
              Download
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-primary pb-2 font-medium">
              Attendance Devices Report
            </p>

            <p className="text-muted-foreground mb-4 text-xs">
              Download a summary report of all registered attendance devices.
            </p>
            <Button variant={'outline'} onClick={handleDownloadAttendance}>
              <ArrowDown className="text-primary animate-bounce" />
              Download
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-primary pb-2 font-medium">Students Report</p>

            <p className="text-muted-foreground mb-4 text-xs">
              Download a summary report of all registered students.
            </p>
            <Button variant={'outline'} onClick={handleDownloadStudent}>
              <ArrowDown className="text-primary animate-bounce" />
              Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
