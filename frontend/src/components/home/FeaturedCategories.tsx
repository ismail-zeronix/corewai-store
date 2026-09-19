import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/heading";
import { getCategories } from "@/lib/vendure/collections";

/**
 * Real Vendure collections, with real product counts.
 *
 * This replaced a nine-entry hardcoded list ("All-in-One PC", "Mini PC", "NAS &
 * Storage"…) that matched nothing in the catalogue and linked to empty pages. The whole
 * section removes itself when there are no collections, rather than rendering a rail of
 * dead links.
 */
export async function FeaturedCategories() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 section-y-tight sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <SectionHeading>Shop by category</SectionHeading>
        <Link
          href="/categories"
          className="shrink-0 rounded-lg text-body-sm font-medium text-primary hover:underline"
        >
          All categories
        </Link>
      </div>

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
                {category.productCount} {category.productCount === 1 ? "product" : "products"}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
