import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

export function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-xl">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );
}
