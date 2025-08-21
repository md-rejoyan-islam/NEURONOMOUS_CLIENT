'use client';

import {
  CreateGroupWithAdminInput,
  createGroupWithAdminSchema,
} from '@/lib/validations';
import { useAddAdminWithGroupMutation } from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import InputField from '../form/input-field';
import PasswordField from '../form/password-field';
import TextField from '../form/text-field';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const GroupCreateModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      reset();
      setIsCreateModalOpen(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Group Creation Failed', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    reset();
  };
  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="w-full sm:w-auto"
      >
        <FolderPlus className="h-4 w-4" />
        Create Group
      </Button>
      <Dialog open={isCreateModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Create Group with Admin
            </DialogTitle>
          </DialogHeader>

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
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupCreateModal;
