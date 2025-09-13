'use client';
import SimpleSummaryCard from '@/components/cards/simple-summary-card';
import AddDeviceModal from '@/components/groups/add-device-modal';
import { Button } from '@/components/ui/button';
import UsersTable from '@/components/users/users-table';
import {
  useGetAllUsersInGroupQuery,
  useGetAttendanceDevicesInGroupQuery,
  useGetClocksInGroupQuery,
  useGetDepartmentCoursesQuery,
  useGetGroupdByIdQuery,
} from '@/queries/group';
import {
  ArrowLeft,
  Bell,
  Search,
  TabletsIcon,
  UserPlus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import GroupSkeleton from '../loading/group-skeleton';
import NormalTable from '../table/normal-table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import BulkOperationModel from './bulk-operation-model';
import GroupAttendanceDeviceView from './group-attendance-device-view';
import GroupDevicesView from './group-clocks-view';

const SingleGroupComponent = ({ _id }: { _id: string }) => {
  const {
    data: group,
    isLoading,
    refetch: refetchGroup,
    error,
  } = useGetGroupdByIdQuery(_id, {
    skip: !_id,
  });

  const {
    data: usersData,
    refetch,
    isLoading: isUserLoading,
  } = useGetAllUsersInGroupQuery(_id as string);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchParams = useSearchParams();
  const deviceTypeParam = searchParams.get('deviceType');

  const { data: courses } = useGetDepartmentCoursesQuery(_id, {
    skip: !_id,
  });

  console.log(courses);

  const [deviceType, setDeviceType] = useState<'clock' | 'attendance'>(
    deviceTypeParam === 'attendance' ? 'attendance' : 'clock'
  );

  const { data: clockDevices } = useGetClocksInGroupQuery(
    {
      id: _id,
      search: searchTerm,
    },
    {
      skip: !_id,
    }
  );
  const { data: attendanceDevices } = useGetAttendanceDevicesInGroupQuery(
    {
      id: _id,
      search: searchTerm,
    },
    {
      skip: !_id,
    }
  );

  const router = useRouter();

  const handleDeviceTypeChange = (value: 'clock' | 'attendance') => {
    setDeviceType(value);
    setSearchTerm('');
    router.push(`/groups/all/${_id}?deviceType=${value}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // handle debounce
    const timeout = setTimeout(() => {
      if (term) {
        router.replace(
          `/groups/all/${_id}?deviceType=${deviceType}&search=${term}`
        );
      } else {
        router.replace(`/groups/all/${_id}?deviceType=${deviceType}`);
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  if (isLoading || isUserLoading) {
    return <GroupSkeleton />;
  }

  if (error) {
    throw new Error('Failed to fetch group data');
  }

  // useEffect(() => {
  //   if (group?.devices?.clocks) {
  //     setFilteredClocks([...group?.devices?.clocks]);
  //   }
  // }, [group?.devices?.clocks]);

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link href={`/groups`}>
              <Button variant="outline" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Groups
              </Button>
            </Link>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <TabletsIcon className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
              {group?.name}
            </h1>

            <p className="text-muted-foreground mt-1">{group?.description}</p>
          </div>
          <div className="flex gap-2">
            <AddDeviceModal
              groupId={_id as string}
              refetchAllDevices={refetchGroup}
            />
            <Link href={'/create-user'}>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <SimpleSummaryCard
            label={`Total ${deviceType === 'clock' ? 'Clock' : 'Attendance'} Devices`}
            value={
              deviceType === 'clock'
                ? (clockDevices?.length ?? 0)
                : (attendanceDevices?.length ?? 0)
            }
            valueColor="text-primary"
            icon={
              <TabletsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            }
          />

          <SimpleSummaryCard
            label="Online"
            valueColor="text-green-600"
            value={
              deviceType === 'clock'
                ? (clockDevices?.filter((d) => d.status === 'online').length ??
                  0)
                : (attendanceDevices?.filter((d) => d.status === 'online')
                    .length ?? 0)
            }
            icon={
              <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
            }
          />
          <SimpleSummaryCard
            label="Ofline"
            value={
              deviceType === 'clock'
                ? (clockDevices?.filter((d) => d.status === 'offline').length ??
                  0)
                : (attendanceDevices?.filter((d) => d.status === 'offline')
                    .length ?? 0)
            }
            valueColor="text-red-600"
            icon={
              <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400" />
            }
          />

          {deviceType === 'clock' && (
            <SimpleSummaryCard
              label="Notice Mode"
              valueColor="text-orange-600"
              value={
                clockDevices?.filter((d) => d.mode === 'notice').length ?? 0
              }
              icon={
                <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              }
            />
          )}
        </div>

        <Card className="py-4 shadow-xs">
          <CardContent>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg capitalize">
                  <TabletsIcon className="text-primary h-5 w-5" />
                  All {deviceType} Devices
                </div>
                <div>
                  <Select
                    value={deviceType}
                    onValueChange={(value) =>
                      handleDeviceTypeChange(value as 'clock' | 'attendance')
                    }
                  >
                    <SelectTrigger className="w-full min-w-[100px]">
                      <SelectValue placeholder="Select Device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clock">Clock</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {deviceType === 'clock' && (
                  <BulkOperationModel
                    devices={clockDevices ?? []}
                    refetch={refetchGroup}
                    // setFilteredDevices={clockDevices ?? []}
                  />
                )}
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder={`Search devices ...`}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 sm:w-64"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        {deviceType === 'clock' && (
          <GroupDevicesView
            id={_id}
            filteredDevices={clockDevices ?? []}
            searchTerm={searchTerm}
          />
        )}
        {deviceType === 'attendance' && (
          <GroupAttendanceDeviceView
            filteredDevices={attendanceDevices ?? []}
          />
        )}

        {/* users table  */}

        <UsersTable users={usersData ?? []} refetch={refetch} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TabletsIcon className="text-primary h-5 w-5" />
              Department Courses
            </CardTitle>
            <Input
              placeholder={`Search courses ...`}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-64"
            />
          </CardHeader>

          <CardContent>
            <NormalTable
              headers={['# ', 'Course Name', 'Course Code', 'Action']}
              isLoading={isLoading}
              noDataMessage="No courses found."
              data={
                courses?.courses.map((course, index) => [
                  index + 1,
                  course.name,
                  course.code,
                  'delete, edit',
                ]) ?? []
              }
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SingleGroupComponent;
