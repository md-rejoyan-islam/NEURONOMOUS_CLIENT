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

// Mock users database
const mockUsers = [
  {
    id: "1",
    email: "super@demo.com",
    firstName: "Super",
    lastName: "Admin",
    role: "superAdmin",
    status: "active",
    deviceAccess: ["all"],
    password: "password",
  },
  {
    id: "2",
    email: "admin@demo.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    status: "active",
    deviceAccess: ["device-001", "device-002", "device-003"],
    password: "password",
  },
  {
    id: "3",
    email: "user@demo.com",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    status: "active",
    deviceAccess: ["device-001"],
    password: "password",
  },
];

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
