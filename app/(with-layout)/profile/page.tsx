"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PasswordField from "@/components/form/password-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getRoleColor, getRoleLabel } from "@/lib/helper";
import { IUser } from "@/lib/types";
import {
  AuthChangePasswordInput,
  authChangePasswordSchema,
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations";
import {
  useChangePasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/queries/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  KeyRound,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data } = useProfileQuery();

  const [isOpen, setIsOpen] = useState(false);

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [user] = useState<IUser | null>(data || null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register: changePasswordRegister,
    handleSubmit: handleChangePasswordSubmit,
    formState: { errors: changePasswordErrors },
    reset,
  } = useForm<AuthChangePasswordInput>({
    resolver: zodResolver(authChangePasswordSchema),
  });

  const onChangeSubmit = async (data: AuthChangePasswordInput) => {
    try {
      await changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      }).unwrap();

      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });
      reset();

      setIsOpen(false);
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Password Change Failed", {
        description:
          error?.data?.message ||
          "Failed to change password. Please try again.",
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      notes: user?.notes || "",
    },
  });

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data: ProfileUpdateInput) => {
    if (!user) return;

    const updatedUser: {
      first_name: string;
      last_name: string;
      phone?: string;
      address?: string;
      notes?: string;
    } = {
      first_name: data.first_name,
      last_name: data.last_name,
    };
    if (data.phone) updatedUser.phone = data.phone;
    if (data.address) updatedUser.address = data.address;
    if (data.notes) updatedUser.notes = data.notes;
    setSaving(true);
    try {
      await updateProfile(updatedUser).unwrap();

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
      setMode("view");
      setIsEditing(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Profile Update Failed", {
        description: error?.data?.message || "Internal server error.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
    }
    setIsEditing(false);
    setMode("view");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Actions Menu */}
        <Button
          variant="default"
          className="max-w-xs"
          onClick={() => setIsOpen(true)}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("first_name")}
                  disabled={!isEditing || saving}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("last_name")}
                  disabled={!isEditing || saving}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={!isEditing || saving}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Address</Label>
                <Input
                  id="phone"
                  {...register("address")}
                  disabled={!isEditing || saving}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                {mode === "view" ? (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("edit");
                      setIsEditing(true);
                    }}
                    type="button"
                    className="flex-1"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving ? (
                        <>
                          <Save className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role</span>
              <Badge className={getRoleColor(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Member since:</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Last login:</span>
                <span>{formatDate(user.last_login)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              {`Change Password for ${user.first_name} ${user.last_name}`}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleChangePasswordSubmit(onChangeSubmit)}
            className="space-y-4"
          >
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              error={changePasswordErrors.newPassword?.message}
              props={changePasswordRegister("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              disabled={isLoading}
            />
            <PasswordField
              label="Current Password"
              placeholder="Enter your current password"
              error={changePasswordErrors.currentPassword?.message}
              props={{ ...changePasswordRegister("currentPassword") }}
              disabled={isLoading}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
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
    </div>
  );
}
