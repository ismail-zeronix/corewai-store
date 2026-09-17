import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Filters } from "@/components/plp/Filters";
import { MobileFilters } from "@/components/plp/MobileFilters";
import { SortSelect } from "@/components/plp/SortSelect";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { Pagination } from "@/components/plp/Pagination";
import { getProducts } from "@/lib/vendure/products";
import { sortProducts } from "@/lib/plp/sort";
import { filterByPrice, filterInStock, getPriceBounds } from "@/lib/plp/filters";
import { categories } from "@/lib/placeholder-data";

const PAGE_SIZE = 12;
// Vendure's shop API list queries reject `take` above 100 (shopListQueryLimit
// default) — 200 would 400 the whole request, so this is the real ceiling.
const MAX_PRODUCTS_TAKE = 100;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    brand?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
}

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  const name = category?.name ?? titleCase(slug);
  return {
    title: `${name} — CoreWAI Supply`,
    description: `Shop ${name} at CoreWAI Supply — fast UAE delivery, official warranty, pay your way.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { brand, sort, minPrice, maxPrice, inStock, page } = await searchParams;
  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name ?? titleCase(slug);

  const allProducts = await getProducts(MAX_PRODUCTS_TAKE);
  const categoryProducts = allProducts.filter(
    (p) => p.categorySlug === slug || p.category.toLowerCase() === categoryName.toLowerCase(),
  );

  const brands = Array.from(new Set(categoryProducts.map((p) => p.brand).filter(Boolean))).sort();
  const priceBounds = getPriceBounds(categoryProducts);

  const activeBrands = brand?.split(",").filter(Boolean) ?? [];
  const minPriceValue = minPrice ? Number(minPrice) : undefined;
  const maxPriceValue = maxPrice ? Number(maxPrice) : undefined;
  const inStockOnly = inStock === "1";

  let filtered =
    activeBrands.length > 0 ? categoryProducts.filter((p) => activeBrands.includes(p.brand)) : categoryProducts;
  filtered = filterByPrice(filtered, minPriceValue, maxPriceValue);
  filtered = filterInStock(filtered, inStockOnly);
  filtered = sortProducts(filtered, sort);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(page) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilterCount =
    (activeBrands.length > 0 ? 1 : 0) + (minPrice || maxPrice ? 1 : 0) + (inStockOnly ? 1 : 0);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: categoryName }]}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                {categoryName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <Suspense fallback={null}>
                <Filters brands={brands} priceBounds={priceBounds} />
              </Suspense>
            </aside>

            <div>
              <div className="mb-4 flex items-center justify-between gap-3 lg:justify-end">
                <Suspense fallback={null}>
                  <MobileFilters brands={brands} priceBounds={priceBounds} activeCount={activeFilterCount} />
                </Suspense>
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              </div>
              <ProductGrid
                products={pageProducts}
                emptyTitle={`No products in ${categoryName} yet`}
                emptyDescription="We're still stocking this category — explore the full catalogue in the meantime."
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/category/${slug}`}
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
