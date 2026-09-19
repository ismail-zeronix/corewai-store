import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { getProducts } from "@/lib/vendure/products";

export const metadata: Metadata = {
  title: "New Arrivals — CoreWAI Supply",
  description: "The newest electronics, home & kitchen, and lifestyle gadgets just added to CoreWAI Supply.",
};

export default async function NewArrivalsPage() {
  const products = await getProducts(40);
  const sorted = [...products].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h1 className="mb-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            New Arrivals
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">The latest additions to our catalogue.</p>

          <ProductGrid
            products={sorted}
            emptyTitle="No new arrivals yet"
            emptyDescription="Check back soon — new products are added regularly."
          />
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
