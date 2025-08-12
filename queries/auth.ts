import { IUser } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypes } from "./tags";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: "superAdmin" | "admin" | "user";
      status: "active" | "inactive";
      phone?: string;
      last_login?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface ChangePasswordRequest {
  newPassword: string;
  userId: string; // Optional for admin mode
}

export interface AdminChangePasswordRequest {
  userId: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: number;
  newPassword: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy",
    responseHandler: async (response) => {
      if (response.status === 301) {
        window.location.reload();
      }
      return response.json();
    },
  }),
  keepUnusedDataFor: 0, // Data will be kept in the cache for 0 seconds
  tagTypes,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    changeUserPassword: builder.mutation<void, ChangePasswordRequest>({
      query: ({ newPassword, userId }) => ({
        url: `/users/${userId}/change-password`,
        method: "POST",
        body: { newPassword },
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useChangeUserPasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useProfileQuery,
} = authApi;
