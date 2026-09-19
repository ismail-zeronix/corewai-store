"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { FacetGroup } from "@/lib/vendure/search";
import { formatAed } from "@/lib/format";

interface FiltersProps {
  facets: FacetGroup[];
  priceBounds: { min: number; max: number };
}

type ParamUpdates = Record<string, string | null>;

function withUpdatedParams(searchParams: URLSearchParams, updates: ParamUpdates): URLSearchParams {
  const params = new URLSearchParams(searchParams.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  params.delete("page");
  return params;
}

export function Filters({ facets, priceBounds }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFacetValues = new Set(searchParams.get("f")?.split(",").filter(Boolean));
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStockOnly = searchParams.get("inStock") === "1";

  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [priceSource, setPriceSource] = useState({ minPrice, maxPrice });
  if (priceSource.minPrice !== minPrice || priceSource.maxPrice !== maxPrice) {
    setPriceSource({ minPrice, maxPrice });
    setMinInput(minPrice);
    setMaxInput(maxPrice);
  }

  function push(params: URLSearchParams) {
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  function toggleFacetValue(id: string) {
    const next = new Set(activeFacetValues);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    push(withUpdatedParams(searchParams, { f: next.size > 0 ? Array.from(next).join(",") : null }));
  }

  function applyPrice() {
    push(withUpdatedParams(searchParams, { minPrice: minInput || null, maxPrice: maxInput || null }));
  }

  function toggleInStock() {
    push(withUpdatedParams(searchParams, { inStock: inStockOnly ? null : "1" }));
  }

  function clearAll() {
    setMinInput("");
    setMaxInput("");
    push(withUpdatedParams(searchParams, { f: null, minPrice: null, maxPrice: null, inStock: null }));
  }

  const hasActiveFilters =
    activeFacetValues.size > 0 || Boolean(minPrice) || Boolean(maxPrice) || inStockOnly;

  return (
    <fieldset
      disabled={isPending}
      aria-busy={isPending}
      className="flex min-w-0 flex-col gap-7 disabled:opacity-60"
    >
      <legend className="sr-only">Filter products</legend>
      <span role="status" className="sr-only">{isPending ? "Updating products" : ""}</span>

      {/* Facet groups come from the search index, so the filter list reflects what is
          actually in the catalogue. The old sidebar hardcoded a single "Brand" group
          that rendered empty, because no product had a brand. */}
      {facets.map((facet) => (
        <div key={facet.code}>
          <h3 className="mb-2 text-body-sm font-semibold text-foreground">{facet.name}</h3>
          <div className="flex flex-col">
            {facet.values.map((value) => (
              <label
                key={value.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 text-body-sm text-muted-foreground"
              >
                <input
                  type="checkbox"
                  checked={activeFacetValues.has(value.id)}
                  onChange={() => toggleFacetValue(value.id)}
                  className="size-4 rounded-sm border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                />
                <span className="flex-1">{value.name}</span>
                <span className="tabular-nums text-caption text-muted-foreground">{value.count}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <form onSubmit={(event) => { event.preventDefault(); applyPrice(); }}>
        <h3 className="mb-1 text-body-sm font-semibold text-foreground">Price</h3>
        {/* The range belongs in the label, not in the inputs. As placeholders the real
            bounds were clipped by the 79px input — "22500" rendered as "2250", which read
            as a maximum lower than the minimum. */}
        <p className="mb-2 text-caption tabular-nums text-muted-foreground">
          {formatAed(priceBounds.min)} – {formatAed(priceBounds.max)}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            placeholder="Min"
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            aria-label="Minimum price"
            className="h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="decimal"
            min={minInput || 0}
            step="1"
            placeholder="Max"
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            aria-label="Maximum price"
            className="h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="mt-2 min-h-11 w-full rounded-lg border border-primary/30 px-3 text-body-sm font-semibold text-primary outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Apply price
        </button>
      </form>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body-sm text-foreground">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={toggleInStock}
          className="size-4 rounded-sm border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        In stock only
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="min-h-11 w-fit rounded-lg px-2 text-body-sm font-semibold text-primary outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Clear all filters
        </button>
      )}
    </fieldset>
  );
}
