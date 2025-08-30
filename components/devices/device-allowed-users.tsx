import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetAllowedUsersForDeviceQuery,
  useGiveDeviceAccessToUserMutation,
  useRevolkDeviceAccessFromUserMutation,
} from '@/queries/devices';
import { useGetAllUsersInGroupQuery } from '@/queries/group';
import { AlertTriangle, KeyRound, LogOut, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeviceAllowedUsers = ({ id, group }: { id: string; group?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: allowedUsers, refetch: refetchAllowUsers } =
    useGetAllowedUsersForDeviceQuery({ id });

  const [revolkDeviceAccess] = useRevolkDeviceAccessFromUserMutation();
  const handleRevokeAccess = async (userId: string) => {
    try {
      await revolkDeviceAccess({ userId, deviceId: id }).unwrap();
      toast.success('Device Access Revoked', {
        description: 'User access to the device has been revoked.',
      });
      refetchAllowUsers();
      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Error revoking access:', error);
      toast.error('Failed to revoke access', {
        description: error?.data?.message || 'Failed to revoke device access.',
      });
    }
  };
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const [giveDeviceAccess, { isLoading }] = useGiveDeviceAccessToUserMutation();
  const handleAddUserToDevice = async () => {
    try {
      await giveDeviceAccess({ userIds: selectedUsers, deviceId: id }).unwrap();
      toast.success('Device Access Granted', {
        description: 'Selected users have been granted access to the device.',
      });
      setSelectedUsers([]);
      setIsOpen(false);
      refetchAllowUsers();

      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Error creating group:', error);

      toast.error('Failed to add device', {
        description: error?.data?.message || 'Invalid email or password.',
      });
    }
  };
  const { data: groupMembers } = useGetAllUsersInGroupQuery(group || '') || [];

  const withoutAccessUsers =
    groupMembers?.filter(
      (user) =>
        !allowedUsers?.some((u) => u._id === user._id) && user.role !== 'admin'
    ) || [];
  return (
    <>
      {allowedUsers && allowedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="text-primary h-5 w-5" />
                Allowed Users
              </div>
              <Button
                variant="default"
                className="text-sm"
                onClick={() => setIsOpen(true)}
              >
                Add Allowed User
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 overflow-x-auto">
              <div className="min-w-[800px]">
                {(allowedUsers?.length ?? 0) > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Name
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>

                        <TableHead className="hidden md:table-cell">
                          Revoke Access
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allowedUsers?.map((user, index) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{index + 1}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {user?.first_name} {user?.last_name}
                          </TableCell>
                          <TableCell>{user?.email}</TableCell>
                          <TableCell>{user?.role}</TableCell>

                          <TableCell
                            className="text-muted-foreground hidden text-sm md:table-cell"
                            // title="Remove User from Allowed List"
                          >
                            <button
                              disabled={user.role === 'admin'}
                              onClick={() => handleRevokeAccess(user._id)}
                              className="cursor-pointer text-red-500 hover:text-red-600 disabled:cursor-default disabled:text-red-200"
                            >
                              <LogOut className="h-5 w-5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center">
                    <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                    <h3 className="mb-2 text-lg font-medium">
                      No Allowed Users
                    </h3>
                    <p className="text-muted-foreground">
                      There are currently no users allowed to access this
                      device.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Add New Allowed User
            </DialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4">
            <Label className="text-muted-foreground text-sm font-medium">
              Select User
            </Label>
            {withoutAccessUsers.length ? (
              withoutAccessUsers?.map((user) => (
                <div key={user._id} className="space-y-2">
                  <div className="flex items-start space-x-3 rounded-lg border p-3">
                    <Checkbox
                      id={user._id}
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => handleUserToggle(user._id)}
                    />
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={user._id} className="cursor-pointer">
                        <div className="text-sm font-medium">
                          {user.first_name + ' ' + user.last_name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {user.email}
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-medium">No Users Available</h3>
                <p className="text-muted-foreground">
                  There are no users available to add to this device.
                </p>
              </div>
            )}

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
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  withoutAccessUsers.length === 0 || selectedUsers.length === 0
                }
                onClick={handleAddUserToDevice}
              >
                {isLoading ? (
                  <>
                    <KeyRound className="mr-2 h-4 w-4 animate-spin" />
                    Adding User...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Add User
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceAllowedUsers;
