import { IFirmware } from '@/lib/types';
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

export const firmwareApi = createApi({
  reducerPath: 'firmwareApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy/api/v1',
    // responseHandler: async (response) => {
    //   if (response.status === 301) {
    //     window.location.reload();
    //   }
    //   return response.json();
    // },
  }),
  tagTypes: ['Firmware'],
  endpoints: (builder) => ({
    getFirmware: builder.query<IFirmware[], void>({
      query: () => ({
        url: '/firmwares',
        method: 'GET',
      }),
      transformResponse: (response: ISuccessResponse<IFirmware[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
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
        console.log(firmware, ' firmware data');

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
  useGetFirmwareQuery,
  useDeleteFirmwareMutation,
  useCreateFirmwareMutation,
  useLazyDownloadFirmwareQuery,
  useFirmwareStatusChangeMutation,
} = firmwareApi;
