'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IMemory } from '@/lib/types';

import { AlertTriangle, CheckCircle, Server } from 'lucide-react';

const MemoryUsage = ({ memory }: { memory: IMemory }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
        <Server className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{memory.memoryUsagePercent}%</div>
        <Progress value={+(memory.memoryUsagePercent || 0)} className="mt-2" />
        <p className="text-muted-foreground mt-2 text-xs">
          {+(memory.memoryUsagePercent || 0) < 70 ? (
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
