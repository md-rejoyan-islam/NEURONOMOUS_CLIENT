'use client';

import {
  useEnrollInCourseMutation,
  useGetEnrollmentCourseByIdQuery,
} from '@/queries/open';
import clsx from 'clsx';
import { CircleCheckBig } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');

  const params = useParams();
  const courseId = params?.id as string;

  const { data, isLoading } = useGetEnrollmentCourseByIdQuery(courseId, {
    skip: !courseId,
  });

  const [courseEnroll] = useEnrollInCourseMutation();

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleRegistationNumberChange = (value: string) => {
    setRegistrationNumber(value);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await courseEnroll({
        courseId,
        registration_number: registrationNumber,
      });

      if (response.error) {
        throw response.error;
      }

      setMessage({
        type: 'success',
        text: `Welcome, ${response.data.student_name}. You are now enrolled in the course.`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      setMessage({
        type: 'error',
        text: error?.data?.message || 'Could not enroll in the course.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#182134] to-[#1E2836] p-4">
        {/* loading circle */}
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#182134] to-[#1E2836] p-4">
      <div className="mx-auto w-full max-w-md">
        <div
          id="registration-card"
          className={clsx(
            'form-container bg-opacity-50 rounded-2xl border border-gray-700 bg-[#182434] p-8 text-white shadow-2xl',
            message && message.type === 'success' && 'hidden'
          )}
        >
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold tracking-tight text-cyan-400 sm:text-3xl">
              {data?.name}
            </h1>
            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Register for the course below
            </p>
          </div>
          {/* Course Details Section */}
          <div className="mb-8 space-y-4">
            <div className="bg-opacity-50 flex items-center justify-between rounded-lg bg-gray-900 p-3 text-sm sm:text-base">
              <span className="font-medium text-gray-400">Instructor:</span>
              <span className="font-semibold text-gray-200">
                {data?.instructor}
              </span>
            </div>
            <div className="bg-opacity-50 flex items-center justify-between rounded-lg bg-gray-900 p-3 text-sm sm:text-base">
              <span className="font-medium text-gray-400">Department:</span>
              <span className="font-semibold text-gray-200">
                {data?.department}
              </span>
            </div>
            <div className="bg-opacity-50 flex items-center justify-between rounded-lg bg-gray-900 p-3 text-sm sm:text-base">
              <span className="font-medium text-gray-400">Course Code:</span>
              <span className="font-semibold text-gray-200">{data?.code}</span>
            </div>
          </div>
          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="registration-number"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Registration Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => handleRegistationNumberChange(e.target.value)}
                id="registration-number"
                name="registration-number"
                className="bg-opacity-50 w-full rounded-lg border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 transition duration-300 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none"
                placeholder="e.g., 2023001"
              />
            </div>
            <button
              type="submit"
              className="w-full transform cursor-pointer rounded-lg bg-cyan-500 px-4 py-3 font-bold text-gray-900 shadow-lg transition duration-300 hover:scale-105 hover:bg-cyan-600 hover:shadow-cyan-500/50"
            >
              Submit Registration
            </button>
          </form>
        </div>

        {/* Success Message Card */}
        {message && message.type === 'success' && (
          <div
            id="success-message"
            className="message-card bg-opacity-20 mt-6 w-full max-w-md rounded-2xl border border-green-500 bg-green-500 p-6 text-center text-white shadow-2xl"
          >
            <h3>
              <CircleCheckBig className="mx-auto mb-2 h-12 w-12 text-white" />
            </h3>

            <h1 className="text-lg font-bold text-green-300 sm:text-2xl">
              Registration Successful!
            </h1>
            <p className="mt-2 text-sm text-green-200 sm:text-base">
              {message.text}
            </p>
          </div>
        )}
        {/* Error Message Card */}
        {message && message.type === 'error' && (
          <div
            id="error-message"
            className="message-card bg-opacity-20 mt-6 w-full max-w-md rounded-2xl border border-red-500 bg-red-500 p-6 text-center text-white shadow-2xl"
          >
            <h2 className="text-lg font-bold text-red-300 sm:text-2xl">
              Registration Failed
            </h2>
            <p
              id="error-text"
              className="mt-2 text-sm text-red-200 sm:text-base"
            >
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
