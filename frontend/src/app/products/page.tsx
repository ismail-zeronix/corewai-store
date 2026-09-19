import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Filters } from "@/components/plp/Filters";
import { MobileFilters } from "@/components/plp/MobileFilters";
import { SortSelect } from "@/components/plp/SortSelect";
import { ActiveFilters } from "@/components/plp/ActiveFilters";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { Pagination } from "@/components/plp/Pagination";
import { getProducts } from "@/lib/vendure/products";
import { sortProducts } from "@/lib/plp/sort";
import { filterByPrice, filterInStock, getPriceBounds } from "@/lib/plp/filters";

const PAGE_SIZE = 12;
// Vendure's shop API list queries reject `take` above 100 (shopListQueryLimit
// default) — 200 would 400 the whole request, so this is the real ceiling.
const MAX_PRODUCTS_TAKE = 100;

export const metadata: Metadata = {
  title: "All Products — CoreWAI Supply",
  description: "Browse the full CoreWAI Supply catalogue of electronics, home & kitchen, and lifestyle gadgets.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    brand?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { brand, sort, minPrice, maxPrice, inStock, page } = await searchParams;
  const allProducts = await getProducts(MAX_PRODUCTS_TAKE);

  const brands = Array.from(new Set(allProducts.map((p) => p.brand).filter(Boolean))).sort();
  const priceBounds = getPriceBounds(allProducts);

  const activeBrands = brand?.split(",").filter(Boolean) ?? [];
  const minPriceValue = minPrice ? Number(minPrice) : undefined;
  const maxPriceValue = maxPrice ? Number(maxPrice) : undefined;
  const inStockOnly = inStock === "1";

  let filtered = activeBrands.length > 0 ? allProducts.filter((p) => activeBrands.includes(p.brand)) : allProducts;
  filtered = filterByPrice(filtered, minPriceValue, maxPriceValue);
  filtered = filterInStock(filtered, inStockOnly);
  filtered = sortProducts(filtered, sort);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const parsedPage = Number(page);
  const requestedPage = Number.isFinite(parsedPage) ? Math.floor(parsedPage) : 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilterCount =
    (activeBrands.length > 0 ? 1 : 0) + (minPrice || maxPrice ? 1 : 0) + (inStockOnly ? 1 : 0);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                All Products
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <aside aria-label="Product filters" className="hidden h-fit rounded-xl border border-border bg-white p-4 lg:block">
              <Suspense fallback={null}>
                <Filters brands={brands} priceBounds={priceBounds} />
              </Suspense>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3 lg:justify-end">
                <Suspense fallback={null}>
                  <MobileFilters brands={brands} priceBounds={priceBounds} activeCount={activeFilterCount} />
                </Suspense>
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              </div>
              <Suspense fallback={null}><ActiveFilters /></Suspense>
              <ProductGrid
                products={pageProducts}
                emptyTitle={allProducts.length > 0 ? "No matching products" : "No products available yet"}
                emptyDescription={allProducts.length > 0 ? "Try adjusting your filters to find more products." : "Our catalogue is still being stocked. Check back soon for new arrivals."}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/products"
                searchParams={{ brand, sort, minPrice, maxPrice, inStock }}
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
