'use client';

import InputField from '@/components/form/input-field';
import PasswordField from '@/components/form/password-field';
import TextField from '@/components/form/text-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CreateGroupWithAdminInput,
  createGroupWithAdminSchema,
} from '@/lib/validations';
import { useAddAdminWithGroupMutation } from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const GroupCreate = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupWithAdminInput>({
    resolver: zodResolver(createGroupWithAdminSchema),
    defaultValues: {
      role: 'admin',
    },
  });

  const [addAdminWithGroup, { isLoading }] = useAddAdminWithGroupMutation();
  const onSubmit = async (data: CreateGroupWithAdminInput) => {
    try {
      await addAdminWithGroup(data).unwrap();
      toast.success('Group Created', {
        description: `Group ${data.group_name} has been created with admin ${data.first_name} ${data.last_name}.`,
      });
      router.push('/groups/all');
      reset();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Group Creation Failed', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Plus className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
              Create Group with Admin
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new group and assign an admin to manage it.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Group Name"
            placeholder="Enter group name"
            type="text"
            error={errors.group_name?.message}
            props={register('group_name')}
            isOptional={false}
            name="groupName"
            disabled={isLoading}
          />
          <InputField
            label="Group EIIN"
            placeholder="Enter group EIIN"
            type="text"
            error={errors.group_eiin?.message}
            props={register('group_eiin')}
            isOptional={false}
            name="groupEiin"
            disabled={isLoading}
          />

          <TextField
            name="groupDescription"
            placeholder="Brief description of this group..."
            label="Description"
            props={register('group_description')}
            error={errors.group_description?.message}
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="First Name"
              placeholder="Enter first name"
              type="text"
              error={errors.first_name?.message}
              props={register('first_name')}
              isOptional={false}
              name="first_name"
              disabled={isLoading}
            />
            <InputField
              label="Last Name"
              placeholder="Enter last name"
              type="text"
              error={errors.last_name?.message}
              props={register('last_name')}
              isOptional={false}
              name="last_name"
              disabled={isLoading}
            />
          </div>
          <InputField
            label="Email Address"
            placeholder="Enter admin email"
            type="email"
            error={errors.email?.message}
            props={register('email')}
            isOptional={false}
            disabled={isLoading}
            name="email"
          />

          <PasswordField
            label="Password"
            placeholder="Enter admin password"
            error={errors.password?.message}
            props={register('password')}
            disabled={isLoading}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className={`flex-1`}>
              {isLoading ? (
                <>
                  <FolderPlus className="mr-2 h-4 w-4 animate-pulse" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Group
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GroupCreate;
