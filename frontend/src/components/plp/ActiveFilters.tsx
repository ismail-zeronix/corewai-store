"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export function ActiveFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brands = searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");
  function href(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    return params.size ? `${pathname}?${params}` : pathname;
  }
  const filters = brands.map((brand) => ({
    label: brand,
    href: href({ brand: brands.filter((value) => value !== brand).join(",") }),
  }));
  if (min || max) filters.push({ label: `Price: ${min || "0"}–${max || "Any"} AED`, href: href({ minPrice: null, maxPrice: null }) });
  if (searchParams.get("inStock") === "1") filters.push({ label: "In stock", href: href({ inStock: null }) });
  if (!filters.length) return null;

  return (
    <nav aria-label="Active filters" className="mb-4 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Link key={filter.label} href={filter.href} scroll={false} aria-label={`Remove filter: ${filter.label}`}
          className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 text-xs font-medium text-primary">
          <span className="break-words">{filter.label}</span><X className="size-3.5 shrink-0" aria-hidden="true" />
        </Link>
      ))}
      <Link href={href({ brand: null, minPrice: null, maxPrice: null, inStock: null })} scroll={false} className="inline-flex min-h-11 items-center rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary/5">Clear all</Link>
    </nav>
  );
}
