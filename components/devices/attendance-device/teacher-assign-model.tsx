import InputField from "@/components/form/input-field";
import PasswordField from "@/components/form/password-field";
import TextField from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCreateInput, userCreateSchema } from "@/lib/validations";
import {
  useAddUserToGroupWithDevicesMutation,
  useGetAllUsersInGroupQuery,
  useGiveDevicesPermissionToUserMutation,
} from "@/queries/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const TeacherAssignModel = ({
  isLoading,
  groupId,
  deviceId,
  refetch,
}: {
  isLoading: boolean;
  groupId: string;
  deviceId: string;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const { data: groupUsers } = useGetAllUsersInGroupQuery(
    {
      id: groupId,
      query: "limit=1000",
    },
    {
      skip: !groupId,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
  });

  const users = groupUsers?.members.filter((user) => user.role !== "admin");
  const [createUserWithDevices] = useAddUserToGroupWithDevicesMutation();
  const [giveDevicePermission] = useGiveDevicesPermissionToUserMutation();

  const onSubmit = async (data: UserCreateInput) => {
    // Handle form submission logic here

    try {
      const result = await createUserWithDevices({
        id: groupId,
        payload: {
          ...data,

          devices: [
            {
              deviceType: "attendance",
              deviceIds: [deviceId],
            },
          ],
        },
      }).unwrap();
      if (result.success) {
        setOpen(false);
        toast.success("Teacher created & Assigned", {
          description: `Teacher has been assigned successfully.`,
        });
        setOpen(false);
        reset();
        refetch?.();
      }
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Failed to assign teacher", {
        description: error?.data?.message || "Invalid email or password.",
      });
    }
  };

  const [teacherId, setTeacherId] = useState<string | null>(null);

  const handleAssignTeacher = async () => {
    if (!teacherId) {
      return toast.error("Please select a teacher to assign", {
        description: "No teacher selected.",
      });
    }
    const teacher = users?.find((user) => user._id === teacherId);
    if (!teacher) {
      return toast.error("Selected teacher not found", {
        description: "Please select a valid teacher.",
      });
    }

    try {
      await giveDevicePermission({
        id: groupId,
        payload: {
          userId: teacherId,
          deviceType: "attendance",
          deviceIds: [deviceId],
        },
      }).unwrap();
      refetch?.();

      toast.success("Teacher Assigned", {
        description: `Teacher has been assigned successfully.`,
      });
      setOpen(false);

      // eslint-disable-next-line
    } catch (error: any) {
      toast.error("Failed to assign teacher", {
        description: error?.data?.message || "Invalid email or password.",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setTeacherId(null);
  };

  return (
    <div>
      <Button disabled={isLoading} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Assign Teacher
      </Button>
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Assign Teacher to Device
            </DialogTitle>
            <DialogDescription>
              Assign a teacher to manage this attendance device.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="new">
            <TabsList className="w-full">
              <TabsTrigger value="new" className="w-full">
                Create New
              </TabsTrigger>
              <TabsTrigger value="existing" className="w-full">
                Assign Existing
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <form
                className="space-y-4 py-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 gap-3 space-y-2 sm:grid-cols-2">
                  <InputField
                    label="First Name"
                    placeholder="Enter first name"
                    name="firstName"
                    error={errors.first_name?.message}
                    isOptional={false}
                    props={{
                      ...register("first_name"),
                    }}
                    type="text"
                  />
                  <InputField
                    label="Last Name"
                    placeholder="Enter last name"
                    name="lastName"
                    error={errors.last_name?.message}
                    isOptional={false}
                    props={{
                      ...register("last_name"),
                    }}
                    type="text"
                  />
                </div>

                <InputField
                  label="Email"
                  placeholder="Enter email address"
                  name="email"
                  error={errors.email?.message}
                  isOptional={false}
                  props={{
                    ...register("email"),
                  }}
                  type="text"
                />
                <PasswordField
                  label="Password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                  props={{
                    ...register("password"),
                  }}
                />
                <InputField
                  label="Phone Number"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  error={errors.phone?.message}
                  isOptional={true}
                  props={{
                    ...register("phone"),
                  }}
                  type="text"
                />
                <TextField
                  label="Notes"
                  placeholder="Additional note (optional)"
                  name="notes"
                  error={errors.notes?.message}
                  isOptional={true}
                  props={{
                    ...register("notes"),
                  }}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create & Assign Teacher</Button>
                </DialogFooter>
              </form>
            </TabsContent>
            <TabsContent value="existing">
              <div className="space-y-4 py-4">
                {/* select user from existing users */}

                {users?.length === 0 ? (
                  <p className="text-muted-foreground text-center text-sm">
                    No users available in this group.
                  </p>
                ) : (
                  <>
                    <Label htmlFor="user">Select Teacher</Label>
                    <Select
                      onValueChange={(value) => {
                        setTeacherId(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.first_name + " " + user.last_name}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {user.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              {users?.length !== 0 && (
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAssignTeacher}>Assign Teacher</Button>
                </DialogFooter>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherAssignModel;
