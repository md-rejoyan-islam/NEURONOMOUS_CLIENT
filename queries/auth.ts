import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ISuccessResponse, IUser } from "./../lib/types";

type LoginResponse = ISuccessResponse<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}>;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy/api/v1",
  }),
  keepUnusedDataFor: 0, // Data will be kept in the cache for 0 seconds
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, Pick<IUser, "email" | "password">>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<void, Pick<IUser, "email">>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation<
      void,
      {
        email: string;
        resetCode: number;
        newPassword: string;
      }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    profile: builder.query<IUser, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      transformResponse: (response: { data: IUser }) => response.data,
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<IUser, Partial<IUser>>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
      transformResponse: (response: { data: IUser }) => response.data,
    }),
    changePassword: builder.mutation<
      void,
      { newPassword: string; currentPassword: string }
    >({
      query: (payload) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useProfileQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
