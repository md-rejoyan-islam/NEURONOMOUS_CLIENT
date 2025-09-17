import { IDevice } from '@/lib/types';
import { BoxesIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import SingleGroupDevice from './single-group-device';

const GroupClocksView = ({
  id,
  searchTerm = '',
  filteredDevices = [],
  isLoading,
}: {
  id: string;
  filteredDevices: IDevice[];
  searchTerm?: string;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton className="mb-4 h-40 w-full" />
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="grid gap-5 min-[640px]:grid-cols-2 min-[760px]:grid-cols-1 min-[860px]:grid-cols-2 min-[1150px]:grid-cols-3 min-[1550px]:grid-cols-4">
            {filteredDevices.map((device) => (
              <SingleGroupDevice key={device.id} device={device} groupId={id} />
            ))}
          </div>

          {filteredDevices?.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-muted-foreground mb-4">
                <BoxesIcon className="mx-auto h-16 w-16" />
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
      )}
    </>
  );
};

export default GroupClocksView;
