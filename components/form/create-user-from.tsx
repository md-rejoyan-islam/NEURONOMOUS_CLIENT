'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IGroupWithPopulatedData } from '@/lib/types';
import { UserCreateInput, userCreateSchema } from '@/lib/validations';
import { useProfileQuery } from '@/queries/auth';
import {
  useAddUserToGroupWithDevicesMutation,
  useGetAllGroupsQuery,
} from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Shield, User, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DeviceAccess from '../create-user/device-access';
import SmallLoading from '../loading/small-loading';
import InputField from './input-field';
import PasswordField from './password-field';
import TextField from './text-field';

const CreateUserFrom = () => {
  const { data: currentUser, isLoading } = useProfileQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
  });

  const { data: groups } = useGetAllGroupsQuery('');
  const [selectedGroup] = useState<IGroupWithPopulatedData | null>(null);

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [creating] = useState(false);
  const router = useRouter();

  const handleGroupSelect = () => {
    // if (group) {
    //   setSelectedGroup(group);
    // }
  };

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAllDevices = () => {
    // if (selectedDevices.length === selectedGroup?.devices.clocks.length) {
    //   setSelectedDevices([]);
    // } else {
    //   setSelectedDevices(
    //     selectedGroup?.devices.clocks.map((device) => device.id) || []
    //   );
    // }
  };

  const [createUserWithDevices] = useAddUserToGroupWithDevicesMutation();

  const onSubmit = async (data: UserCreateInput) => {
    try {
      if (selectedDevices.length === 0) {
        return toast.error('Validation Error', {
          description:
            'Please select at least one device for the user to control.',
        });
      }
      const payload = {
        ...data,
        phone: data.phone || '',
        notes: data.notes || '',
        deviceIds: selectedDevices,
        deviceType: 'clock' as const,
      };

      // const result = await createUserWithDevices({
      //   id: selectedGroup?._id || '',
      //   payload,
      // }).unwrap();

      // if (result?.success) {
      //   toast.success('User Created Successfully', {
      //     description: `User ${data.first_name} ${data.last_name} has been created and assigned to the group ${selectedGroup?.name}.`,
      //   });
      //   router.push('/users');
      // }

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Login Failed', {
        description: error?.data?.message || 'Internal server error.',
      });
    }
  };

  if (!currentUser || currentUser.role !== 'superadmin') {
    return null;
  }

  if (isLoading) {
    return <SmallLoading />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  isOptional={false}
                  error={errors.first_name?.message}
                  props={{ ...register('first_name') }}
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  isOptional={false}
                  error={errors.last_name?.message}
                  props={{ ...register('last_name') }}
                />
              </div>
              <InputField
                name="email"
                label="Email"
                placeholder="Enter email address"
                isOptional={false}
                error={errors.email?.message}
                props={{ ...register('email') }}
              />

              <PasswordField
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
                props={{ ...register('password') }}
              />

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Select Group</Label>
                  <Select
                    onValueChange={() => {
                      handleGroupSelect();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups?.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {group.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <InputField
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  isOptional={true}
                  error={errors.phone?.message}
                  props={{ ...register('phone') }}
                />
              </div>
              <TextField
                name="notes"
                label="Notes"
                placeholder="Additional notes about the user..."
                error={errors.notes?.message}
                props={{ ...register('notes') }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Device Access */}
        <div>
          <DeviceAccess
            // devices={selectedGroup?.devices?.clocks || []}
            devices={[]}
            selectedDevices={selectedDevices}
            handleSelectAllDevices={handleSelectAllDevices}
            handleDeviceToggle={handleDeviceToggle}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/users')}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={creating}
          className="w-full bg-green-600 hover:bg-green-700 sm:w-auto"
        >
          {creating ? (
            <>
              <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
              Creating User...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create User
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserFrom;
