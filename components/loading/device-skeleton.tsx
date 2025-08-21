import { Skeleton } from '@/components/ui/skeleton';
import TableSkeleton from './table-skeleton';

const DeviceSkeleton = () => {
  return (
    <div className="text-foreground w-full">
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Skeleton className="bg-card mb-2 h-9 max-w-60 border shadow-md" />
          <Skeleton className="bg-card mb-2 h-7 max-w-80 border shadow-md" />
        </div>
      </div>

      <TableSkeleton />
    </div>
  );
};

export default DeviceSkeleton;
