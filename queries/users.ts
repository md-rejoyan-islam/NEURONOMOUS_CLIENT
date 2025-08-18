import { IUser } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "superAdmin";
  status: "active" | "inactive" | "banned";
  createdAt: string;
  lastLogin: string;
  deviceAccess: string[];
  groupName?: string;
}
export interface IAddGroupRequest {
  group_name: string;
  group_description?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superAdmin";
}

interface IGetAllUsersResponse<T> {
  success: boolean;
  data: T[];
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/proxy/api/v1",
    responseHandler: async (response) => {
      if (response.status === 301) {
        window.location.reload();
      }
      return response.json();
    },
  }),
  keepUnusedDataFor: 0, // Data will be kept in the cache for 0 seconds
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as IGetAllUsersResponse<IUser>).data,
      providesTags: ["Users"],
    }),
    getUserById: builder.query<IUser, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as { success: boolean; data: IUser }).data,
      providesTags: (result, error, userId) =>
        result ? [{ type: "User", id: userId }] : ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Users"],
    }),

    banUserById: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    unbanUserById: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/unban`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    changeUserPasswordById: builder.mutation<
      void,
      { userId: string; newPassword: string }
    >({
      query: ({ userId, newPassword }) => ({
        url: `/users/${userId}/change-password`,
        method: "PATCH",
        body: { newPassword },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBanUserByIdMutation,
  useUnbanUserByIdMutation,
  useChangeUserPasswordByIdMutation,
  useGetUserByIdQuery,
} = usersApi;
