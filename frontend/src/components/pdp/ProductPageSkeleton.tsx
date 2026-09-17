import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageSkeleton() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Skeleton className="h-3.5 w-56 rounded-sm" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-16 shrink-0 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-28 rounded-sm" />
            <Skeleton className="h-6 w-full rounded-sm sm:h-7" />
            <Skeleton className="h-6 w-2/3 rounded-sm sm:h-7" />

            <Skeleton className="h-4 w-36 rounded-sm" />

            <div className="border-t border-border pt-4">
              <Skeleton className="h-8 w-40 rounded-sm" />
            </div>

            <Skeleton className="h-4 w-44 rounded-sm" />

            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2.5 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
                  <Skeleton className="h-3 w-36 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-nowrap items-center gap-6 border-b border-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="my-3 h-4 w-20 rounded-sm" />
            ))}
          </div>
          <div className="flex max-w-3xl flex-col gap-2.5 pt-6">
            <Skeleton className="h-3.5 w-full rounded-sm" />
            <Skeleton className="h-3.5 w-full rounded-sm" />
            <Skeleton className="h-3.5 w-5/6 rounded-sm" />
            <Skeleton className="h-3.5 w-2/3 rounded-sm" />
          </div>
        </div>
      </div>
    </>
  );
}
