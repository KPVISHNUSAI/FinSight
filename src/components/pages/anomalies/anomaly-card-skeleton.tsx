import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnomalyCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
