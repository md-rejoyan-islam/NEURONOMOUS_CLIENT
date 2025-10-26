import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<
      void,
      { name: string; email: string; message: string }
    >({
      query: (formData) => ({
        url: '/contact',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useSubmitContactFormMutation } = contactApi;
