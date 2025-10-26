"use client";
import { ChangePasswordModal } from "@/components/change-password-modal";
import InputField from "@/components/form/input-field";
import PasswordField from "@/components/form/password-field";
import TextField from "@/components/form/text-field";
import NormalTable from "@/components/table/normal-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getRoleColor, getStatusColor } from "@/lib/helper";
import { IUser } from "@/lib/types";
import { UserCreateInput, userCreateSchema } from "@/lib/validations";
import { useProfileQuery } from "@/queries/auth";
import {
  useAddUserToGroupMutation,
  useGetAllUsersInGroupQuery,
} from "@/queries/group";
import {
  useBanUserByIdMutation,
  useDeleteUserMutation,
  useUnbanUserByIdMutation,
} from "@/queries/users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  KeyRound,
  Mail,
  MoreHorizontal,
  Shield,
  TabletsIcon,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const GroupUsers = ({
  _id,
  page,
  search,
  limit,
}: {
  _id: string;
  page: string;
  search: string;
  limit: string;
}) => {
  const [createUserModalOpen, setCreateUserModalOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: currentUser } = useProfileQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
  });

  const {
    data: group,
    refetch,
    isLoading: isUserLoading,
  } = useGetAllUsersInGroupQuery(
    {
      id: _id,
      query: `page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
    },
    {
      skip: !_id,
    },
  );
  const users = group?.members || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const query = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      query.set("search", value);
    } else {
      query.delete("search");
    }
    query.delete("page");
    const timer = setTimeout(() => {
      router.push(`${window.location.pathname}?${query.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  };

  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();
  const [banUserById, { isLoading: isBanLoading }] = useBanUserByIdMutation();
  const [unbanUserById, { isLoading: isUnbanLoading }] =
    useUnbanUserByIdMutation();
  const [addUserToGroup, { isLoading: isAddUserLoading }] =
    useAddUserToGroupMutation();

  const onCreareUserSubmit = async (data: UserCreateInput) => {
    try {
      await addUserToGroup({
        id: String(_id),
        payload: {
          ...data,
        },
      }).unwrap();

      toast.success("User Created", {
        description: `User ${data.first_name} ${data.last_name} has been created successfully.`,
      });
      setCreateUserModalOpen(false);
      reset();
      //    refetch?.();

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Failed to create user", {
        description: error?.data?.message || "Invalid input data.",
      });
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "active" | "inactive",
  ) => {
    try {
      if (newStatus === "inactive") {
        await banUserById(userId).unwrap();
      } else {
        await unbanUserById(userId).unwrap();
      }

      const user = users?.find((u) => u._id === userId);
      toast.success("User Status Updated", {
        description: `${user?.first_name} ${user?.last_name} has been ${
          newStatus === "active" ? "activated" : "banned"
        }.`,
      });
      refetch?.();
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error?.data?.message || "Failed to update user status.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser._id).unwrap();
      toast.success("User Deleted", {
        description: `${deletingUser.first_name} ${deletingUser.last_name} has been deleted.`,
      });
      setDeletingUser(null);
      refetch?.();
      //   setFilteredUsers((prev) =>
      //     prev.filter((user) => user._id !== deletingUser?._id)
      //   );
      // eslint-disable-next-line
    } catch (error: any) {
      toast("Delete Failed", {
        description: error?.data?.message || "Failed to delete user.",
      });
    }
  };

  const handleChangePassword = (user: IUser) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <TabletsIcon className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
          Group Users
        </h1>
        <div className="flex gap-2">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setCreateUserModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      <Card className="py-3 shadow-xs">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Total Users: {users.length}</h2>
            <div>
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <NormalTable
            headers={[
              "#",
              "Name",
              "Email",
              "Role",
              "Status",
              "CreatedAt",
              "Last Login",
              "Actions",
            ]}
            isLoading={isUserLoading}
            noDataMessage="No users found."
            data={users?.map((user, index) => [
              index + 1,
              <Link href={`/users/${user._id}`} key={"link"}>
                {user.first_name} {user.last_name}
              </Link>,
              <div className="flex items-center gap-2" key={user.email}>
                <Mail className="text-muted-foreground h-4 w-4" />
                {user.email}
              </div>,
              <Badge
                className={getRoleColor(user.role)}
                key={"role-" + user._id}
              >
                <Shield className="mr-1 h-3 w-3" />
                {user.role === "superadmin"
                  ? "Super Admin"
                  : user.role === "admin"
                    ? "Admin"
                    : "User"}
              </Badge>,
              <Badge
                className={getStatusColor(user.status)}
                key={"status-" + user._id}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>,

              formatDate(user.last_login),
              formatDate(user.createdAt),

              <DropdownMenu key={"dropdown-" + user._id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleChangePassword(user)}
                    className="cursor-pointer"
                    disabled={user._id === currentUser?._id}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>
                  {user.status === "active" ? (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user._id, "inactive")}
                      className="cursor-pointer text-red-600"
                      disabled={
                        user.role === "superadmin" ||
                        (user.role === "admin" &&
                          currentUser?.role !== "superadmin")
                      }
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Ban User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user._id, "active")}
                      className="cursor-pointer text-green-600"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setDeletingUser(user)}
                    className="cursor-pointer text-red-600"
                    disabled={
                      user.role === "superadmin" || user.role === "admin"
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>,
            ])}
            currentPage={group?.pagination.page || 1}
            itemsPerPage={group?.pagination.limit || 10}
            limitOptions={[10, 20, 30, 50]}
            totalItems={group?.pagination.items || 0}
          />
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => {
          setIsChangePasswordModalOpen(false);
          setSelectedUser(null);
        }}
        targetUserId={selectedUser?._id as string}
        targetUserName={`${selectedUser?.first_name} ${selectedUser?.last_name}`}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Are you sure you want to delete{" "}
              <strong>
                {deletingUser?.first_name} {deletingUser?.last_name}
              </strong>
              ? This action cannot be undone and will permanently remove the
              user from the system.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleteLoading || isBanLoading || isUnbanLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* groups details  */}

      <Dialog
        open={createUserModalOpen}
        onOpenChange={() => setCreateUserModalOpen(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              Create New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreareUserSubmit)}>
            <div className="mt-4 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  isOptional={false}
                  error={errors.first_name?.message}
                  props={{ ...register("first_name") }}
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  isOptional={false}
                  error={errors.last_name?.message}
                  props={{ ...register("last_name") }}
                />
              </div>
              <InputField
                name="email"
                label="Email"
                placeholder="Enter email address"
                isOptional={false}
                error={errors.email?.message}
                props={{ ...register("email") }}
              />

              <PasswordField
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
                props={{ ...register("password") }}
              />

              <InputField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                isOptional={true}
                error={errors.phone?.message}
                props={{ ...register("phone") }}
              />

              <TextField
                name="notes"
                label="Notes"
                placeholder="Additional notes about the user..."
                error={errors.notes?.message}
                props={{ ...register("notes") }}
              />
            </div>
            <DialogFooter className="mt-3">
              <Button
                className="w-full"
                type="submit"
                disabled={isAddUserLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isAddUserLoading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupUsers;
