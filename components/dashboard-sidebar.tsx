"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfileQuery } from "@/queries/auth";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  TabletsIcon as Devices,
  FileText,
  Group,
  Home,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: SidebarProps) {
  const { data: user } = useProfileQuery();

  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      roles: ["superadmin", "admin", "user"],
    },
    {
      name: "Groups",
      href: "/groups",
      icon: Group,
      roles: ["superadmin"],
    },
    {
      name: "Devices",
      href: "/devices",
      icon: Devices,
      roles: ["superadmin", "admin", "user"],
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["superadmin", "admin"],
    },
    {
      name: "Create User",
      href: "/create-user",
      icon: UserCheck,
      roles: ["superadmin"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      roles: ["superadmin", "admin", "user"],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["superadmin", "admin"],
    },

    {
      name: "Activity Logs",
      href: "/user-activity",
      icon: Activity,
      roles: ["superadmin"],
    },
    {
      name: "System Logs",
      href: "/system-logs",
      icon: FileText,
      roles: ["superadmin"],
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      roles: ["superadmin", "admin", "user"],
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  if (!user) return null;

  return (
    <div
      className={cn(
        "relative hidden md:flex flex-col h-full bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/" className="block">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">IoT Hub</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "px-2",
                  isActive(item.href) &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                  collapsed && "w-10"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.first_name[0]}
              {user.last_name[0]}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.first_name} {user.last_name}
              </p>
              <Badge variant="outline" className="text-xs">
                {user.role === "superadmin" ? "Super Admin" : user.role}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
