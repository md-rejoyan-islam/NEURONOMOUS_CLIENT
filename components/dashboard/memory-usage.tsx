'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetMemoryDetailsQuery } from '@/queries/system';
import { AlertTriangle, CheckCircle, Server } from 'lucide-react';

const MemoryUsage = () => {
  const { data: memoryDetails } = useGetMemoryDetailsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
        <Server className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {memoryDetails?.memoryUsagePercent}%
        </div>
        <Progress
          value={+(memoryDetails?.memoryUsagePercent || 0)}
          className="mt-2"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          {+(memoryDetails?.memoryUsagePercent || 0) < 70 ? (
            <span className="flex items-center gap-1 text-green-500">
              <CheckCircle className="h-3 w-3" /> Good
            </span>
          ) : (
            <span className="flex items-center gap-1 text-orange-500">
              <AlertTriangle className="h-3 w-3" /> High
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default MemoryUsage;
