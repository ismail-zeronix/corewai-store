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

interface SearchPageProps {
  searchParams: Promise<PlpSearchParams>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search results for "${q}" — CoreWAI Supply` : "Search — CoreWAI Supply" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  // Results now come from Vendure's search index: real relevance ranking, facets and
  // pagination, instead of a substring match over a capped client-side fetch.
  const { products, facets, totalItems, currentPage, totalPages, priceBounds, activeFilterCount } =
    query
      ? await loadPlpData(params, { term: query })
      : {
          products: [],
          facets: [],
          totalItems: 0,
          currentPage: 1,
          totalPages: 1,
          priceBounds: { min: 0, max: 0 },
          activeFilterCount: 0,
        };

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

          <div className="mb-8 mt-4">
            <h1 className="font-display text-h1 font-semibold tracking-tight text-foreground">
              {query ? `Results for “${query}”` : "Search"}
            </h1>
            <p className="mt-1 text-body-sm text-muted-foreground">
              {query
                ? `${totalItems} ${totalItems === 1 ? "product" : "products"}`
                : "Search the catalogue by product name or brand."}
            </p>
          </div>

          {query && (
            <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-[240px_1fr]">
              <aside
                aria-label="Search filters"
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
                  emptyTitle={`No results for “${query}”`}
                  emptyDescription="Try a different keyword, or browse the full catalogue."
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/search"
                  searchParams={params}
                />
              </div>
            </div>
          )}

          {!query && (
            <div className="pb-16">
              <ProductGrid
                products={[]}
                emptyTitle="Start searching"
                emptyDescription="Use the search bar above to find products by name or brand."
              />
            </div>
          )}
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
