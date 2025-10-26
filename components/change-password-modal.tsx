"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations";

import { useChangeUserPasswordByIdMutation } from "@/queries/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PasswordField from "./form/password-field";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName?: string;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}: ChangePasswordModalProps) {
  const [changePassword, { isLoading }] = useChangeUserPasswordByIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword({
        newPassword: data.newPassword,
        userId: targetUserId,
      }).unwrap();

      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });

      handleClose();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Password Change Failed", {
        description:
          error?.data?.message ||
          "Failed to change password. Please try again.",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {`Change Password for ${targetUserName}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordField
            label="New Password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            props={register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            disabled={isLoading}
          />
          <PasswordField
            label="Confirm New Password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            props={register("confirmPassword", {
              required: "Please confirm your new password",
              // validate: (value) =>
              //   value === watch('newPassword') || 'Passwords do not match',
            })}
            disabled={isLoading}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <KeyRound className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
