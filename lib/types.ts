export interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "superadmin" | "admin" | "user";
  status: "active" | "inactive";
  allowed_devices: string[];
  last_login: string;
  notes?: string;
  phone?: string;
  createdAt: string;
}

export interface IDevice {
  _id: string;
  id: string;
  name: string | null;
  status: "online" | "offline";
  location: string | null;
  uptime: number;
  mode: "clock" | "notice";
  last_seen: string;
  notice: string | null;
  duration: number | null; // duration in minutes, can be null
  start_time: number | null; // Unix timestamp in milliseconds, can be null
  end_time: number | null; // Unix timestamp in milliseconds, can be null
  free_heap: number;
  history: {
    message: string;
    timestamp: number;
  }[];
  pending_notice: boolean; // Indicates if there is a pending notice to be sent
  scheduled_notices: {
    id: string; // Unique ID for the scheduled notice
    notice: string;
    start_time: number; // Unix timestamp in milliseconds
    duration: number; // duration in minutes
  }[];
  font?: string;
  time_format?: string;
}

export interface IScheduledNotice {
  id: string; // Unique ID for the scheduled notice
  notice: string;
  start_time: Date | string; // Date object or ISO string
  end_time: Date | string; // Date object or ISO string
}

export interface IGroup {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  devices: string[]; // Array of device IDs
  members: string[]; // Array of user IDs
}

export interface IGroupWithPopulatedData {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  devices: IDevice[]; // Populated device data
  members: IUser[]; // Populated user data
}
