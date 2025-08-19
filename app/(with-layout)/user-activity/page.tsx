'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Users } from 'lucide-react';

export default function UserActivityPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Activity className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
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
            <Clock className="text-primary h-5 w-5" />
            Activity Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="bg-primary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full p-6">
              <Activity className="text-primary h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              User Activity Logs Coming Soon
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              We{"'"}re developing comprehensive user activity tracking to
              monitor all user interactions, login sessions, device controls,
              and administrative actions for enhanced security and auditing.
            </p>
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Users className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">User Sessions</h4>
                <p className="text-muted-foreground text-sm">
                  Login and logout tracking
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Activity className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">Device Actions</h4>
                <p className="text-muted-foreground text-sm">
                  Device control history
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Clock className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">Audit Trail</h4>
                <p className="text-muted-foreground text-sm">
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
