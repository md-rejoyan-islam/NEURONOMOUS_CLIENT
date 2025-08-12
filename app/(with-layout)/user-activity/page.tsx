"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Users } from "lucide-react";

export default function UserActivityPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          User Activity Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          Track user actions and system interactions
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="bg-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Activity className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              User Activity Logs Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We{"'"}re developing comprehensive user activity tracking to
              monitor all user interactions, login sessions, device controls,
              and administrative actions for enhanced security and auditing.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">User Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Login and logout tracking
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Device Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Device control history
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Audit Trail</h4>
                <p className="text-sm text-muted-foreground">
                  Complete action timeline
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
