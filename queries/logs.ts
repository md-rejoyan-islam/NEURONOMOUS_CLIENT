/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'success';
  message: string;
  source: string;
  userId?: string;
  deviceId?: string;
  details?: Record<string, any>;
  stackTrace?: string;
}

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

export interface LogsResponse {
  logs: SystemLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ILog {
  data: {
    _id: string;
    timestamp: string;
    level: 'error' | 'warning' | 'info' | 'success';
    message: string;
    metadata: {
      status: number;
      timestamp: string;
      label?: string;
      stack?: string;
    };
  }[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export const logsApi = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  tagTypes: ['SystemLog'],
  endpoints: (builder) => ({
    getSystemLogs: builder.query<SystemLog[], LogFilters>({
      queryFn: async (filters) => {
        // Simulate an API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Return mock data
        return {
          data: [
            {
              id: '1',
              timestamp: new Date().toISOString(),
              level: 'info',
              message: 'System started',
              source: 'system',
            },
            {
              id: '2',
              timestamp: new Date().toISOString(),
              level: 'error',
              message: 'Error occurred',
              source: 'application',
            },
            {
              id: '3',
              timestamp: new Date().toISOString(),
              level: 'warning',
              message: 'Low disk space',
              source: 'system',
            },
          ],
        };
      },

      // Only use query for RTK Query, not queryFn
      //   query: (filters) => ({
      //     url: '/logs/system',
      //         params: filters,

      //   }),
      //   providesTags: ['SystemLog'],
      //   transformResponse: () => [
      //     {
      //       id: '1',
      //       timestamp: new Date().toISOString(),
      //       level: 'info',
      //       message: 'System started',
      //       source: 'system',
      //     },
      //     {
      //       id: '2',
      //       timestamp: new Date().toISOString(),
      //       level: 'error',
      //       message: 'Error occurred',
      //       source: 'application',
      //     },
      //     {
      //       id: '3',
      //       timestamp: new Date().toISOString(),
      //       level: 'warning',
      //       message: 'Low disk space',
      //       source: 'system',
      //     },
      //   ],
    }),
    getAllLogs: builder.query<ILog, LogFilters>({
      query: (filters) => ({
        url: '/logs',
        params: filters,
      }),

      providesTags: ['SystemLog'],
    }),
    // getSystemLogs: builder.query<LogsResponse, LogFilters>({
    //   // Only use query for RTK Query, not queryFn
    //   query: (filters) => ({
    //     url: '/logs/system',
    //     params: filters,
    //   }),
    //   providesTags: ['SystemLog'],
    // }),
    exportLogs: builder.mutation<{ url: string }, LogFilters>({
      query: (filters) => ({
        url: '/logs/export',
        method: 'POST',
        body: filters,
      }),
    }),
  }),
});

export const {
  useGetSystemLogsQuery,
  useExportLogsMutation,
  useGetAllLogsQuery,
} = logsApi;
