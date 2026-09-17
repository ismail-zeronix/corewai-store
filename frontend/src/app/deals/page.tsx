import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { getProducts } from "@/lib/vendure/products";

export const metadata: Metadata = {
  title: "Deals & Offers — CoreWAI Supply",
  description: "Current discounts and limited-time offers at CoreWAI Supply.",
};

export default async function DealsPage() {
  const products = await getProducts(60);
  const deals = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Deals / Offers" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h1 className="mb-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
            Deals &amp; Offers
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">Limited-time discounts across the catalogue.</p>

          <ProductGrid
            products={deals}
            emptyTitle="No active deals right now"
            emptyDescription="We don't have any discounted items at the moment — check back soon."
          />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
