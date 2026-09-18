import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageSkeleton() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <Skeleton className="h-3.5 w-56 rounded-sm" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-3">
            <Skeleton className="-mx-4 aspect-[4/3] md:mx-0 md:aspect-square md:rounded-xl" />
            <div className="hidden gap-2 md:flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-16 shrink-0 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-28 rounded-sm" />
            <Skeleton className="h-6 w-full rounded-sm sm:h-7" />
            <Skeleton className="h-6 w-2/3 rounded-sm sm:h-7" />

            <Skeleton className="h-4 w-36 rounded-sm" />

            <div className="border-t border-border pt-4">
              <Skeleton className="h-8 w-40 rounded-sm" />
            </div>

            <Skeleton className="h-4 w-44 rounded-sm" />

            <div className="flex flex-col gap-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="hidden gap-3 md:flex">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-white p-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
                  <Skeleton className="h-3 w-full rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 md:mt-10">
          <div className="flex flex-col gap-3 md:flex-row md:gap-6 md:border-b md:border-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg md:my-3 md:h-4 md:w-20" />
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
      <div aria-hidden="true" className="mobile-purchase-bar fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white md:hidden">
        <div className="flex h-20 items-center gap-3 px-4"><Skeleton className="h-10 flex-[2] rounded-lg" /><Skeleton className="h-12 flex-[3] rounded-xl" /></div>
      </div>
    </>
  );
}
