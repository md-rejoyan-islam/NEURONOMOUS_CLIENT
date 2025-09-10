import { ICourse } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface courseQuery {
  instructorId?: string;
  departmentId?: string;
  session?: string;
  code?: string;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  keepUnusedDataFor: 0,
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    createCourse: builder.mutation<
      ICourse,
      {
        code: string;
        name: string;
        session: string;
        instructor: string;
        department: string;
      }
    >({
      query: (body) => ({
        url: `/courses`,
        method: 'POST',
        body,
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<ICourse>).data,
      invalidatesTags: ['Course'],
    }),

    getAllCourses: builder.query<ICourse[], string>({
      query: (query) => ({
        url: `/courses?${query}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<ICourse[]>).data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Course' as const,
                id: _id,
              })),
              'Course',
            ]
          : ['Course'],
    }),
    getCourseById: builder.query<ICourse, { id: string }>({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<ICourse>).data,
      providesTags: (result, error, { id }) =>
        result ? [{ type: 'Course', id }] : ['Course'],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
} = courseApi;
