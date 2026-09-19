import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { getProducts, filterProducts } from "@/lib/vendure/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search results for "${q}" — CoreWAI Supply` : "Search — CoreWAI Supply" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const allProducts = query ? await getProducts(60) : [];
  const results = filterProducts(allProducts, query);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h1 className="mb-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            {query ? (
              <>
                Search results for <span className="text-primary">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {query ? `${results.length} products found` : "Enter a search term to find products."}
          </p>

          <ProductGrid
            products={results}
            emptyTitle={query ? `No results for "${query}"` : "Start searching"}
            emptyDescription={
              query
                ? "Try a different keyword, or browse our full catalogue."
                : "Use the search bar above to find products by name or brand."
            }
          />
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
