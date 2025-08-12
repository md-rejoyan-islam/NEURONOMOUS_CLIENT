"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations";
import { useResetPasswordMutation } from "@/queries/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PasswordField from "./password-field";
const ResetPasswordForm = ({
  setStep,
  email,
}: {
  setStep: (step: "email" | "code" | "success") => void;
  email: string;
}) => {
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: ResetPasswordInput) => {
    try {
      await resetPassword({
        email,
        resetCode: +data.resetCode,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password Reset Successful", {
        description: "Your password has been reset successfully.",
      });

      setStep("success");
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Reset Failed", {
        description:
          error?.data?.message || "Invalid reset code. Please try again.",
      });
    }
  };
  const handleBackToEmail = () => {
    setStep("email");
    resetForm.reset();
  };
  return (
    <form
      onSubmit={resetForm.handleSubmit(handleResetPassword)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="code">Reset Code</Label>
        <Input
          id="code"
          type="text"
          placeholder="Enter 7-digit code"
          {...resetForm.register("resetCode")}
          maxLength={7}
          disabled={isResettingPassword}
        />
        <p className="text-xs text-muted-foreground">Code sent to: {email}</p>
        {resetForm.formState.errors.resetCode && (
          <p className="text-sm text-red-600">
            {resetForm.formState.errors.resetCode.message}
          </p>
        )}
      </div>
      <PasswordField
        label="New Password"
        placeholder="Enter your new password"
        error={resetForm.formState.errors.newPassword?.message}
        props={resetForm.register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        disabled={isResettingPassword}
      />

      <PasswordField
        label="Confirm New Password"
        error={resetForm.formState.errors.confirmPassword?.message}
        placeholder="Confirm your new password"
        props={resetForm.register("confirmPassword", {
          required: "Please confirm your new password",
          validate: (value) =>
            value === resetForm.getValues("newPassword") ||
            "Passwords do not match",
        })}
        disabled={isResettingPassword}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackToEmail}
          className="flex-1"
          disabled={isResettingPassword}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isResettingPassword}>
          {isResettingPassword ? (
            <>
              <KeyRound className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
