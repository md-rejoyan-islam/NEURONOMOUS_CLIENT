"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

import {
  CreateGroupWithAdminInput,
  createGroupWithAdminSchema,
} from "@/lib/validations";
import { useAddAdminWithGroupMutation } from "@/queries/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../form/input-field";
import PasswordField from "../form/password-field";
import TextField from "../form/text-field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const GroupCreateModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupWithAdminInput>({
    resolver: zodResolver(createGroupWithAdminSchema),
    defaultValues: {
      role: "admin",
    },
  });

  const [addAdminWithGroup] = useAddAdminWithGroupMutation();
  const onSubmit = async (data: CreateGroupWithAdminInput) => {
    try {
      setSaving(true);
      const response = await addAdminWithGroup(data).unwrap();
      console.log(response);

      if (response.success) {
        toast.success("Group Created", {
          description: `Group ${data.group_name} has been created with admin ${data.first_name} ${data.last_name}.`,
        });
        reset();
        setIsCreateModalOpen(false);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      console.log("Error creating group:", error);

      toast.error("Group Creation Failed", {
        description: error?.data?.message || "Invalid email or password.",
      });
    } finally {
      setSaving(false);
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
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Group
      </Button>
      <Dialog open={isCreateModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Create Group with Admin
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
            />

            <TextField
              name="groupDescription"
              placeholder="Brief description of this group..."
              label="Description"
              props={register("group_description")}
              error={errors.group_description?.message}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                placeholder="Enter first name"
                type="text"
                error={errors.first_name?.message}
                props={register("first_name")}
                isOptional={false}
                name="first_name"
                disabled={saving}
              />
              <InputField
                label="Last Name"
                placeholder="Enter last name"
                type="text"
                error={errors.last_name?.message}
                props={register("last_name")}
                isOptional={false}
                name="last_name"
                disabled={saving}
              />
            </div>
            <InputField
              label="Email Address"
              placeholder="Enter admin email"
              type="email"
              error={errors.email?.message}
              props={register("email")}
              isOptional={false}
              disabled={saving}
              name="email"
            />

            <PasswordField
              label="Password"
              placeholder="Enter admin password"
              error={errors.password?.message}
              props={register("password")}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
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
