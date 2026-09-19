import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { FiltersSkeleton } from "@/components/plp/FiltersSkeleton";
import { ProductGridSkeleton } from "@/components/plp/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-3.5 w-48 rounded-sm" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2">
            <Skeleton className="h-6 w-40 rounded-sm sm:h-7" />
            <Skeleton className="h-3.5 w-24 rounded-sm" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <FiltersSkeleton />
            </aside>
            <div>
              <ProductGridSkeleton />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
