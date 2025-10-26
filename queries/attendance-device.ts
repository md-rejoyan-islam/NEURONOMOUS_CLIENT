import { IAttendanceDevice, IDevice } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const attendanceDevicesApi = createApi({
  reducerPath: 'attendacneDevicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  // keepUnusedDataFor: 0,
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({
    getAllAttendanceDevices: builder.query<
      IAttendanceDevice[],
      { query?: string }
    >({
      query: ({ query }) => ({
        url: `/attendance-devices?${query ? query : ''}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IAttendanceDevice[]>).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Attendance' as const, id })),
              'Attendance',
            ]
          : ['Attendance'],
    }),
    getAttendanceDeviceById: builder.query<IAttendanceDevice, { id: string }>({
      query: ({ id }) => ({
        url: `/attendance-devices/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IAttendanceDevice>).data,
      providesTags: (result, error, { id }) =>
        result ? [{ type: 'Attendance', id }] : ['Attendance'],
    }),
    // You can add more endpoints like create, update, delete if needed
    getDevices: builder.query<IDevice, { id: string }>({
      query: ({ id }) => ({
        url: `/clock-devices/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice>).data,
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAllAttendanceDevicesQuery,
  useGetAttendanceDeviceByIdQuery,
} = attendanceDevicesApi;
