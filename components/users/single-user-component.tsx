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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Edit3, Mail, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import InputField from '@/components/form/input-field';
import TextField from '@/components/form/text-field';
import UserSkeleton from '@/components/loading/user-skeleton';
import { Textarea } from '@/components/ui/textarea';
import UserDeviceAccess from '@/components/users/user-device-access';
import { getRoleColor } from '@/lib/helper';
import { UserUpdateInput, userUpdateSchema } from '@/lib/validations';
import { useGetAllGroupDevicesQuery } from '@/queries/group';
import {
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} from '@/queries/users';
import clsx from 'clsx';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SingleUserComponent({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  const [updateUserById, { isLoading: isUpdateLoading }] =
    useUpdateUserByIdMutation();

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

  const onSubmit = async (data: UserUpdateInput) => {
    try {
      await updateUserById({
        userId,
        data,
      }).unwrap();

      toast.success('User updated', {
        description: 'User information has been updated successfully.',
      });
      setIsOpen(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update failed', {
        description:
          error?.data?.message || 'Failed to update user information.',
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  useEffect(() => {
    if (user) {
      reset({
        ...user,
      });
    }
  }, [user, reset]);

  if (isLoading) {
    return <UserSkeleton />;
  }

  if (error) {
    throw new Error(`Failed to fetch user`);
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
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
            <Button onClick={() => setIsOpen(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </div>
        </div>

        <div
          className={clsx(
            'grid grid-cols-1 gap-6',
            user?.role === 'user' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
          )}
        >
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* User Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {user?.first_name[0]}
                      {user?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <CardTitle className="text-2xl">
                        {user?.first_name} {user?.last_name}
                      </CardTitle>
                      <Badge className={getRoleColor(user?.role || 'user')}>
                        {user?.role}
                      </Badge>
                      <Badge
                        variant={
                          user?.status === 'active' ? 'default' : 'destructive'
                        }
                      >
                        {user?.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" disabled value={user?.first_name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" disabled value={user?.last_name} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      disabled
                      value={user?.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      disabled
                      value={user?.address || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any notes"
                      value={user?.notes || ''}
                      disabled
                      className="h-24"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {user?.phone || 'No phone number'}
                  </div>

                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Joined{' '}
                    {new Date(user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {user?.role === 'user' && (
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
                    <span className="font-medium">{devices?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Accessible
                    </span>
                    <span className="font-medium">
                      {devices?.reduce(
                        (count, device) =>
                          device?.allowed_users?.includes(user?._id || '')
                            ? count + 1
                            : count,
                        0
                      ) || 0}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Last Login
                    </span>
                    <span className="text-sm">
                      {new Date(user?.last_login || '').toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <UserDeviceAccess
                devices={devices || []}
                userId={user?._id || ''}
                refetchDevices={refetchDevices}
              />
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pb-3">
              <div className="rounded-md bg-green-500 p-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Update User Information</h3>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="first_name"
                  placeholder="Enter first name"
                  props={{ ...register('first_name') }}
                  error={errors.first_name?.message}
                  disabled={isLoading}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter last name"
                  props={{ ...register('last_name') }}
                  error={errors.last_name?.message}
                  disabled={isLoading}
                />
              </div>

              <InputField
                label="Email"
                placeholder="Enter email address"
                type="email"
                name="email"
                props={{ ...register('email') }}
                error={errors.email?.message}
                disabled={isLoading}
              />
              <InputField
                label="Address"
                placeholder="Enter your addres"
                name="address"
                props={{ ...register('address') }}
                error={errors.address?.message}
                isOptional={true}
                disabled={isLoading}
              />

              <InputField
                label="Phone Number"
                name="phone"
                placeholder="Enter phone number"
                props={{ ...register('phone') }}
                error={errors.phone?.message}
                disabled={isLoading}
                isOptional={true}
              />

              <TextField
                label="Notes"
                name="notes"
                placeholder="Enter any notes"
                props={{ ...register('notes') }}
                disabled={isLoading}
                error={errors.notes?.message}
              />
            </form>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              {isUpdateLoading ? (
                <>
                  <User className="mr-2 h-4 w-4 animate-pulse" />
                  Updating...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
