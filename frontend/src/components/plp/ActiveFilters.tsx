"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { FacetGroup } from "@/lib/vendure/search";

export function ActiveFilters({ facets }: { facets: FacetGroup[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeIds = searchParams.get("f")?.split(",").filter(Boolean) ?? [];
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

  // Resolve IDs to names via the facet list; an ID with no match (stale URL) is skipped
  // rather than rendered as a raw number.
  const nameById = new Map(
    facets.flatMap((facet) => facet.values.map((value) => [value.id, value.name] as const)),
  );

  const filters: Array<{ label: string; href: string }> = [];

  for (const id of activeIds) {
    const name = nameById.get(id);
    if (!name) continue;
    filters.push({
      label: name,
      href: href({ f: activeIds.filter((value) => value !== id).join(",") }),
    });
  }

  if (min || max) {
    filters.push({
      label: `AED ${min || "0"} – ${max || "any"}`,
      href: href({ minPrice: null, maxPrice: null }),
    });
  }

  if (searchParams.get("inStock") === "1") {
    filters.push({ label: "In stock", href: href({ inStock: null }) });
  }

  if (filters.length === 0) return null;

  return (
    <nav aria-label="Active filters" className="mb-5 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Link
          key={filter.label}
          href={filter.href}
          scroll={false}
          aria-label={`Remove filter: ${filter.label}`}
          className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border border-border bg-white px-3 text-caption font-medium text-foreground hover:border-primary/40 hover:text-primary"
        >
          <span className="break-words">{filter.label}</span>
          <X className="size-3.5 shrink-0" aria-hidden="true" />
        </Link>
      ))}
      {filters.length > 1 && (
        <Link
          href={href({ f: null, minPrice: null, maxPrice: null, inStock: null })}
          scroll={false}
          className="inline-flex min-h-9 items-center rounded-full px-3 text-caption font-semibold text-primary hover:bg-primary/5"
        >
          Clear all
        </Link>
      )}
    </nav>
  );
}
