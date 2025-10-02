import { Skeleton } from '@/components/ui/skeleton';

const DeviceSkeleton = () => {
  return (
    <div className="text-foreground w-full">
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Skeleton className="bg-card mb-2 h-9 max-w-60 border shadow-sm" />
          <Skeleton className="bg-card mb-2 h-7 max-w-80 border shadow-sm" />
        </div>
      </div>
      <div className="mb-6">
        <Skeleton className="bg-card mb-2 h-20 w-full border shadow-sm" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="bg-card h-100 w-full border shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceSkeleton;
