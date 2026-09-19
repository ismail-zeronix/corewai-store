import { ProductPageSkeleton } from "@/components/pdp/ProductPageSkeleton";

export default function Loading() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="product-page flex-1">
        <ProductPageSkeleton />
      </main>
    </>
  );
}
