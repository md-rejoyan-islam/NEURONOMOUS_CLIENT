"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDevice } from "@/lib/types";
import { UserCreateInput, userCreateSchema } from "@/lib/validations";
import { useAddUserToGroupWithDevicesMutation } from "@/queries/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DeviceAccess from "./create-user/device-access";
import InputField from "./form/input-field";
import PasswordField from "./form/password-field";
import TextField from "./form/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: IDevice[];
  groupId: string;
  groupUserRefetch: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  devices,
  groupId,
  groupUserRefetch,
}: CreateAdminModalProps) {
  const [createUserWithDevices, { isLoading }] =
    useAddUserToGroupWithDevicesMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
  });

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const handleDeviceToggle = (deviceId: string) => {
    // Toggle device selection
    const newSelectedDevices = selectedDevices.includes(deviceId)
      ? selectedDevices.filter((id) => id !== deviceId)
      : [...selectedDevices, deviceId];
    setSelectedDevices(newSelectedDevices);
  };

  const handleSelectAllDevices = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map((device) => device._id) || []);
    }
  };

  const onSubmit = async (data: UserCreateInput) => {
    try {
      if (selectedDevices.length === 0) {
        return toast.error("Validation Error", {
          description:
            "Please select at least one device for the user to control.",
        });
      }
      const payload = {
        ...data,
        phone: data.phone || "",
        notes: data.notes || "",
        deviceIds: selectedDevices,
      };

      const result = await createUserWithDevices({
        id: groupId,
        payload,
      }).unwrap();

      if (result?.success) {
        groupUserRefetch();
        reset();
        onClose();
        toast.success("User Created Successfully", {
          description: `User ${data.first_name} ${data.last_name} has been created and assigned to the group.`,
        });
      }

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error?.data?.message || "Internal server error.",
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-md">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl">Create New Admin</h3>
              <p className="text-xs">Add a new user to control IoT devices</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="lg:grid lg:grid-cols-2 space-y-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="w-5 h-5 text-primary" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="first_name"
                    placeholder="Enter first name"
                    props={{ ...register("first_name") }}
                    error={errors.first_name?.message}
                    disabled={isLoading}
                  />
                  <InputField
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter last name"
                    props={{ ...register("last_name") }}
                    error={errors.last_name?.message}
                    disabled={isLoading}
                  />
                </div>

                <InputField
                  label="Email"
                  placeholder="Enter email address"
                  type="email"
                  name="email"
                  props={{ ...register("email") }}
                  error={errors.email?.message}
                  disabled={isLoading}
                />
                <PasswordField
                  placeholder="Enter password"
                  props={{ ...register("password") }}
                  disabled={isLoading}
                  label="Password"
                  error={errors.password?.message}
                />
                <InputField
                  label="Phone Number"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  error={errors.phone?.message}
                  disabled={isLoading}
                  isOptional={true}
                />

                <TextField
                  label="Notes"
                  placeholder="Enter any notes"
                  {...register("notes")}
                  disabled={isLoading}
                  error={errors.notes?.message}
                />
              </form>
            </CardContent>
          </Card>

          <div>
            <DeviceAccess
              devices={devices || []}
              selectedDevices={selectedDevices}
              handleSelectAllDevices={handleSelectAllDevices}
              handleDeviceToggle={handleDeviceToggle}
            />
          </div>
        </div>

        <div className="max-w-[200px]">
          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2 animate-pulse" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
