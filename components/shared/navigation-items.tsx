import {
  Bell,
  CircleQuestionMark,
  Cpu,
  FileChartColumn,
  FileText,
  HardDrive,
  Layers,
  LayoutDashboard,
  User,
  UserCheck,
  Users,
  UserStar,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    name: 'Groups',
    href: '/groups',
    icon: Layers,
    roles: ['superadmin'],
  },
  {
    name: 'Devices',
    href: '/devices',
    icon: Cpu,
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: FileChartColumn,
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    name: 'Students Overview',
    href: '/students-overview',
    icon: UserStar,
    roles: ['superadmin', 'admin'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['superadmin', 'admin'],
  },
  {
    name: 'Firmware',
    href: '/firmware',
    icon: HardDrive,
    roles: ['superadmin'],
  },
  {
    name: 'Create User',
    href: '/create-user',
    icon: UserCheck,
    roles: ['superadmin'],
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    name: 'System Logs',
    href: '/system-logs',
    icon: FileText,
    roles: ['superadmin'],
  },
  {
    name: 'Support',
    href: '/support',
    icon: CircleQuestionMark,
    roles: ['superadmin'],
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['superadmin', 'admin', 'user'],
  },
];

export default navigationItems;
