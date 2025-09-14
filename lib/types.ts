export interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  role: 'superadmin' | 'admin' | 'user';
  status: 'active' | 'inactive';
  allowed_devices: string[];
  last_login: string;
  notes?: string;
  phone?: string;
  createdAt: string;
  group?: string; // Group ID if the user is part of a group
}

export interface IFirmware {
  _id: string;
  version: number;
  file: Buffer;
  size: string;
  status: 'active' | 'inactive';
  device_type: 'clock' | 'attendance';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemory {
  total: number; // in bytes
  free: number; // in bytes
  used: number; // in bytes
  memoryUsagePercent: string; // percentage of used memory
}

export interface ICpu {
  cores: number;
  cpuUsagePercent: string; // percentage of CPU usage
}

export interface ICourse {
  _id: string;
  code: string;
  name: string;
  session: string;
  enroll_link: string;
  instructor: IUser;
  studentsEnrolled: {
    _id: string;
    registration_number: string;
    name: string;
    email: string;
    session: string;
  }[];
  completedClasses: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceDevice {
  _id: string;
  id: string;
  mac_id: string | null;
  status: 'online' | 'offline';
  free_heap: number;
  firmware_version: string | null;
  last_seen: number;
  allowed_users?: {
    _id: string;
    role: 'admin' | 'user' | 'superadmin';
    first_name: string;
    last_name: string;
    email: string;
  }[];
  group: {
    _id: string;
    name: string;
    admin: IUser;
  };
  courses: {
    _id: string;
    code: string;
    name: string;
    session: string;
    enroll_link: string;
    instructor: IUser;
    studentsEnrolled: number;
    completedClasses: number;
    updatedAt: string;
  }[];
}

export interface IPagination {
  items: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface IDevice {
  _id: string;
  id: string;
  mac_id: string | null;
  status: 'online' | 'offline';
  mode: 'clock' | 'notice';
  notice: string | null;
  name: string | null;
  uptime: number;
  end_time: number | null; // Unix timestamp in milliseconds, can be null
  firmware_version: string | null;
  type: 'single' | 'double';
  free_heap: number;
  location: string | null;
  last_seen: number; // Unix timestamp in milliseconds
  duration: number | null; // duration in minutes, can be null
  start_time: number | null; // Unix timestamp in milliseconds, can be null
  last_firmware_update: number | null; // Unix timestamp in milliseconds, can be null
  allowed_users: string[]; // Array of user IDs allowed to access the device
  pending_notice: boolean; // Indicates if there is a pending notice to be sent
  timestamp: string;
  scheduled_notices: {
    id: string; // Unique ID for the scheduled notice
    notice: string;
    start_time: number; // Unix timestamp in milliseconds
    duration: number; // duration in minutes
  }[];
  font?: string;
  time_format?: string;
  group?: string;
  available_firmwares: [{ _id: string; version: string }];
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
  eiin: string;
  createdAt: string;
  devices: string[]; // Array of device IDs
  members: string[]; // Array of user IDs
}

export interface IGroupWithPopulatedData {
  _id: string;
  name: string;
  eiin: string;
  description: string;
  createdAt: string;
  courses: number;
  students: number;
  devices: number; // Populated device data
  members: IUser[]; // Populated user data
}

export interface ISuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface ISuccessResponseWithPagination<T> {
  success: boolean;
  message: string;
  pagination: IPagination;
  data: T;
}
