import { analyticsApi } from '@/queries/analytics';
import { attendanceDevicesApi } from '@/queries/attendance-device';
import { authApi } from '@/queries/auth';
import { contactApi } from '@/queries/contact';
import { courseApi } from '@/queries/course';
import { devicesApi } from '@/queries/devices';
import { firmwareApi } from '@/queries/firmware';
import { groupApi } from '@/queries/group';
import { logsApi } from '@/queries/logs';
import { notificationsApi } from '@/queries/notifications';
import { openApi } from '@/queries/open';
import { systemApi } from '@/queries/system';
import { usersApi } from '@/queries/users';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [devicesApi.reducerPath]: devicesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [firmwareApi.reducerPath]: firmwareApi.reducer,
    [systemApi.reducerPath]: systemApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [logsApi.reducerPath]: logsApi.reducer,
    [attendanceDevicesApi.reducerPath]: attendanceDevicesApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [openApi.reducerPath]: openApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      devicesApi.middleware,
      usersApi.middleware,
      notificationsApi.middleware,
      analyticsApi.middleware,
      authApi.middleware,
      groupApi.middleware,
      firmwareApi.middleware,
      systemApi.middleware,
      contactApi.middleware,
      logsApi.middleware,
      attendanceDevicesApi.middleware,
      courseApi.middleware,
      openApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
