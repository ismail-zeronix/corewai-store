import { Skeleton } from "@/components/ui/skeleton";

export function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="mb-3 h-3.5 w-16 rounded-sm" />
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-3 w-20 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-3 h-3.5 w-24 rounded-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-3 w-2 shrink-0 rounded-sm" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-3 w-24 rounded-sm" />
      </div>
    </div>
  );
}
