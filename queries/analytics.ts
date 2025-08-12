import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiUrl } from '@/lib/config'

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  networkUsage: number
  activeDevices: number
  totalDevices: number
  activeUsers: number
  totalUsers: number
}

interface RecentActivity {
  id: string
  type: "login" | "device_control" | "user_created" | "notice_sent"
  user: string
  message: string
  timestamp: string
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiUrl('ANALYTICS'),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getSystemMetrics: builder.query<SystemMetrics, void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const mockMetrics: SystemMetrics = {
          cpuUsage: Math.floor(Math.random() * 40) + 30,
          memoryUsage: Math.floor(Math.random() * 30) + 50,
          networkUsage: Math.floor(Math.random() * 50) + 10,
          activeDevices: Math.floor(Math.random() * 2) + 3,
          totalDevices: 4,
          activeUsers: Math.floor(Math.random() * 2) + 2,
          totalUsers: 3,
        }
        
        return { data: mockMetrics }
      },
      providesTags: ['Analytics'],
    }),
    getRecentActivity: builder.query<RecentActivity[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const mockActivity: RecentActivity[] = [
          {
            id: "1",
            type: "login",
            user: "john.doe@example.com",
            message: "User logged in successfully",
            timestamp: new Date().toISOString(),
          },
          {
            id: "2",
            type: "device_control",
            user: "jane.smith@example.com",
            message: "Changed device-001 mode to notice",
            timestamp: new Date(Date.now() - 300000).toISOString(),
          },
          {
            id: "3",
            type: "user_created",
            user: "admin@example.com",
            message: "Created new user: mike.johnson@example.com",
            timestamp: new Date(Date.now() - 600000).toISOString(),
          },
          {
            id: "4",
            type: "notice_sent",
            user: "admin@example.com",
            message: "Sent notice to 3 devices",
            timestamp: new Date(Date.now() - 900000).toISOString(),
          },
          {
            id: "5",
            type: "login",
            user: "user@demo.com",
            message: "User logged in successfully",
            timestamp: new Date(Date.now() - 1200000).toISOString(),
          },
        ]
        
        return { data: mockActivity }
      },
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetSystemMetricsQuery,
  useGetRecentActivityQuery,
} = analyticsApi
