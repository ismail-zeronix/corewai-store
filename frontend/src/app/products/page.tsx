import { Suspense } from "react";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Filters } from "@/components/plp/Filters";
import { MobileFilters } from "@/components/plp/MobileFilters";
import { SortSelect } from "@/components/plp/SortSelect";
import { ActiveFilters } from "@/components/plp/ActiveFilters";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { Pagination } from "@/components/plp/Pagination";
import { loadPlpData, type PlpSearchParams } from "@/lib/plp/query";

export const metadata: Metadata = {
  title: "All Products — CoreWAI Supply",
  description:
    "Browse the full CoreWAI Supply catalogue of laptops, desktops and IT hardware.",
};

interface ProductsPageProps {
  searchParams: Promise<PlpSearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { products, facets, totalItems, currentPage, totalPages, priceBounds, activeFilterCount } =
    await loadPlpData(params);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All products" }]} />

          <div className="mb-8 mt-4">
            <h1 className="font-display text-h1 font-semibold tracking-tight text-foreground">
              All products
            </h1>
            <p className="mt-1 text-body-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-[240px_1fr]">
            <aside
              aria-label="Product filters"
              className="hidden h-fit lg:sticky lg:top-24 lg:block"
            >
              <Suspense fallback={null}>
                <Filters facets={facets} priceBounds={priceBounds} />
              </Suspense>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3 lg:justify-end">
                <Suspense fallback={null}>
                  <MobileFilters
                    facets={facets}
                    priceBounds={priceBounds}
                    activeCount={activeFilterCount}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              </div>
              <Suspense fallback={null}>
                <ActiveFilters facets={facets} />
              </Suspense>
              <ProductGrid
                products={products}
                emptyTitle={activeFilterCount > 0 ? "No matching products" : "No products available yet"}
                emptyDescription={
                  activeFilterCount > 0
                    ? "Try removing a filter to see more."
                    : "Our catalogue is still being stocked. Check back soon."
                }
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/products"
                searchParams={params}
              />
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
