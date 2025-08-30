'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetCpuDetailsQuery } from '@/queries/system';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

const CpuUsage = () => {
  const { data: cpuDetails } = useGetCpuDetailsQuery(undefined, {
    pollingInterval: 30000, // Poll every 15 seconds
  });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
        <Activity className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{cpuDetails?.cpuUsagePercent}%</div>
        <Progress
          value={+(cpuDetails?.cpuUsagePercent || 0)}
          className="mt-2"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          {+(cpuDetails?.cpuUsagePercent || 0) < 50 ? (
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
  );
};

export default CpuUsage;
