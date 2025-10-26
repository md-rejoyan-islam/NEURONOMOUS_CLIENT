"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, CheckCircle, Info, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "Device Connected",
        message: "Device device-001 has successfully connected to the network",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "warning",
        title: "High Memory Usage",
        message:
          "System memory usage has exceeded 80%. Consider optimizing resources.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: "3",
        type: "info",
        title: "User Login",
        message: "User john.doe@example.com logged in successfully",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
      },
      {
        id: "4",
        type: "error",
        title: "Device Offline",
        message: "Device device-003 has gone offline unexpectedly",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        read: true,
      },
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Bell className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Notifications Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with system alerts and activities
          </p>
        </div>
        <Button
          onClick={markAllAsRead}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total
                </p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Unread
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {notifications.filter((n) => !n.read).length}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Warnings
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter((n) => n.type === "warning").length}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Errors
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {notifications.filter((n) => n.type === "error").length}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="text-primary h-5 w-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 transition-colors ${
                  notification.read
                    ? "bg-muted/30 border-border"
                    : "bg-card border-primary/20 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium">
                          {notification.title}
                        </h4>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getNotificationBadge(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">
                You{"'"}re all caught up! No new notifications to show.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
