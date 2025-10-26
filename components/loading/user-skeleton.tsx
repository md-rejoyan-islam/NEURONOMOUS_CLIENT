import { Skeleton } from "@/components/ui/skeleton";

const UserSkeleton = () => {
  return (
    <div className="mx-auto space-y-6 p-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-7 w-60" />
        <Skeleton className="h-5 w-68" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-88 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
