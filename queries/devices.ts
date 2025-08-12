import { IDevice, IScheduledNotice, IUser } from "@/lib/types";
import { Device, DeviceUpdate } from "@/lib/validations";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const devicesApi = createApi({
  reducerPath: "devicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy",
    responseHandler: async (response) => {
      if (response.status === 301) {
        window.location.reload();
      }
      return response.json();
    },
  }),
  keepUnusedDataFor: 0,
  tagTypes: ["Device", "ScheduledNotice"],
  endpoints: (builder) => ({
    getAllDevices: builder.query<IDevice[], void>({
      query: () => ({
        url: "/devices",
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice[]>).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Device" as const, id })),
              "Device",
            ]
          : ["Device"],
    }),
    getDevices: builder.query<IDevice, { id: string }>({
      query: ({ id }) => ({
        url: `/devices/${id}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice>).data,
      providesTags: ["Device", "ScheduledNotice"],
    }),
    getDevice: builder.query<IDevice, { id: string }>({
      query: ({ id }) => ({
        url: `/devices/${id}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice>).data,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Device", id }] : ["Device"],
    }),
    updateDevice: builder.mutation<Device, { id: string; data: DeviceUpdate }>({
      queryFn: async ({ id, data }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const updatedDevice: Device = {
          id,
          name: `Smart Display - ${id}`,
          status: "online",
          last_seen: new Date().toISOString(),
          mode: data.mode,
          current_notice: data.notice || null,
          location: "Sample Location",
          uptime: Math.floor(Math.random() * 604800),
          free_heap: Math.floor(Math.random() * 50000) + 30000,
          duration: data.duration || null,
          font: data.font || "Roboto",
          time_format: data.time_format || "24h",
        };

        return { data: updatedDevice };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Device", id },
        "Device",
      ],
    }),
    sendNoticeToDevices: builder.mutation<
      void,
      { devices: string[]; message: string; duration?: number }
    >({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { data: undefined };
      },
      invalidatesTags: ["Device"],
    }),
    changeDeviceMode: builder.mutation<void, { id: string; mode: string }>({
      query: ({ id, mode }) => ({
        url: `/devices/${id}/change-mode`,
        method: "PATCH",
        body: { mode },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Device", id }],
    }),
    sendNoticeToDevice: builder.mutation<
      void,
      { id: string; notice: string; duration?: number }
    >({
      query: ({ id, notice, duration }) => ({
        url: `/devices/${id}/send-notice`,
        method: "PATCH",
        body: { notice, duration },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Device", id }],
    }),
    sendNoticeToSelectedDevices: builder.mutation<
      void,
      { deviceIds: string[]; notice: string; duration?: number }
    >({
      query: ({ deviceIds, notice, duration }) => ({
        url: `/devices/send-notice`,
        method: "PATCH",
        body: { deviceIds, notice, duration },
      }),
      invalidatesTags: (result, error, { deviceIds }) =>
        deviceIds.map((id) => ({ type: "Device", id })),
    }),
    sendScheduledNotice: builder.mutation<
      void,
      {
        id: string;
        notice: string;
        startTime: number;
        endTime: number;
      }
    >({
      query: ({ id, notice, startTime, endTime }) => ({
        url: `/devices/${id}/scheduled-notice`,
        method: "PATCH",
        body: { notice, startTime, endTime },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Device", id }],
    }),
    sendScheduledNoticeToSelectedDevices: builder.mutation<
      void,
      {
        deviceIds: string[];
        notice: string;
        startTime: number;
        endTime: number;
      }
    >({
      query: ({ deviceIds, notice, startTime, endTime }) => ({
        url: `/devices/scheduled-notice`,
        method: "PATCH",
        body: { deviceIds, notice, startTime, endTime },
      }),
      invalidatesTags: (result, error, { deviceIds }) =>
        deviceIds.map((id) => ({ type: "Device", id })),
    }),
    getAllScheduledNotices: builder.query<IScheduledNotice[], { id: string }>({
      query: ({ id }) => ({
        url: `/devices/${id}/scheduled-notices`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IScheduledNotice[]>).data,
      providesTags: (result, error, { id }) => [
        {
          type: "ScheduledNotice",
          id,
        },
      ],
    }),
    cancelScheduledNotice: builder.mutation<
      void,
      { id: string; noticeId: string }
    >({
      query: ({ id, noticeId }) => ({
        url: `/devices/${id}/scheduled-notices/${noticeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ScheduledNotice", id },
      ],
    }),
    getAllowedUsersForDevice: builder.query<IUser[], { id: string }>({
      query: ({ id }) => ({
        url: `/devices/${id}/allowed-users`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IUser[]>).data,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Device", id }] : ["Device"],
    }),
    // give device access to user by superadmin/admin
    giveDeviceAccessToUser: builder.mutation<
      void,
      { userIds: string[]; deviceId: string }
    >({
      query: ({ userIds, deviceId }) => ({
        url: `/devices/${deviceId}/give-device-access`,
        method: "POST",
        body: { userIds },
      }),
    }),
    revolkDeviceAccessFromUser: builder.mutation<
      void,
      { userId: string; deviceId: string }
    >({
      query: ({ userId, deviceId }) => ({
        url: `/devices/${deviceId}/revoke-device-access/${userId}`,
        method: "POST",
      }),
    }),
    changeSelectedDeviceMode: builder.mutation<
      void,
      { deviceIds: string[]; mode: "clock" | "notice" }
    >({
      query: ({ deviceIds, mode }) => ({
        url: `/devices/change-mode`,
        method: "PATCH",
        body: { mode, deviceIds },
      }),
      invalidatesTags: (result, error, { deviceIds }) =>
        deviceIds.map((id) => ({ type: "Device", id })),
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceQuery,
  useUpdateDeviceMutation,
  useSendNoticeToDevicesMutation,
  useGetAllowedUsersForDeviceQuery,
  useGetAllDevicesQuery,
  useChangeDeviceModeMutation,
  useSendNoticeToDeviceMutation,
  useSendScheduledNoticeMutation,
  useGetAllScheduledNoticesQuery,
  useCancelScheduledNoticeMutation,
  useGiveDeviceAccessToUserMutation,
  useRevolkDeviceAccessFromUserMutation,
  useChangeSelectedDeviceModeMutation,
  useSendNoticeToSelectedDevicesMutation,
  useSendScheduledNoticeToSelectedDevicesMutation,
} = devicesApi;
