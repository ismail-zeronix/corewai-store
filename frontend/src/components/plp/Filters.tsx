"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FiltersProps {
  brands: string[];
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

export function Filters({ brands, priceBounds }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeBrands = new Set(searchParams.get("brand")?.split(",").filter(Boolean));
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

  function toggleBrand(brand: string) {
    const next = new Set(activeBrands);
    if (next.has(brand)) {
      next.delete(brand);
    } else {
      next.add(brand);
    }
    push(withUpdatedParams(searchParams, { brand: next.size > 0 ? Array.from(next).join(",") : null }));
  }

  function applyPrice() {
    push(withUpdatedParams(searchParams, { minPrice: minInput || null, maxPrice: maxInput || null }));
  }

  function toggleInStock() {
    push(withUpdatedParams(searchParams, { inStock: inStockOnly ? null : "1" }));
  }

  function clearAll() {
    const params = withUpdatedParams(searchParams, { brand: null, minPrice: null, maxPrice: null, inStock: null });
    setMinInput("");
    setMaxInput("");
    push(params);
  }

  const hasActiveFilters = activeBrands.size > 0 || Boolean(minPrice) || Boolean(maxPrice) || inStockOnly;

  return (
    <fieldset disabled={isPending} aria-busy={isPending} className="flex min-w-0 flex-col gap-6 disabled:opacity-60">
      <legend className="sr-only">Filter products</legend>
      <span role="status" className="sr-only">{isPending ? "Updating products" : ""}</span>
      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Brand</h3>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={activeBrands.has(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={(event) => { event.preventDefault(); applyPrice(); }}>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Price (AED)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder={String(priceBounds.min)}
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            aria-label="Minimum price"
            className="h-11 w-full min-w-0 rounded-xl border border-border bg-white px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="decimal"
            min={minInput || 0}
            step="0.01"
            placeholder={String(priceBounds.max)}
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            aria-label="Maximum price"
            className="h-11 w-full min-w-0 rounded-xl border border-border bg-white px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="mt-2 min-h-11 w-full rounded-xl border border-primary/30 px-3 text-sm font-semibold text-primary outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Apply price
        </button>
      </form>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={toggleInStock}
          className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        In Stock Only
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="min-h-11 w-fit rounded-xl px-2 text-sm font-semibold text-primary outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          Clear all filters
        </button>
      )}
    </fieldset>
  );
}
