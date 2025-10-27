"use client";

import { logout } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socketManager } from "@/lib/socket";
import { useLogoutMutation, useProfileQuery } from "@/queries/auth";
import { useGetNotificationsQuery } from "@/queries/notifications";
import { Bell, LogOut, User, User2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import TimeDateShow from "../dashboard/time-date.show";
import { MobileDrawer } from "./layout/mobile-drawer";
import { ThemeToggle } from "./theme-toggle";

export function DashboardHeader() {
  const { data: user } = useProfileQuery();
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [clientLogout] = useLogoutMutation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    clientLogout();
    await logout();
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });

    const socket = socketManager.connect();
    if (socket) {
      socket.auth = {};
      socket.disconnect();
    }

    // router.push('/login');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <header className="bg-card/50 supports-backdrop-filter:bg-card/50 h-16 border-b backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Mobile Menu & Search */}
        <div className="flex max-w-md flex-1  items-center gap-4">
          <MobileDrawer />
          <div className="relative   w-full sm:block">
            <TimeDateShow />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 p-0 text-xs hover:bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3"
                >
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="text-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium capitalize">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User2 className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
