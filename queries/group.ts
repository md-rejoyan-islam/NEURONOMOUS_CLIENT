import {
  IAttendanceDevice,
  IDevice,
  IGroup,
  IGroupWithPopulatedData,
  IPagination,
  IUser,
} from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export interface IGetAllGroups {
  name: string;
  eiin: string;
  _id: string;
  clock: number;
  attendance: number;
  users: number;
  description: string;
  createdAt: string;
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
  tagTypes: ['Group', 'Device', 'GroupCourse', 'Students'],
  endpoints: (builder) => ({
    getAllGroups: builder.query<IGetAllGroups[], string>({
      query: (query) => ({
        url: `/groups` + (query ? `?${query}` : ''),
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IGetAllGroups[]>).data,
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
    createCourseForDepartment: builder.mutation<
      { success: boolean; message?: string },
      {
        name: string;
        code: string;
        groupId: string;
      }
    >({
      query: (payload) => ({
        url: `/groups/${payload.groupId}/courses/`,
        method: 'POST',
        body: {
          name: payload.name,
          code: payload.code,
        },
      }),
      invalidatesTags: ['GroupCourse'],
      transformResponse: (response) =>
        (response as ISuccessResponse<{ success: boolean; message?: string }>)
          .data,
    }),
    addStudentsInDepartment: builder.mutation<
      { success: boolean; message?: string },
      FormData
    >({
      query: (payload) => ({
        url: `/groups/${payload.get('groupId')}/students`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Students'],
      transformResponse: (response) =>
        (response as ISuccessResponse<{ success: boolean; message?: string }>)
          .data,
    }),
    removeCourseForDepartment: builder.mutation<
      {
        success: boolean;
        message?: string;
      },
      {
        groupId: string;
        courseId: string;
      }
    >({
      query: (payload) => ({
        url: `/groups/${payload.groupId}/courses/${payload.courseId}`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: ['GroupCourse'],
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            success: boolean;
            message?: string;
          }>
        ).data,
    }),
    removeStudentForDepartment: builder.mutation<
      {
        success: boolean;
        message?: string;
      },
      {
        groupId: string;
        studentId: string;
      }
    >({
      query: (payload) => ({
        url: `/groups/${payload.groupId}/students/${payload.studentId}`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: ['Students'],
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            success: boolean;
            message?: string;
          }>
        ).data,
    }),
    editCourseInDepartment: builder.mutation<
      {
        success: boolean;
        message?: string;
      },
      {
        name: string;
        code: string;
        groupId: string;
        courseId: string;
      }
    >({
      query: (payload) => ({
        url: `/groups/${payload.groupId}/courses/${payload.courseId}`,
        method: 'PATCH',
        body: {
          name: payload.name,
          code: payload.code,
        },
      }),
      invalidatesTags: ['GroupCourse'],
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            success: boolean;
            message?: string;
          }>
        ).data,
    }),
    editStudentInDepartment: builder.mutation<
      {
        success: boolean;
        message?: string;
      },
      {
        name: string;
        email: string;
        groupId: string;
        studentId: string;
        rfid: string;
        registration_number: string;
        session: string;
      }
    >({
      query: (payload) => ({
        url: `/groups/${payload.groupId}/students/${payload.studentId}`,
        method: 'PATCH',
        body: {
          name: payload.name,
          email: payload.email,
          rfid: payload.rfid,
          registration_number: payload.registration_number,
          session: payload.session,
        },
      }),
      invalidatesTags: ['Students'],
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            success: boolean;
            message?: string;
          }>
        ).data,
    }),
    getDepartmentCourses: builder.query<
      {
        _id: string;
        name: string;
        eiin: string;
        description: string;
        createdAt: string;
        courses: {
          name: string;
          code: string;
          _id: string;
        }[];
      },
      string
    >({
      query: (id) => ({
        url: `/groups/${id}/courses`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            _id: string;
            name: string;
            eiin: string;
            description: string;
            createdAt: string;
            courses: {
              name: string;
              code: string;
              _id: string;
            }[];
          }>
        ).data,
      providesTags: (result, error, id) => [
        { type: 'GroupCourse', id },
        'GroupCourse',
      ],
    }),
    getDepartmentStudents: builder.query<
      {
        _id: string;
        name: string;
        eiin: string;
        description: string;
        createdAt: string;
        pagination: IPagination;
        students: {
          name: string;
          email: string;
          _id: string;
          session: string;
          registration_number: string;
          rfid: string;
        }[];
      },
      { id: string; query?: string }
    >({
      query: ({ id, query }) => ({
        url: `/groups/${id}/students` + (query ? `?${query}` : ''),
        method: 'GET',
      }),
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            _id: string;
            name: string;
            eiin: string;
            description: string;
            createdAt: string;
            pagination: IPagination;
            students: {
              name: string;
              email: string;
              _id: string;
              session: string;
              registration_number: string;
              rfid: string;
            }[];
          }>
        ).data,
      providesTags: (result, error, { id }) => [
        { type: 'Students', id },
        'Students',
      ],
    }),
    getAllGroupsForCourseCreation: builder.query<
      { name: string; eiin: string; _id: string }[],
      void
    >({
      query: () => ({
        url: '/groups//all-groups',
        method: 'GET',
      }),
      transformResponse: (response) =>
        (
          response as ISuccessResponse<
            { name: string; eiin: string; _id: string }[]
          >
        ).data,
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
    addAdminWithGroup: builder.mutation<
      IGroupWithPopulatedData[],
      IAddGroupRequest
    >({
      query: (payload) => ({
        url: '/users/create-admin',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Group'],
      transformResponse: (response) =>
        (response as ISuccessResponse<IGroupWithPopulatedData[]>).data,
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
    deleteGroupById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Group'],
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
    // addDeviceToGroup: builder.mutation<
    //   IGroupResponse,
    //   {
    //     id: string;
    //     payload: {
    //       deviceId: string;
    //       name: string;
    //       location: string;
    //     };
    //   }
    // >({
    //   query: ({ id, payload }) => ({
    //     url: `/groups/${id}/add-clock-device`,
    //     method: 'POST',
    //     body: payload,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    // }),
    addClockDeviceToGroup: builder.mutation<
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
        url: `/clock-devices/group/${id}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Group', id },
        'Device',
      ],
    }),
    addAttendanceDeviceToGroup: builder.mutation<
      IGroupResponse,
      {
        id: string;
        payload: {
          deviceId: string;
        };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/attendance-devices/group/${id}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Group', id },
        'Device',
      ],
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
          deviceType: 'clock' | 'attendance';
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
    // add user to group and give device access
    addUserToGroup: builder.mutation<
      { success: boolean; message?: string },
      {
        id: string;
        payload: {
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          phone?: string;
          notes?: string;
        };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/groups/${id}/users`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
    // transformResponse: (response) =>
    //   (response as ISuccessResponse<IUse    []>).data,
    // invalidatesTags
    getAllGroupDevices: builder.query<IDevice[], string>({
      query: (id) => {
        console.log('Fetching devices for group ID:', id);

        return {
          url: `/groups/${id}/devices`,
          method: 'GET',
        };
      },
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice[]>).data,
    }),
    getClocksInGroup: builder.query<
      IDevice[],
      {
        id: string;
        search?: string;
      }
    >({
      query: ({ id, search }) => ({
        url: `/groups/${id}/devices/clocks${search ? `?search=${search}` : ''}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IDevice[]>).data,
      providesTags: (result, error, arg) => [
        { type: 'Group', id: arg.id },
        'Device',
      ],
    }),
    getAttendanceDevicesInGroup: builder.query<
      IAttendanceDevice[],
      {
        id: string;
        search?: string;
      }
    >({
      query: ({ id, search }) => ({
        url: `/groups/${id}/devices/attendance${search ? `?search=${search}` : ''}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IAttendanceDevice[]>).data,
      providesTags: (result, error, arg) => [
        { type: 'Group', id: arg.id },
        'Device',
      ],
    }),
    // remove a device from group
    removeDeviceFromGroup: builder.mutation<
      void,
      { id: string; deviceId: string }
    >({
      query: ({ id, deviceId }) => ({
        url: `/groups/${id}/remove-device/${deviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
    }),
  }),
});

export const {
  useGetClocksInGroupQuery,
  useGetAttendanceDevicesInGroupQuery,
  useGetAllGroupsQuery,
  useAddAdminWithGroupMutation,
  useUpdateGroupByIdMutation,
  useGetGroupdByIdQuery,
  useAddClockDeviceToGroupMutation,
  useGetAllUsersInGroupQuery,
  useAddUserToGroupWithDevicesMutation,
  useGetAllGroupDevicesQuery,
  useRemoveDeviceFromGroupMutation,
  useAddAttendanceDeviceToGroupMutation,
  useDeleteGroupByIdMutation,
  useGetAllGroupsForCourseCreationQuery,
  useCreateCourseForDepartmentMutation,
  useGetDepartmentCoursesQuery,
  useRemoveCourseForDepartmentMutation,
  useEditCourseInDepartmentMutation,
  useAddUserToGroupMutation,
  useAddStudentsInDepartmentMutation,
  useGetDepartmentStudentsQuery,
  useRemoveStudentForDepartmentMutation,
  useEditStudentInDepartmentMutation,
} = groupApi;
