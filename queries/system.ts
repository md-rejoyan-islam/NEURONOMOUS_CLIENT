import { ICpu, IMemory } from '@/lib/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Firmware {
  _id: string;
  version: number;
  type: 'single' | 'double';
  file: Buffer;
  description: string;
}
export interface FirmwareCreateInput {
  version: number;
  type: 'single' | 'double';
  file: Buffer;
  description: string;
}

interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const systemApi = createApi({
  reducerPath: 'systemApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  keepUnusedDataFor: 0, // Data will be kept in the cache for 0 seconds
  tagTypes: ['System'],
  endpoints: (builder) => ({
    getMemoryDetails: builder.query<IMemory, void>({
      query: () => ({
        url: '/system/memory',
        method: 'GET',
      }),
      transformResponse: (response: ISuccessResponse<IMemory>) => response.data,
      providesTags: ['System'],
    }),
    getCpuDetails: builder.query<ICpu, void>({
      query: () => ({
        url: '/system/cpu',
        method: 'GET',
      }),
      transformResponse: (response: ISuccessResponse<ICpu>) => response.data,
      providesTags: ['System'],
    }),
  }),
});

export const { useGetMemoryDetailsQuery, useGetCpuDetailsQuery } = systemApi;
