import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { getCategories } from "@/lib/vendure/collections";

export const metadata: Metadata = {
  title: "All Categories — CoreWAI Supply",
  description: "Browse every category at CoreWAI Supply — laptops, desktops and IT hardware.",
};

export default async function CategoriesPage() {
  // Real collections. This page used to render 17 hardcoded tiles, each with an invented
  // item count, every one linking to a page that returned nothing.
  const categories = await getCategories();

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

          <h1 className="mb-8 mt-4 font-display text-h1 font-semibold tracking-tight text-foreground">
            All categories
          </h1>

          <div className="pb-16">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <p className="font-display text-body font-semibold text-foreground">
                  No categories yet
                </p>
                <p className="max-w-sm text-body-sm text-muted-foreground">
                  Browse the full catalogue while we organise it into categories.
                </p>
                <Link
                  href="/products"
                  className="mt-2 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-white hover:bg-primary/90"
                >
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl bg-white px-5 py-4 shadow-soft ring-1 ring-black/[0.04] transition-shadow hover:shadow-elevated"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-body font-semibold text-foreground">
                        {category.name}
                      </span>
                      <span className="text-caption tabular-nums text-muted-foreground">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "product" : "products"}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
