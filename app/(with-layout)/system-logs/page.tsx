/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogFilterInput, logFilterSchema } from '@/lib/validations';
import { useExportLogsMutation, useGetSystemLogsQuery } from '@/queries/logs';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Info,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface LogFilters {
  level?: 'all' | 'error' | 'warning' | 'info' | 'success';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: 'timestamp' | 'level' | 'message';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const levelColors = {
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const levelIcons = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export default function SystemLogsPage() {
  const [filters, setFilters] = useState<LogFilters>({
    level: 'all',
    sortBy: 'timestamp',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const { data: logsData, isLoading, refetch } = useGetSystemLogsQuery(filters);

  console.log('Logs Data:', logsData);

  const [exportLogs, { isLoading: isExporting }] = useExportLogsMutation();

  const form = useForm<LogFilterInput>({
    resolver: zodResolver(logFilterSchema),
    defaultValues: filters,
  });

  const onFilterSubmit = (data: LogFilterInput) => {
    setFilters({ ...data, page: 1 });
  };

  const handleExport = async () => {
    try {
      const result = await exportLogs(filters).unwrap();
      toast('Export started', {
        description: 'Your logs export will be ready shortly.',
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again later.',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLevelIcon = (level: string) => {
    const Icon = levelIcons[level as keyof typeof levelIcons] || Info;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <AlertTriangle className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                System Logs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor system events and errors
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onFilterSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select
                  value={form.watch('level') || 'all'}
                  onValueChange={(value) =>
                    form.setValue('level', value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={form.watch('sortBy') || 'timestamp'}
                  onValueChange={(value) =>
                    form.setValue('sortBy', value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Timestamp</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={form.watch('sortOrder') || 'desc'}
                  onValueChange={(value) =>
                    form.setValue('sortOrder', value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-10"
                    {...form.register('search')}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="datetime-local" {...form.register('startDate')} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="datetime-local" {...form.register('endDate')} />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                {logsData
                  ? `Showing ${logsData.length} of ${logsData.length} logs`
                  : 'Loading logs...'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Loading logs...
            </div>
          ) : logsData?.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No logs found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {logsData?.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Badge className={levelColors[log.level]}>
                          <span className="flex items-center gap-1">
                            {getLevelIcon(log.level)}
                            {log.level.toUpperCase()}
                          </span>
                        </Badge>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Source: {log.source}
                        </span>
                      </div>
                      <p className="mb-1 text-sm font-medium">{log.message}</p>
                      {log.userId && (
                        <p className="text-xs text-gray-500">
                          User ID: {log.userId}
                        </p>
                      )}
                      {log.deviceId && (
                        <p className="text-xs text-gray-500">
                          Device ID: {log.deviceId}
                        </p>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getLevelIcon(log.level)}
                            Log Details
                          </DialogTitle>
                          <DialogDescription>
                            {formatTimestamp(log.timestamp)} - {log.source}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Level</Label>
                            <Badge className={`${levelColors[log.level]} mt-1`}>
                              {log.level.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Message
                            </Label>
                            <p className="mt-1 text-sm">{log.message}</p>
                          </div>
                          {log.details && (
                            <div>
                              <Label className="text-sm font-medium">
                                Details
                              </Label>
                              <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-3 text-xs dark:bg-gray-800">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.stackTrace && (
                            <div>
                              <Label className="text-sm font-medium">
                                Stack Trace
                              </Label>
                              <pre className="mt-1 overflow-x-auto rounded bg-red-50 p-3 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                {log.stackTrace}
                              </pre>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {/* {logsData && logsData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {logsData.page} of {logsData.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(logsData.page - 1)}
                  disabled={logsData.page === 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(logsData.page + 1)}
                  disabled={logsData.page === logsData.totalPages}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
