import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Firmware {
  _id: string;
  version: number;
  type: 'single' | 'double';
  file: Buffer;
  description: string;
}
export interface FirmwareCreateInput {
  version: number;
  type: 'single' | 'double';
  file: Buffer;
  description: string;
}

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface IDashboardSummary {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  totalClockDevices: number;
  totalAttendanceDevices: number;
  totalUsers?: number;
  totalStudents?: number;
  totalGroups?: number;
  users?: string[];
}

interface IGroupSummary {
  totalGroups: number;
  clocksUsed: number;
  attendanceUsed: number;
  totalUsers: number;
}

export const summaryApi = createApi({
  reducerPath: 'summaryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  // keepUnusedDataFor: 0, // Data will be kept in the cache for 0 seconds
  tagTypes: ['Summary'],
  endpoints: (builder) => ({
    getDashboardPageSummary: builder.query<IDashboardSummary, void>({
      query: () => ({
        url: '/summary/dashboard',
        method: 'GET',
      }),
      transformResponse: (response: ISuccessResponse<IDashboardSummary>) =>
        response.data,
      providesTags: ['Summary'],
    }),
    downloadClocksSummary: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `/summary/download/clock-devices`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'clock_devices_summary.csv';
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      extraOptions: { skipCache: true },
    }),
    downloadAttendancesSummary: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `/summary/download/attendance-devices`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'attendance_devices_summary.csv';
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      extraOptions: { skipCache: true },
    }),
    downloadStudentsSummary: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `/summary/download/students`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'students_summary.csv';
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      extraOptions: { skipCache: true },
    }),
    getAllGroupSummaries: builder.query<IGroupSummary, void>({
      query: () => ({
        url: '/summary/all-groups',
        method: 'GET',
      }),
      transformResponse: (response: ISuccessResponse<IGroupSummary>) =>
        response.data,
      providesTags: ['Summary'],
    }),
  }),
});

export const {
  useGetDashboardPageSummaryQuery,
  useDownloadClocksSummaryMutation,
  useDownloadAttendancesSummaryMutation,
  useDownloadStudentsSummaryMutation,
  useGetAllGroupSummariesQuery,
} = summaryApi;
