import { cn } from "@/lib/utils";
import type { Product } from "@/lib/placeholder-data";

const NOISE_TOKEN = /^[A-Z0-9-]+$/;

// Current product titles are literally comma/pipe/bracket-separated spec
// strings (see mapVendureProduct), e.g. "ASUS TUF Gaming F16 (UAE Version) |
// 16" 144Hz Display, Intel Core i7 14650HX [FX608JHI-TU657W]" — splitting on
// those delimiters recovers a real "key highlights" list without inventing data.
function parseKeyHighlights(name: string): string[] {
  const fragments = name
    .split(/[,|()[\]]/)
    .map((fragment) => fragment.trim())
    .filter((fragment) => fragment.length >= 3)
    .filter((fragment) => !(!fragment.includes(" ") && NOISE_TOKEN.test(fragment)));

  return Array.from(new Set(fragments)).slice(0, 8);
}

interface SpecificationsProps {
  product: Product;
}

export function Specifications({ product }: SpecificationsProps) {
  const highlights = parseKeyHighlights(product.name);
  const showHighlights = highlights.length >= 2;
  const outOfStock = product.inStock === false;

  const rows: { label: string; value: string }[] = [
    ...(product.brand ? [{ label: "Brand", value: product.brand }] : []),
    ...(product.category ? [{ label: "Category", value: product.category }] : []),
    { label: "Availability", value: outOfStock ? "Out of stock" : "In stock" },
    ...(product.sku ? [{ label: "SKU", value: product.sku }] : []),
  ];

  const showFallback = !showHighlights && rows.length <= 1;

  return (
    <div className="flex flex-col gap-6">
      {showHighlights && (
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Key Highlights</h3>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2 [&_li]:ml-4 [&_li]:list-disc">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd
                className={cn(
                  "font-medium text-foreground",
                  row.label === "Availability" && (outOfStock ? "text-destructive" : "text-greenink")
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        {showFallback && (
          <p className="mt-3 text-sm text-muted-foreground">
            Full specifications for this product will be published soon.
          </p>
        )}
      </div>
    </div>
  );
}
