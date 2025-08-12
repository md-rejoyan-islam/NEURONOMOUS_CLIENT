"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminSchema, type CreateAdminInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line
  onAdminCreated?: (admin: any) => void;
}

export function CreateAdminModal({
  isOpen,
  onClose,
  onAdminCreated,
}: CreateAdminModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = async (data: CreateAdminInput) => {
    setCreating(true);

    // Mock API call to create admin
    setTimeout(() => {
      const newAdmin = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "admin" as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: "active" as const,
        groupName: data.groupName || undefined,
      };

      toast.success("Admin Created", {
        description: `Admin account for ${data.firstName} ${data.lastName} has been created successfully.`,
      });

      // Call the callback if provided
      if (onAdminCreated) {
        onAdminCreated(newAdmin);
      }

      handleClose();
      setCreating(false);
    }, 1000);
  };

  const handleClose = () => {
    if (!creating) {
      reset();
      setShowPassword(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Create New Admin
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                {...register("firstName")}
                disabled={creating}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                {...register("lastName")}
                disabled={creating}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              disabled={creating}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., IT Department, Operations, Support"
              {...register("groupName")}
              disabled={creating}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Assign the admin to a specific group or department
            </p>
            {errors.groupName && (
              <p className="text-sm text-red-600">{errors.groupName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                disabled={creating}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={creating}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {creating ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2 animate-pulse" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Admin
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
