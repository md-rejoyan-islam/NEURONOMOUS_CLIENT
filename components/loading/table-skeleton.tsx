import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

const TableSkeleton = () => {
  return (
    <div className="text-foreground w-full">
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Skeleton for Total Groups Card */}

        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            className={clsx(
              "flex-row items-center justify-between p-6",
              index === 2 && "hidden lg:flex",
              index === 1 && "hidden sm:flex",
            )}
            key={index}
          >
            <div>
              <Skeleton className="mb-2 h-6 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="flex h-10 w-10 items-center justify-center rounded-full"></Skeleton>
          </Card>
        ))}
      </div>

      {/* Skeleton for  Table */}
      <div className="bg-card w-full rounded-lg border px-6 pt-4 pb-4 shadow-lg">
        <div className="space-y-2">
          {/* Table Header Skeleton */}
          <div className="border-border grid grid-cols-6 gap-4 border-b pb-2">
            <Skeleton className="h-6 w-8" /> {/* # */}
            <Skeleton className="h-6 w-24" /> {/* Name */}
            <Skeleton className="h-6 w-20" /> {/* Devices */}
            <Skeleton className="h-6 w-16" /> {/* Users */}
            <Skeleton className="h-6 w-20" /> {/* Created */}
            <Skeleton className="h-6 w-16" /> {/* Actions */}
          </div>
          {/* Table Rows Skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-2">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
