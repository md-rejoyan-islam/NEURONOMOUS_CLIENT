"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRoleColor, getStatusColor } from "@/lib/helper";
import { IUser } from "@/lib/types";
import { useProfileQuery } from "@/queries/auth";
import {
  useBanUserByIdMutation,
  useDeleteUserMutation,
  useUnbanUserByIdMutation,
} from "@/queries/users";
import {
  AlertTriangle,
  KeyRound,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChangePasswordModal } from "../change-password-modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

const UsersTable = ({
  users = [],
  refetch,
}: {
  users: IUser[];
  refetch?: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>(users);

  const { data: currentUser } = useProfileQuery();

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

  const [deleteUser] = useDeleteUserMutation();
  const [banUserById] = useBanUserByIdMutation();
  const [unbanUserById] = useUnbanUserByIdMutation();

  const handleStatusChange = async (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      if (newStatus === "inactive") {
        await banUserById(userId).unwrap();
      } else {
        await unbanUserById(userId).unwrap();
      }

      const user = users.find((u) => u._id === userId);
      toast.success("User Status Updated", {
        description: `${user?.first_name} ${user?.last_name} has been ${
          newStatus === "active" ? "activated" : "banned"
        }.`,
      });
      refetch?.();
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
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
      setFilteredUsers((prev) =>
        prev.filter((user) => user._id !== deletingUser?._id)
      );
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

  const filterUsers = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredUsers(users);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.first_name.toLowerCase().includes(lowerTerm) ||
        user.last_name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        user.role.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredUsers(filtered);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Users
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => filterUsers(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>

                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Last Login
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role === "superadmin"
                            ? "Super Admin"
                            : user.role === "admin"
                            ? "Admin"
                            : "User"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                        {formatDate(user.last_login)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* {canManageUser(user) && ( */}
                        <DropdownMenu>
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
                              <KeyRound className="w-4 h-4 mr-2" />
                              Change Password
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user._id, "inactive")
                                }
                                className="text-red-600 cursor-pointer"
                                disabled={
                                  user.role === "superadmin" ||
                                  (user.role === "admin" &&
                                    currentUser?.role !== "superadmin")
                                }
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user._id, "active")
                                }
                                className="text-green-600 cursor-pointer"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeletingUser(user)}
                              className="text-red-600 cursor-pointer"
                              disabled={
                                user.role === "superadmin" ||
                                user.role === "admin"
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* )} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "No users available."}
              </p>
            </div>
          )}
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
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
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
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTable;
