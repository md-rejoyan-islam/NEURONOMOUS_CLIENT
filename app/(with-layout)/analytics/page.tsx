"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, TrendingUp, Zap } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
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
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="bg-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Analytics Dashboard Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We{"'"}re building comprehensive analytics and reporting features
              to help you monitor your IoT system performance, device usage
              patterns, and user activity trends.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Device Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time performance data
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Usage Trends</h4>
                <p className="text-sm text-muted-foreground">
                  Historical usage patterns
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">System Health</h4>
                <p className="text-sm text-muted-foreground">
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
