import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createCourseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  code: z.string().min(2, 'Course code must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  instructor: z.string().min(2, 'Instructor is required'),
  session: z.string().min(4, 'Session must be at least 4 characters'),
});

export const userCreateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'superAdmin', 'user']),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const authChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .refine((val) => val.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
  currentPassword: z.string().min(1, 'Please enter your current password'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    resetCode: z.string().min(7, 'Reset code must be 7 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Device schemas
export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['online', 'offline']),
  last_seen: z.string(),
  mode: z.enum(['clock', 'notice']),
  current_notice: z.string().nullable(),
  location: z.string(),
  uptime: z.number(),
  free_heap: z.number(),
  duration: z.number().nullable(),
  font: z.string(),
  time_format: z.enum(['12h', '24h']),
});

export const deviceUpdateSchema = z.object({
  mode: z.enum(['clock', 'notice']),
  notice: z.string().optional(),
  duration: z.number().optional(),
  font: z.string().optional(),
  time_format: z.enum(['12h', '24h']).optional(),
});

// User schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['admin', 'superAdmin', 'user']),
  status: z.enum(['active', 'inactive', 'banned']),
  createdAt: z.string(),
  lastLogin: z.string(),
  deviceAccess: z.array(z.string()),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  notes: z.string().optional(),
  address: z.string().optional(),
});

export const createUserSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),

  // role: z.enum(["superadmin", "user", "admin"]),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
  deviceAccess: z.array(z.string()).min(1, 'Select at least one device'),
});

export const groupSchema = z.object({
  group_name: z.string().min(2, 'Group name must be at least 2 characters'),
  group_description: z
    .string()
    .min(10, 'Group description must be at least 10 characters'),
  group_eiin: z.string().min(2, 'Group EIIN must be at least 2 characters'),
});

export const addDeviceToGroupSchema = z.object({
  deviceId: z
    .string({
      error: (iss) => {
        if (!iss.input) {
          return 'Device ID is required.';
        } else if (typeof iss.input !== iss.expected) {
          return 'Device ID must be a string.';
        }
        return 'Invalid device ID.';
      },
    })
    .min(4, 'Device ID must be at least 4 characters long'),
  name: z
    .string({
      error: (iss) => {
        if (!iss.input) {
          return 'Device name is required.';
        } else if (typeof iss.input !== iss.expected) {
          return 'Device name must be a string.';
        }
        return 'Invalid device name.';
      },
    })
    .min(4, 'Device name must be at least 4 characters long'),
  location: z
    .string({
      error: (iss) => {
        if (!iss.input) {
          return 'Location is required.';
        } else if (typeof iss.input !== iss.expected) {
          return 'Location must be a string.';
        }
        return 'Invalid location.';
      },
    })
    .min(4, 'Location must be at least 4 characters long'),
});
export const addAttendanceDeviceToGroupSchema = z.object({
  deviceId: z
    .string({
      error: (iss) => {
        if (!iss.input) {
          return 'Device ID is required.';
        } else if (typeof iss.input !== iss.expected) {
          return 'Device ID must be a string.';
        }
        return 'Invalid device ID.';
      },
    })
    .min(4, 'Device ID must be at least 4 characters long'),
});

export const createGroupWithAdminSchema = createUserSchema
  .pick({
    first_name: true,
    last_name: true,
    email: true,
    password: true,
  })
  .extend({
    role: z.literal('admin'),
    group_name: z.string().min(2, 'Group name must be at least 2 characters'),
    group_eiin: z.string().min(2, 'Group EIIN must be at least 2 characters'),
    group_description: z
      .string()
      .min(10, 'Group description must be at least 10 characters'),
  });

// Notification schemas
export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(['info', 'warning', 'success', 'error']),
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});

export const sendNoticeSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  devices: z.array(z.string()).min(1, 'Select at least one device'),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
});
// New firmware validation schema
export const firmwareSchema = z.object({
  version: z
    .string()
    .min(1, 'Version is required')
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format x.x.x (e.g., 2.1.0)'),
  description: z.string().min(1, 'Description is required'),
  device_type: z.enum(['clock', 'attendance'], {
    error: (iss) => {
      if (!iss.input) {
        return 'Device type is required.';
      } else if (typeof iss.input !== iss.expected) {
        return 'Device type must be either "clock" or "attendance".';
      }
      return 'Invalid device type.';
    },
  }),
  file: z
    .any()
    .refine((file) => file instanceof File, 'File is required')
    .refine(
      (file) => file?.name?.endsWith('.bin'),
      'Only .bin files are allowed'
    )
    .refine((file) => {
      return file?.size <= 5 * 1024 * 1024;
    }, 'File size must be less than 5 MB'),
});

// New validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum([
    'technical',
    'billing',
    'feature-request',
    'bug-report',
    'other',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const logFilterSchema = z.object({
  level: z.enum(['error', 'warning', 'info']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['timestamp', 'level', 'message']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LogFilterInput = z.infer<typeof logFilterSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type Device = z.infer<typeof deviceSchema>;
export type DeviceUpdate = z.infer<typeof deviceUpdateSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type SendNoticeInput = z.infer<typeof sendNoticeSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type CreateGroupWithAdminInput = z.infer<
  typeof createGroupWithAdminSchema
>;
export type AddDeviceToGroupInput = z.infer<typeof addDeviceToGroupSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type AuthChangePasswordInput = z.infer<typeof authChangePasswordSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type FirmwareFormData = z.infer<typeof firmwareSchema>;
export type AddAttendanceDeviceToGroupInput = z.infer<
  typeof addAttendanceDeviceToGroupSchema
>;
export type CourseInput = z.infer<typeof createCourseSchema>;
