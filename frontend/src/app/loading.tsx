import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { ScrollRow } from "@/components/ui/scroll-row";
import { ProductCardSkeleton } from "@/components/plp/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

function ProductRailSkeleton() {
  return (
    <ScrollRow>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="w-[42%] shrink-0 sm:w-[30%] lg:w-auto">
          <ProductCardSkeleton />
        </div>
      ))}
    </ScrollRow>
  );
}

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8 lg:pt-6">
          <Skeleton className="aspect-[4/3] w-full rounded-xl sm:aspect-[16/9] lg:h-[420px] lg:rounded-3xl" />
        </section>

        <section className="bg-white py-6 sm:py-8 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex flex-col gap-1.5 sm:mb-6">
              <Skeleton className="h-3 w-32 rounded-sm" />
              <Skeleton className="h-5 w-52 rounded-sm sm:h-6" />
            </div>
            <ProductRailSkeleton />
          </div>
        </section>

        <section className="py-6 sm:py-8 lg:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex flex-col gap-1.5 sm:mb-6">
              <Skeleton className="h-3 w-32 rounded-sm" />
              <Skeleton className="h-5 w-52 rounded-sm sm:h-6" />
            </div>
            <ProductRailSkeleton />
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
