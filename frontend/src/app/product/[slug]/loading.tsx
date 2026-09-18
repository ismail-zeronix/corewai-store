import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { ProductPageSkeleton } from "@/components/pdp/ProductPageSkeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="product-page flex-1">
        <ProductPageSkeleton />
      </main>
      <SiteFooter mobile="hidden" />
    </>
  );
}
