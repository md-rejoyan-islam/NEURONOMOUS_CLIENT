'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Calendar,
  Edit3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { UserUpdateInput, userUpdateSchema } from '@/lib/validations';
import { useProfileQuery } from '@/queries/auth';
import {
  useGiveDeviceAccessToUserMutation,
  useRevolkDeviceAccessFromUserMutation,
} from '@/queries/devices';
import { useGetAllGroupDevicesQuery } from '@/queries/group';
import { useGetUserByIdQuery } from '@/queries/users';
import Link from 'next/link';
import { toast } from 'sonner';
const isUpdating = false; // Placeholder for update state, replace with actual mutation state

// Mock devices data
const mockDevices = [
  {
    id: 'device-001',
    name: 'Conference Room Display',
    location: 'Conference Room A',
    status: 'online',
    type: 'Display',
  },
  {
    id: 'device-002',
    name: 'Lobby Information Board',
    location: 'Main Lobby',
    status: 'online',
    type: 'Display',
  },
  {
    id: 'device-003',
    name: 'Break Room Monitor',
    location: 'Break Room',
    status: 'offline',
    type: 'Display',
  },
  {
    id: 'device-004',
    name: 'Reception Desk Screen',
    location: 'Reception',
    status: 'maintenance',
    type: 'Display',
  },
  {
    id: 'device-005',
    name: 'Training Room Display',
    location: 'Training Room B',
    status: 'online',
    type: 'Display',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-red-500';
    case 'maintenance':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <Wifi className="h-4 w-4" />;
    case 'offline':
      return <WifiOff className="h-4 w-4" />;
    case 'maintenance':
      return <Settings className="h-4 w-4" />;
    default:
      return <XCircle className="h-4 w-4" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'superAdmin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'admin':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'user':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function SingleUserPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deviceAccess, setDeviceAccess] = useState<string[]>([]);
  const { data: authUser } = useProfileQuery();

  const userId = params.id as string;
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  const { data: devices, refetch: refetchDevices } = useGetAllGroupDevicesQuery(
    user?.group || '',
    {
      skip: user?.role !== 'user' || !user?.group,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
  });

  console.log('user', user); // Debugging line, can be removed later
  console.log('devices', devices); // Debugging line, can be removed later

  const [giveDeviceAccessToUsers] = useGiveDeviceAccessToUserMutation();

  const onSubmit = async (data: UserUpdateInput) => {
    try {
      //   await updateUser({
      //     userId,
      //     data: {
      //       ...data,
      //       deviceAccess,
      //     },
      //   }).unwrap();

      toast.success('User updated', {
        description: 'User information has been updated successfully.',
      });
      setIsEditing(false);
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update failed', {
        description:
          error?.data?.message || 'Failed to update user information.',
      });
    }
  };

  const [revolkDeviceAccess] = useRevolkDeviceAccessFromUserMutation();

  const handleDeviceAccessToggle = async (id: string, status: boolean) => {
    if (!authUser) return null;
    if (!user) return null;
    try {
      if (status) {
        await revolkDeviceAccess({
          userId: authUser?._id,
          deviceId: id,
        }).unwrap();
        toast.success('Device Access Revoked', {
          description: 'User access to the device has been revoked.',
        });
      } else {
        await giveDeviceAccessToUsers({
          userIds: [user?._id],
          deviceId: id,
        }).unwrap();
        toast.success('Device Access Granted', {
          description: 'User access to the device has been granted.',
        });
      }

      refetchDevices();

      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Error revoking access:', error);
      toast.error('Failed to revoke access', {
        description: error?.data?.message || 'Failed to revoke device access.',
      });
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
      setDeviceAccess(user.allowed_devices || []);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6">
        <div className="py-12 text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const accessibleDevices = mockDevices.filter(
    (device) => deviceAccess.includes(device.id) || deviceAccess.includes('all')
  );
  const onlineDevices = accessibleDevices.filter(
    (device) => device.status === 'online'
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-muted-foreground">
              Manage user information and device access
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <CardTitle className="text-2xl">
                      {user.first_name} {user.last_name}
                    </CardTitle>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge
                      variant={
                        user.status === 'active' ? 'default' : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register('first_name')}
                      disabled={!isEditing}
                      value={user.first_name}
                      className={errors.first_name ? 'border-red-500' : ''}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-500">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register('last_name')}
                      disabled={!isEditing}
                      className={errors.last_name ? 'border-red-500' : ''}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-500">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled={!isEditing}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </form>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {user.phone || 'No phone number'}
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Access */}
          {user.role === 'user' && (
            <Card>
              <CardHeader>
                <CardTitle>Device Access</CardTitle>
                <CardDescription>
                  Manage which devices this user can access and control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices?.map((device) => (
                    <div
                      key={device._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${getStatusColor(
                            device.status
                          )}`}
                        />
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3" />
                            {device.location}
                            <span className="mx-1">•</span>
                            {getStatusIcon(device.status)}
                            <span className="capitalize">{device.status}</span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        className="cursor-pointer"
                        checked={device.allowed_users.includes(user._id)}
                        onCheckedChange={() =>
                          handleDeviceAccessToggle(
                            device._id,
                            device.allowed_users.includes(user._id)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Devices
                </span>
                <span className="font-medium">{mockDevices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Accessible
                </span>
                <span className="font-medium">{accessibleDevices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Online</span>
                <span className="font-medium text-green-600">
                  {onlineDevices.length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Last Login
                </span>
                <span className="text-sm">
                  {new Date(user.last_login).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">Logged in</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    2h ago
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">
                    Updated device settings
                  </span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    1d ago
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-muted-foreground">Profile updated</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    3d ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
