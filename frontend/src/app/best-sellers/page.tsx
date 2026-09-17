import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { getProducts } from "@/lib/vendure/products";

export const metadata: Metadata = {
  title: "Best Sellers — CoreWAI Supply",
  description: "Shop the most popular electronics, home & kitchen, and lifestyle gadgets at CoreWAI Supply.",
};

export default async function BestSellersPage() {
  const products = await getProducts(40);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h1 className="mb-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            Best Sellers
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">Popular picks from across the store.</p>

          <ProductGrid
            products={products}
            emptyTitle="No products available yet"
            emptyDescription="Our catalogue is still being stocked — check back soon."
          />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
