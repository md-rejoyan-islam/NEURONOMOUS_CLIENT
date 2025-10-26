import { IFirmware, ISuccessResponseWithPagination } from '@/lib/types';
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

export const firmwareApi = createApi({
  reducerPath: 'firmwareApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
  }),
  tagTypes: ['Firmware'],
  endpoints: (builder) => ({
    getAllFirmware: builder.query<
      ISuccessResponseWithPagination<IFirmware[]>,
      string
    >({
      query: (query) => ({
        url: `/firmwares${query ? `?${query}` : ''}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Firmware' as const,
                id: _id,
              })),
              'Firmware',
            ]
          : ['Firmware'],
    }),
    downloadFirmware: builder.query<Blob, string>({
      query: (id) => ({
        url: `/firmwares/${id}/download`,
        method: 'GET',
        responseHandler: async (response) => {
          const buffer = await response.arrayBuffer();
          return new Uint8Array(buffer);
        },
      }),
    }),
    deleteFirmware: builder.mutation<void, string>({
      query: (id) => ({
        url: `/firmwares/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Firmware'],
    }),
    createFirmware: builder.mutation<Firmware, FormData>({
      query: (firmware) => {
        return {
          url: '/firmwares',
          method: 'POST',
          body: firmware,
        };
      },
      invalidatesTags: ['Firmware'],
    }),
    firmwareStatusChange: builder.mutation<
      void,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/firmwares/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Firmware'],
    }),
  }),
});

export const {
  useGetAllFirmwareQuery,
  useDeleteFirmwareMutation,
  useCreateFirmwareMutation,
  useLazyDownloadFirmwareQuery,
  useFirmwareStatusChangeMutation,
} = firmwareApi;
