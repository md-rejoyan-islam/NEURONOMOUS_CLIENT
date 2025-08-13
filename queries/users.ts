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

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    email: "super@demo.com",
    firstName: "Super",
    lastName: "Admin",
    role: "superAdmin",
    status: "active",
    createdAt: "2024-01-01T10:00:00Z",
    lastLogin: "2024-01-15T14:30:00Z",
    deviceAccess: ["all"],
    groupName: "Management",
  },
  {
    id: "2",
    email: "admin@demo.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    status: "active",
    createdAt: "2024-01-02T11:00:00Z",
    lastLogin: "2024-01-14T16:45:00Z",
    deviceAccess: ["device-001", "device-002", "device-003"],
    groupName: "IT Department",
  },
  {
    id: "3",
    email: "user@demo.com",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    status: "active",
    createdAt: "2024-01-03T12:00:00Z",
    lastLogin: "2024-01-13T09:15:00Z",
    deviceAccess: ["device-001"],
  },
  {
    id: "4",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    status: "inactive",
    createdAt: "2024-01-04T13:00:00Z",
    lastLogin: "2024-01-10T10:30:00Z",
    deviceAccess: ["device-002"],
  },
  {
    id: "5",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "admin",
    status: "banned",
    createdAt: "2024-01-05T14:00:00Z",
    lastLogin: "2024-01-08T15:20:00Z",
    deviceAccess: ["device-001", "device-003"],
    groupName: "Operations",
  },
];

interface IGetAllUsersResponse<T> {
  success: boolean;
  data: T[];
}

export const usersApi = createApi({
  reducerPath: "usersApi",
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
} = usersApi;
