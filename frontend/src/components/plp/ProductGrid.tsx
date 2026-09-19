import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";
import type { Product } from "@/lib/placeholder-data";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try a different filter, or browse the full catalogue.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PackageSearch className="h-6 w-6" />
        </span>
        <p className="font-display text-base font-semibold text-foreground">{emptyTitle}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
        <Link
          href="/products"
          className="mt-2 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
