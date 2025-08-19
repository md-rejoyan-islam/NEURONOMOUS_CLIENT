import { IDevice, IGroup, IGroupWithPopulatedData, IUser } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagTypes } from './tags';
import { IAddGroupRequest } from './users';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ISuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface IGroupResponse {
  success: boolean;
  data: IGroupWithPopulatedData[];
}
export interface ISingeGroupResponse {
  success: boolean;
  data: IGroupWithPopulatedData;
}

export interface IGetAllUsersResponse {
  success: boolean;
  data: IUser[];
}
export interface ISuccessResponse<T> {
  success: boolean;
  data: T;
}

export const groupApi = createApi({
  reducerPath: 'groupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
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
    getAllGroups: builder.query<IGroupWithPopulatedData[], void>({
      query: () => ({
        url: '/groups',
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IGroupWithPopulatedData[]>).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Group' as const,
                id: _id,
              })),
              'Group',
            ]
          : ['Group'],
    }),
    addAdminWithGroup: builder.mutation<IGroupResponse, IAddGroupRequest>({
      query: (payload) => ({
        url: '/users/create-admin',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Group'],
    }),
    updateGroupById: builder.mutation<
      IGroupResponse,
      { id: string; data: Partial<IGroup> }
    >({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
    getGroupdById: builder.query<IGroupWithPopulatedData, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IGroupWithPopulatedData>).data,
      providesTags: (result, error, id) => [{ type: 'Group', id }],
    }),
    getAllUsersInGroup: builder.query<IUser[], string>({
      query: (id) => ({
        url: `/groups/${id}/users`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Group', id }],
      transformResponse: (response) =>
        (response as ISuccessResponse<IUser[]>).data,
    }),
    addDeviceToGroup: builder.mutation<
      IGroupResponse,
      {
        id: string;
        payload: {
          deviceId: string;
          name: string;
          location: string;
        };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/groups/${id}/add-device`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
    // add user to group and give device access
    addUserToGroupWithDevices: builder.mutation<
      { success: boolean; message?: string },
      {
        id: string;
        payload: {
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          deviceIds: string[];
          phone?: string;
          notes?: string;
        };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/groups/${id}/add-user`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
    // transformResponse: (response) =>
    //   (response as ISuccessResponse<IUse    []>).data,
    // invalidatesTags
    getAllGroupDevices: builder.query<IDevice[], string>({
      query: (id) => ({
        url: `/groups/${id}/devices`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice[]>).data,
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useAddAdminWithGroupMutation,
  useUpdateGroupByIdMutation,
  useGetGroupdByIdQuery,
  useAddDeviceToGroupMutation,
  useGetAllUsersInGroupQuery,
  useAddUserToGroupWithDevicesMutation,
  useGetAllGroupDevicesQuery,
} = groupApi;
