export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
  ENDPOINTS: {
    AUTH: "/auth",
    DEVICES: "/clock-devices",
    USERS: "/users",
    NOTIFICATIONS: "/notifications",
    ANALYTICS: "/analytics",
    LOGS: "/logs",
  },
} as const;

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Development mode check
export const isDevelopment = process.env.NODE_ENV === "development";
export const hasSocketServer = process.env.NEXT_PUBLIC_SOCKET_URL !== undefined;
