import { analyticsApi } from '@/queries/analytics';
import { authApi } from '@/queries/auth';
import { devicesApi } from '@/queries/devices';
import { firmwareApi } from '@/queries/firmware';
import { groupApi } from '@/queries/group';
import { notificationsApi } from '@/queries/notifications';
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      devicesApi.middleware,
      usersApi.middleware,
      notificationsApi.middleware,
      analyticsApi.middleware,
      authApi.middleware,
      groupApi.middleware,
      firmwareApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
