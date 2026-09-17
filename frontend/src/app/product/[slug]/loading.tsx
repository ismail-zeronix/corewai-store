import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { ProductPageSkeleton } from "@/components/pdp/ProductPageSkeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ProductPageSkeleton />
      </main>
      <SiteFooter />
    </>
  );
}
