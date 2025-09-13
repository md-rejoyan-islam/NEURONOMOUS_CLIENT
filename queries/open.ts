import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ICourse {
  _id: string;
  code: string;
  name: string;
  instructor: string;
  department: string;
}

interface IEnrollmentResponse {
  student_name: string;
  session: string;
}

export const openApi = createApi({
  reducerPath: 'openApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1/open',
  }),
  keepUnusedDataFor: 0,
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getEnrollmentCourseById: builder.query<ICourse, string>({
      query: (id) => ({
        url: `/course-enroll/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<ICourse>).data,
    }),
    enrollInCourse: builder.mutation<
      IEnrollmentResponse,
      { courseId: string; registration_number: string }
    >({
      query: ({ courseId, registration_number }) => ({
        url: `/course-enroll/${courseId}`,
        method: 'POST',
        body: { registration_number },
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IEnrollmentResponse>).data,
    }),
  }),
});

export const { useGetEnrollmentCourseByIdQuery, useEnrollInCourseMutation } =
  openApi;
