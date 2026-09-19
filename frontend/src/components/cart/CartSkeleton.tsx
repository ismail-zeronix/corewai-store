import { Skeleton } from "@/components/ui/skeleton";

export function CartLineSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-white p-4">
      <Skeleton className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" />

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-16 rounded-sm" />
          <Skeleton className="h-3.5 w-full rounded-sm" />
          <Skeleton className="h-3.5 w-2/3 rounded-sm" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <Skeleton className="h-4 w-28 rounded-sm" />
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-16 rounded-sm" />
          <Skeleton className="h-3.5 w-14 rounded-sm" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-16 rounded-sm" />
          <Skeleton className="h-3.5 w-20 rounded-sm" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <Skeleton className="h-4 w-14 rounded-sm" />
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
      <Skeleton className="mt-5 h-9 w-full rounded-lg" />
    </div>
  );
}
