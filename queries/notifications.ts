import { getApiUrl } from '@/lib/config';
import { Notification } from '@/lib/validations';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiUrl('NOTIFICATIONS'),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'success',
            title: 'Device Connected',
            message:
              'Device device-001 has successfully connected to the network',
            timestamp: new Date().toISOString(),
            read: false,
          },
          {
            id: '2',
            type: 'warning',
            title: 'High Memory Usage',
            message:
              'System memory usage has exceeded 80%. Consider optimizing resources.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
          },
          {
            id: '3',
            type: 'info',
            title: 'User Login',
            message: 'User john.doe@example.com logged in successfully',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
          },
          {
            id: '4',
            type: 'error',
            title: 'Device Offline',
            message: 'Device device-003 has gone offline unexpectedly',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            read: true,
          },
        ];

        return { data: mockNotifications };
      },
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<void, string>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: undefined };
      },
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<void, void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: undefined };
      },
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<void, string>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { data: undefined };
      },
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
