import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Filters } from "@/components/plp/Filters";
import { MobileFilters } from "@/components/plp/MobileFilters";
import { SortSelect } from "@/components/plp/SortSelect";
import { ActiveFilters } from "@/components/plp/ActiveFilters";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { Pagination } from "@/components/plp/Pagination";
import { loadPlpData, type PlpSearchParams } from "@/lib/plp/query";
import { getCategories } from "@/lib/vendure/collections";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PlpSearchParams>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return { title: "Category not found — CoreWAI Supply" };
  return {
    title: `${category.name} — CoreWAI Supply`,
    description: `Shop ${category.name} at CoreWAI Supply — fast UAE delivery, official warranty, pay your way.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;

  // Categories are real collections now. A slug with no collection behind it is a 404
  // rather than an empty page — the old hardcoded list produced 17 of those.
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const { products, facets, totalItems, currentPage, totalPages, priceBounds, activeFilterCount } =
    await loadPlpData(queryParams, { collectionSlug: slug });

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
          />

          <div className="mb-8 mt-4">
            <h1 className="font-display text-h1 font-semibold tracking-tight text-foreground">
              {category.name}
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
                emptyTitle="No matching products"
                emptyDescription="Try removing a filter to see more."
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/category/${slug}`}
                searchParams={queryParams}
              />
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
