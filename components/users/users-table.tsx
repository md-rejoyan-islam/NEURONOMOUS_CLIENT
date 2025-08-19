'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRoleColor, getStatusColor } from '@/lib/helper';
import { IUser } from '@/lib/types';
import { useProfileQuery } from '@/queries/auth';
import {
  useBanUserByIdMutation,
  useDeleteUserMutation,
  useUnbanUserByIdMutation,
} from '@/queries/users';
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
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChangePasswordModal } from '../change-password-modal';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

const UsersTable = ({
  users = [],
  refetch,
}: {
  users: IUser[];
  refetch?: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
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
    newStatus: 'active' | 'inactive'
  ) => {
    try {
      if (newStatus === 'inactive') {
        await banUserById(userId).unwrap();
      } else {
        await unbanUserById(userId).unwrap();
      }

      const user = users.find((u) => u._id === userId);
      toast.success('User Status Updated', {
        description: `${user?.first_name} ${user?.last_name} has been ${
          newStatus === 'active' ? 'activated' : 'banned'
        }.`,
      });
      refetch?.();
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Update Failed', {
        description: error?.data?.message || 'Failed to update user status.',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser._id).unwrap();
      toast.success('User Deleted', {
        description: `${deletingUser.first_name} ${deletingUser.last_name} has been deleted.`,
      });
      setDeletingUser(null);
      refetch?.();
      setFilteredUsers((prev) =>
        prev.filter((user) => user._id !== deletingUser?._id)
      );
      // eslint-disable-next-line
    } catch (error: any) {
      toast('Delete Failed', {
        description: error?.data?.message || 'Failed to delete user.',
      });
    }
  };

  const handleChangePassword = (user: IUser) => {
    setSelectedUser(user);
    setIsChangePasswordModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              All Users
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 overflow-x-auto">
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
                        <Link href={`/users/${user._id}`}>
                          {user.first_name} {user.last_name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <Shield className="mr-1 h-3 w-3" />
                          {user.role === 'superadmin'
                            ? 'Super Admin'
                            : user.role === 'admin'
                              ? 'Admin'
                              : 'User'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
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
                              <KeyRound className="mr-2 h-4 w-4" />
                              Change Password
                            </DropdownMenuItem>
                            {user.status === 'active' ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user._id, 'inactive')
                                }
                                className="cursor-pointer text-red-600"
                                disabled={
                                  user.role === 'superadmin' ||
                                  (user.role === 'admin' &&
                                    currentUser?.role !== 'superadmin')
                                }
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user._id, 'active')
                                }
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
                                user.role === 'superadmin' ||
                                user.role === 'admin'
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
            <div className="py-12 text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Try adjusting your search terms.'
                  : 'No users available.'}
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
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Are you sure you want to delete{' '}
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
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTable;
