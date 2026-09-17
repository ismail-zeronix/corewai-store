import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card size="sm" className="gap-2 sm:gap-3">
      <CardContent className="flex flex-col gap-2 sm:gap-3">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div>
          <Skeleton className="h-2.5 w-1/3 rounded-sm" />
          <Skeleton className="mt-1.5 h-3.5 w-full rounded-sm" />
          <Skeleton className="mt-1 h-3.5 w-2/3 rounded-sm" />
          <Skeleton className="mt-1.5 h-3 w-1/2 rounded-sm sm:mt-2" />
          <Skeleton className="mt-1.5 h-4 w-1/3 rounded-sm sm:mt-2" />
        </div>
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent px-(--card-spacing) pt-0">
        <Skeleton className="h-8 w-full rounded-md sm:h-9" />
      </CardFooter>
    </Card>
  );
}
