import { ScrollRow } from "@/components/ui/scroll-row";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/placeholder-data";

interface ProductRailProps {
  products: Product[];
  countdownLabels?: Record<string, string>;
}

export function ProductRail({ products, countdownLabels }: ProductRailProps) {
  return (
    <ScrollRow>
      {products.map((product) => (
        <div key={product.id} className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
          <ProductCard product={product} countdownLabel={countdownLabels?.[product.id]} />
        </div>
      ))}
    </ScrollRow>
  );
}
