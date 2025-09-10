import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IDevice, IGroupWithPopulatedData } from '@/lib/types';
import { Search, TabletsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import BulkOperationModel from './bulk-operation-model';
import SingleGroupDevice from './single-group-device';

const GroupDevicesView = ({
  group,
  refetchGroup,
  id,
}: {
  group: IGroupWithPopulatedData;
  id: string;
  refetchGroup: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<IDevice[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const lowerTerm = term.toLowerCase();
      const filtered = group?.devices.filter(
        (device) =>
          device.id.toLowerCase().includes(lowerTerm) ||
          device?.name?.toLowerCase().includes(lowerTerm)
      );
      setFilteredDevices(filtered ?? []);
    } else {
      setFilteredDevices(group?.devices ?? []);
    }
  };

  useEffect(() => {
    if (group?.devices) {
      setFilteredDevices(group?.devices);
    }
  }, [group?.devices]);
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <CardTitle className="flex items-center gap-2">
            <TabletsIcon className="text-primary h-5 w-5" />
            All Devices
          </CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <BulkOperationModel
              devices={group?.devices ?? []}
              refetch={refetchGroup}
              setFilteredDevices={setFilteredDevices}
            />
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                disabled={group?.devices.length === 0}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
          {filteredDevices.map((device) => (
            <SingleGroupDevice key={device.id} device={device} groupId={id} />
          ))}
        </div>

        {filteredDevices?.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-muted-foreground mb-4">
              <TabletsIcon className="mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No devices found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Connect your IoT devices to get started.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupDevicesView;
