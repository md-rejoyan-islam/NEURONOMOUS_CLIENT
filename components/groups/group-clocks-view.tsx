import { IDevice } from '@/lib/types';
import { TabletsIcon } from 'lucide-react';
import SingleGroupDevice from './single-group-device';

const GroupClocksView = ({
  id,
  searchTerm = '',
  filteredDevices = [],
}: {
  id: string;
  searchTerm?: string;
  filteredDevices: IDevice[];
}) => {
  // useEffect(() => {
  //   if (group?.devices) {
  //     setFilteredDevices(group?.devices);
  //   }
  // }, [group?.devices]);
  return (
    <div>
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
    </div>
  );
};

export default GroupClocksView;
