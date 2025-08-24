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
  description: string;
  createdAt: string;
  updatedAt: string;
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
