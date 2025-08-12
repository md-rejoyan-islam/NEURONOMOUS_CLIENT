import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

import { GroupInput, groupSchema } from "@/lib/validations";
import { useUpdateGroupByIdMutation } from "@/queries/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../form/input-field";
import TextField from "../form/text-field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const GroupEditModal = ({
  _id,
  name,
  description,
}: {
  _id: string;
  name: string;
  description: string;
}) => {
  const [group, setGroup] = useState({ _id, name, description });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
    },
  });

  const [updateGroupById] = useUpdateGroupByIdMutation();

  const onSubmit = async (data: GroupInput) => {
    try {
      setSaving(true);
      const response = await updateGroupById({
        id: group._id,
        data: {
          name: data.group_name,
          description: data.group_description,
        },
      }).unwrap();
      if (response.success) {
        toast.success("Group Updated", {
          description: `Group ${data.group_name} has been updated successfully.`,
        });
        reset();
        setValue("group_name", data.group_name);
        setValue("group_description", data.group_description);
        setIsModalOpen(false);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Group Update Failed", {
        description: error?.data?.message || "Failed to update group.",
      });
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setGroup({
      _id: "",
      name: "",
      description: "",
    });
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Edit className="w-4 h-4" />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Update Group Data
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              label="Group Name"
              placeholder="Enter group name"
              type="text"
              error={errors.group_name?.message}
              props={register("group_name")}
              isOptional={false}
              name="groupName"
              disabled={saving}
            />

            <TextField
              name="groupDescription"
              label="Description"
              placeholder="Brief description of this group..."
              props={register("group_description")}
              error={errors.group_description?.message}
              disabled={saving}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={`flex-1 bg-green-600 hover:bg-green-700`}
              >
                {saving ? (
                  <>
                    <Plus className="w-4 h-4 mr-2 animate-pulse" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
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
