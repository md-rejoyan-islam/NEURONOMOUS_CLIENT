'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, TrendingUp, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <BarChart3 className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor system performance and usage metrics
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <div className="bg-primary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full p-6">
              <BarChart3 className="text-primary h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Analytics Dashboard Coming Soon
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              We{"'"}re building comprehensive analytics and reporting features
              to help you monitor your IoT system performance, device usage
              patterns, and user activity trends.
            </p>
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Activity className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">Device Metrics</h4>
                <p className="text-muted-foreground text-sm">
                  Real-time performance data
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <TrendingUp className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">Usage Trends</h4>
                <p className="text-muted-foreground text-sm">
                  Historical usage patterns
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Zap className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">System Health</h4>
                <p className="text-muted-foreground text-sm">
                  Overall system status
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
