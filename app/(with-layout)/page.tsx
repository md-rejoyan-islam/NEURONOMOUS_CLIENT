'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  useGetRecentActivityQuery,
  useGetSystemMetricsQuery,
} from '@/queries/analytics';
import { useProfileQuery } from '@/queries/auth';
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Server,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: user } = useProfileQuery();

  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useGetSystemMetricsQuery();
  const {
    data: recentActivity = [],
    isLoading: activityLoading,
    refetch: refetchActivity,
  } = useGetRecentActivityQuery();

  // useEffect(() => {
  //   // Connect to socket for real-time updates (optional)
  //   const socket = socketManager.connect();

  //   if (socket && socketManager.isConnected()) {
  //     // Listen for system metrics updates
  //     socket.on("metrics:updated", (updatedMetrics) => {
  //       console.log("Metrics updated via socket:", updatedMetrics);
  //       refetchMetrics();
  //     });

  //     // Listen for new activity
  //     socket.on("activity:new", (newActivity) => {
  //       console.log("New activity via socket:", newActivity);
  //       refetchActivity();
  //     });

  //     return () => {
  //       socket.off("metrics:updated");
  //       socket.off("activity:new");
  //     };
  //   } else {
  //     console.log("Running in offline mode - real-time updates disabled");
  //   }
  // }, [refetchMetrics, refetchActivity]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'device_control':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'user_created':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'notice_sent':
        return <Bell className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (metricsLoading || activityLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (metricsError || !metrics) {
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
            Welcome back, {user?.first_name + ' ' + user?.last_name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here{"'"}s what{"'"}s happening with your IoT system today.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl sm:text-2xl">
            {/* {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })} */}
          </div>
          <div className="text-muted-foreground text-sm">
            {/* {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })} */}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
            <p className="text-muted-foreground mt-2 text-xs">
              {metrics.cpuUsage < 50 ? (
                <span className="flex items-center gap-1 text-green-500">
                  <TrendingDown className="h-3 w-3" /> Normal
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-500">
                  <TrendingUp className="h-3 w-3" /> Elevated
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
            <p className="text-muted-foreground mt-2 text-xs">
              {metrics.memoryUsage < 70 ? (
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="h-3 w-3" /> Good
                </span>
              ) : (
                <span className="flex items-center gap-1 text-orange-500">
                  <AlertTriangle className="h-3 w-3" /> High
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Devices
            </CardTitle>
            <Wifi className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeDevices}/{metrics.totalDevices}
            </div>
            <Progress
              value={(metrics.activeDevices / metrics.totalDevices) * 100}
              className="mt-2"
            />
            <p className="text-muted-foreground mt-2 text-xs">
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-3 w-3" /> {metrics.activeDevices}{' '}
                online
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeUsers}/{metrics.totalUsers}
            </div>
            <Progress
              value={(metrics.activeUsers / metrics.totalUsers) * 100}
              className="mt-2"
            />
            <p className="text-muted-foreground mt-2 text-xs">
              <span className="flex items-center gap-1 text-blue-500">
                <Users className="h-3 w-3" /> {metrics.activeUsers} online
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    {getActivityIcon(activity.type)}
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-sm font-medium">
                        {activity.message}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="truncate">{activity.user}</span>
                        <span>•</span>
                        <span>{formatTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Protocol</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Firewall</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Protected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Backup</span>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Scheduled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Updates</span>
                <Badge variant="outline">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
