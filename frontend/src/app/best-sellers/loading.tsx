import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { ProductGridSkeleton } from "@/components/plp/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-3.5 w-32 rounded-sm" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2">
            <Skeleton className="h-6 w-40 rounded-sm sm:h-7" />
            <Skeleton className="h-3.5 w-52 rounded-sm" />
          </div>

          <ProductGridSkeleton />
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
