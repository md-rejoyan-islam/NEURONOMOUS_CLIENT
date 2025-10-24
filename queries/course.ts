import { ICourse, IPagination } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ISuccessResponseForAllCourse<T> {
  success: boolean;
  message: string;
  data: {
    courses: T[];
    pagination: IPagination; // keep this for compatibility with backend response
  };
}

interface ISigleCourse {
  _id: string;
  name: string;
  code: string;
  is_active: boolean;
  enroll_link: string;
  session: string;
  studentsEnrolled: number;
  instructor: string;
  instructor_email: string;
  department: string;
  updatedAt: string;
  completedClasses: number;
  attendanceRate: string;
  records: [
    {
      _id: string;
      date: string;
      present_students: number;
      createdAt: string;
      updatedAt: string;
    },
  ];
}

interface ICourseForAll {
  _id: string;
  name: string;
  code: string;
  session: string;
  department: string;
  instructor: string;
  instructor_email: string;
  studentsEnrolled: number;
  completedClasses: number;
  createdAt: string;
  updatedAt: string;
  attendanceRate: string;
}

interface IEnrolledStudent {
  _id: string;
  name: string;
  code: string;
  session: string;
  department: string;
  students: {
    name: string;
    registration_number: string;
    session: string;
  }[];
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  keepUnusedDataFor: 0,
  tagTypes: ['Course', 'Record'],
  endpoints: (builder) => ({
    createCourse: builder.mutation<
      ICourse,
      {
        courseId: string;
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

    getAllCourses: builder.query<
      { pagination: IPagination; courses: ICourseForAll[] },
      string
    >({
      query: (query) => ({
        url: `/courses?${query}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        const data = (response as ISuccessResponseForAllCourse<ICourseForAll>)
          .data;
        return {
          courses: data.courses,
          pagination: data.pagination,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.courses.map(({ _id }) => ({
                type: 'Course' as const,
                id: _id,
              })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
    }),
    getCourseById: builder.query<ISigleCourse, { id: string }>({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<ISigleCourse>).data,
      providesTags: (result, error, { id }) =>
        result ? [{ type: 'Course', id }] : ['Course'],
    }),
    getEnrolledStudentsByCourseId: builder.query<
      IEnrolledStudent,
      { courseId: string }
    >({
      query: ({ courseId }) => ({
        url: `/courses/${courseId}/enrolled-students`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        (response as ISuccessResponse<IEnrolledStudent>).data,
    }),
    addAttendanceRecord: builder.mutation<
      void,
      { courseId: string; date: string }
    >({
      query: ({ courseId, date }) => ({
        url: `/courses/${courseId}/attendance-records`,
        method: 'POST',
        body: { date },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course', id: courseId },
      ],
    }),
    removeCourse: builder.mutation<void, { groupId: string; courseId: string }>(
      {
        query: ({ groupId, courseId }) => ({
          url: `/courses/${courseId}/department/${groupId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Course'],
      }
    ),
    getAttendanceRecordByDate: builder.query<
      {
        _id: string;
        date: string;
        code: string;
        name: string;
        enrolled_students: {
          _id: string;
          name: string;
          registration_number: string;
          session: string;
        }[];
        present_students: {
          _id: string;
          presentBy: string;
          student: {
            name: string;
            registration_number: string;
            session: string;
          };
        }[];
        createdAt: string;
        updatedAt: string;
      },
      { courseId: string; date: string }
    >({
      query: ({ courseId, date }) => ({
        url: `/courses/${courseId}/attendance-records/${date}`,
        method: 'GET',
      }),
      providesTags: (result, error, { date }) => [
        { type: 'Record', date: date },
      ],
      transformResponse: (response) =>
        (
          response as ISuccessResponse<{
            _id: string;
            date: string;
            code: string;
            name: string;
            enrolled_students: {
              _id: string;
              name: string;
              registration_number: string;
              session: string;
            }[];
            present_students: {
              _id: string;
              presentBy: string;
              student: {
                name: string;
                registration_number: string;
                session: string;
              };
            }[];
            createdAt: string;
            updatedAt: string;
          }>
        ).data,
    }),
    manuallyAttendanceRecordToggle: builder.mutation<
      void,
      { courseId: string; date: string; studentId: string }
    >({
      query: ({ courseId, date, studentId }) => ({
        url: `/courses/${courseId}/manually-toggle-attendance`,
        method: 'PATCH',
        body: { date, studentId },
      }),
      invalidatesTags: (result, error, { courseId, date }) => [
        { type: 'Course', id: courseId },
        { type: 'Record', date: date },
      ],
    }),
    deleteAttendanceRecord: builder.mutation<
      void,
      { courseId: string; date: string }
    >({
      query: ({ courseId, date }) => ({
        url: `/courses/${courseId}/records/${date}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: 'Course', id: courseId },
      ],
    }),
  }),
});

export const {
  useDeleteAttendanceRecordMutation,
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetEnrolledStudentsByCourseIdQuery,
  useAddAttendanceRecordMutation,
  useGetAttendanceRecordByDateQuery,
  useManuallyAttendanceRecordToggleMutation,
} = courseApi;
