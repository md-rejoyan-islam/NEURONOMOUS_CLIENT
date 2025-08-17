"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Bell,
  TabletsIcon as Devices,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function MobileDrawer({ user }: { user?: IUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      roles: ["superadmin", "admin", "user"],
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
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["superadmin", "admin"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      roles: ["superadmin", "admin", "user"],
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
      name: "Create User",
      href: "/create-user",
      icon: UserCheck,
      roles: ["superadmin"],
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    setOpen(false);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="pb-0 ">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            IoT Hub
          </SheetTitle>
        </SheetHeader>

        <div className="mt-0 px-1 overflow-scroll pb-4  space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 py-2 px-2 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                {user.role === "superadmin" ? "Super Admin" : user.role}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <div className=" ">
            <h3 className="text-sm font-semibold px-2 mb-3">Navigation</h3>
            <div className="space-y-1  overflow-y-scroll">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile & Logout */}
          <div className="border-t pt-4">
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors mb-2",
                isActive("/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setOpen(false)}
            >
              <Settings className="w-5 h-5" />
              Profile Settings
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
