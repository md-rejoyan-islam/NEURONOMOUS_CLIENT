import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

import { GroupInput, groupSchema } from '@/lib/validations';
import { useUpdateGroupByIdMutation } from '@/queries/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import InputField from '../form/input-field';
import TextField from '../form/text-field';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const GroupEditModal = ({
  _id,
  name,
  description,
  eiin,
}: {
  eiin: string;
  _id: string;
  name: string;
  description: string;
}) => {
  const [group, setGroup] = useState({ _id, name, description });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GroupInput>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      group_name: name,
      group_description: description,
      group_eiin: eiin,
    },
  });

  const [updateGroupById, { isLoading }] = useUpdateGroupByIdMutation();

  const onSubmit = async (data: GroupInput) => {
    try {
      const response = await updateGroupById({
        id: group._id,
        data: {
          name: data.group_name,
          description: data.group_description,
          eiin: data.group_eiin,
        },
      }).unwrap();
      if (response.success) {
        toast.success('Group Updated', {
          description: `Group ${data.group_name} has been updated successfully.`,
        });
        reset();
        setValue('group_name', data.group_name);
        setValue('group_description', data.group_description);
        setIsModalOpen(false);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Group Update Failed', {
        description: error?.data?.message || 'Failed to update group.',
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setGroup({
      _id: '',
      name: '',
      description: '',
    });
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="bg-primary/5 hover:bg-primary/10 h-8 w-8 p-2 dark:text-white/70 dark:hover:text-white"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Update Group Data
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
              label="Description"
              placeholder="Brief description of this group..."
              props={register('group_description')}
              error={errors.group_description?.message}
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
                    <Plus className="mr-2 h-4 w-4 animate-pulse" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Update Group
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

export default GroupEditModal;
