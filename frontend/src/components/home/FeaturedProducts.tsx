import Link from "next/link";
import { ProductRail } from "./ProductRail";
import { SectionHeading } from "@/components/ui/heading";
import type { Product } from "@/lib/placeholder-data";

interface FeaturedProductsProps {
  products: Product[];
}

/**
 * The "Featured / Best Sellers / New Arrivals" tab group this replaces was theatre: all
 * three tabs rendered the same array, with "New Arrivals" being that array reversed.
 * With nothing real to distinguish them, one honest rail and a link to the full
 * catalogue says the same thing without pretending.
 */
export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white section-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <SectionHeading>Latest arrivals</SectionHeading>
          <Link
            href="/products"
            className="shrink-0 rounded-lg text-body-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <ProductRail products={products} />
      </div>
    </section>
  );
}
