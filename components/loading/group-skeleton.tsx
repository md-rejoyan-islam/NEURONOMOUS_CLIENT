import { Skeleton } from '@/components/ui/skeleton';
import TableSkeleton from './table-skeleton';

const GroupSkeleton = () => {
  return (
    <div className="text-foreground w-full p-6">
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Skeleton className="mb-2 h-8 max-w-40" />
          <Skeleton className="mb-2 h-8 max-w-60" />
          <Skeleton className="mb-2 h-5 max-w-80" />
        </div>
        <div className="hidden items-center justify-end sm:flex">
          <div>
            <Skeleton className="mb-2 h-9 w-28" />
            <Skeleton className="mb-2 h-9 w-28" />
          </div>
        </div>
      </div>

      <TableSkeleton />
    </div>
  );
};

export default GroupSkeleton;
