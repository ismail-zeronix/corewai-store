"use client";

import { useState } from "react";
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

  const activeBrands = new Set(searchParams.get("brand")?.split(",").filter(Boolean));
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStockOnly = searchParams.get("inStock") === "1";

  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);

  function push(params: URLSearchParams) {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
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
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    setMinInput("");
    setMaxInput("");
    push(params);
  }

  const hasActiveFilters = activeBrands.size > 0 || Boolean(minPrice) || Boolean(maxPrice) || inStockOnly;

  return (
    <div className="flex flex-col gap-6">
      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Brand</h3>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
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

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Price (AED)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(priceBounds.min)}
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            onBlur={applyPrice}
            aria-label="Minimum price"
            className="h-9 w-full rounded-lg border border-border bg-white px-2 text-sm"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(priceBounds.max)}
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            onBlur={applyPrice}
            aria-label="Maximum price"
            className="h-9 w-full rounded-lg border border-border bg-white px-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={applyPrice}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          Apply
        </button>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
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
          className="w-fit text-xs font-semibold text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
