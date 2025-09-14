import { IPagination } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
interface ISuccessResponseSummary {
  success: boolean;
  message: string;
  pagination: IPagination;
  data: {
    _id: string;
    name: string;
    registration_number: string;
    session: string;
    department: {
      name: string;
      eiin: string;
    };
    total_classes_attended: number;
    total_classes_held: number;
    total_courses: number;
    retaken_courses: number;
    total_classes_missed: number;
    performance_percentage: string;
  }[];
}

interface IStudent {
  _id: string;
  name: string;
  registration_number: string;
  session: string;
  courses: {
    _id: string;
    name: string;
    code: string;
    total_class: number;
    attend: number;
    absent: number;
    session: string;
    percentage: number;
  }[];
}

export const studentApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1/students',
  }),
  keepUnusedDataFor: 0,
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getAllStudentsSummary: builder.query<ISuccessResponseSummary, string>({
      query: (query) => ({
        url: `/summary?${query}`,
        method: 'GET',
      }),
      transformResponse: (response) => response as ISuccessResponseSummary,
      providesTags: ['Students'],
    }),
    getStudentCourses: builder.query<ISuccessResponse<IStudent>, string>({
      query: (id) => ({
        url: `/${id}/courses`,
        method: 'GET',
      }),
      transformResponse: (response) => response as ISuccessResponse<IStudent>,
      providesTags: ['Students'],
    }),
  }),
});

export const { useGetAllStudentsSummaryQuery, useGetStudentCoursesQuery } =
  studentApi;
