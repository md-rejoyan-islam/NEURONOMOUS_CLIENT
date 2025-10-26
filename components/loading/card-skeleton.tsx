import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
const CardSkeleton = ({ index }: { index: number }) => {
  return (
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
  );
};

export default CardSkeleton;
