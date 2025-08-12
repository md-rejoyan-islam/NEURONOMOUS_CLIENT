"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { socketManager } from "@/lib/socket";
import {
  useGetRecentActivityQuery,
  useGetSystemMetricsQuery,
} from "@/queries/analytics";
import { useProfileQuery } from "@/queries/auth";
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
} from "lucide-react";
import { useEffect } from "react";

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

  useEffect(() => {
    // Connect to socket for real-time updates (optional)
    const socket = socketManager.connect();

    if (socket && socketManager.isConnected()) {
      // Listen for system metrics updates
      socket.on("metrics:updated", (updatedMetrics) => {
        console.log("Metrics updated via socket:", updatedMetrics);
        refetchMetrics();
      });

      // Listen for new activity
      socket.on("activity:new", (newActivity) => {
        console.log("New activity via socket:", newActivity);
        refetchActivity();
      });

      return () => {
        socket.off("metrics:updated");
        socket.off("activity:new");
      };
    } else {
      console.log("Running in offline mode - real-time updates disabled");
    }
  }, [refetchMetrics, refetchActivity]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <Shield className="w-4 h-4 text-green-500" />;
      case "device_control":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "user_created":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "notice_sent":
        return <Bell className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (metricsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (metricsError || !metrics) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.first_name + " " + user?.last_name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here{"'"}s what{"'"}s happening with your IoT system today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-mono">
            {/* {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })} */}
          </div>
          <div className="text-sm text-muted-foreground">
            {/* {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })} */}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.cpuUsage < 50 ? (
                <span className="text-green-500 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Normal
                </span>
              ) : (
                <span className="text-yellow-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Elevated
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.memoryUsage < 70 ? (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Good
                </span>
              ) : (
                <span className="text-orange-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> High
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
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeDevices}/{metrics.totalDevices}
            </div>
            <Progress
              value={(metrics.activeDevices / metrics.totalDevices) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {metrics.activeDevices}{" "}
                online
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeUsers}/{metrics.totalUsers}
            </div>
            <Progress
              value={(metrics.activeUsers / metrics.totalUsers) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-blue-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {metrics.activeUsers} online
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{activity.user}</span>
                        <span>•</span>
                        <span>{formatTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
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
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Firewall</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Backup</span>
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  Scheduled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Updates</span>
                <Badge variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
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
