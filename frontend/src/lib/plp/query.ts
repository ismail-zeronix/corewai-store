import { searchProducts, type FacetGroup, type SortKey } from "@/lib/vendure/search";
import { filterByPrice, getPriceBounds } from "@/lib/plp/filters";
import type { Product } from "@/lib/placeholder-data";

export const PAGE_SIZE = 12;

/**
 * The shape every listing page (/products, /search, /category/[slug]) reads from.
 *
 * The index signature keeps this assignable to `Pagination`'s generic search-params bag
 * while the named keys stay documented and type-checked at the call sites.
 */
export interface PlpSearchParams {
  /** Comma-separated facet value IDs. */
  f?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  page?: string;
  q?: string;
  [key: string]: string | undefined;
}

export interface PlpData {
  products: Product[];
  facets: FacetGroup[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  priceBounds: { min: number; max: number };
  activeFilterCount: number;
}

function parseSort(sort: string | undefined): SortKey | undefined {
  if (sort === "price-asc" || sort === "price-desc" || sort === "name-asc") return sort;
  return undefined;
}

/**
 * Runs one faceted catalogue query for a listing page.
 *
 * Price is the one filter applied in memory rather than by the index: Vendure's
 * `SearchInput` has no price-range argument, so the alternative would be a second
 * round-trip per request. Because it narrows a page that the index has already paginated,
 * a price filter can under-fill a page — so price filtering requests the full result set
 * and paginates afterwards. Every other filter, the sort and the facet counts come from
 * the index.
 */
export async function loadPlpData(
  params: PlpSearchParams,
  options: { collectionSlug?: string; term?: string } = {},
): Promise<PlpData> {
  const facetValueIds = params.f?.split(",").filter(Boolean) ?? [];
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;
  const inStockOnly = params.inStock === "1";
  const sort = parseSort(params.sort);

  const requestedPage = Math.max(1, Math.floor(Number(params.page)) || 1);

  const baseQuery = {
    term: options.term,
    collectionSlug: options.collectionSlug,
    facetValueIds,
    sort,
    inStockOnly,
  };

  // Ask for everything when price filtering, otherwise let the index paginate.
  const result = await searchProducts({
    ...baseQuery,
    skip: hasPriceFilter ? 0 : (requestedPage - 1) * PAGE_SIZE,
    take: hasPriceFilter ? 100 : PAGE_SIZE,
  });

  let products = result.products;
  let totalItems = result.totalItems;

  if (hasPriceFilter) {
    products = filterByPrice(products, minPrice, maxPrice);
    totalItems = products.length;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  if (hasPriceFilter) {
    products = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }

  // Bounds describe the unfiltered set so the hint does not collapse as you filter.
  const unfilteredForBounds = hasPriceFilter
    ? (await searchProducts({ ...baseQuery, facetValueIds: [], take: 100 })).products
    : result.products;

  return {
    products,
    facets: result.facets,
    totalItems,
    currentPage,
    totalPages,
    priceBounds: getPriceBounds(unfilteredForBounds),
    activeFilterCount:
      facetValueIds.length + (hasPriceFilter ? 1 : 0) + (inStockOnly ? 1 : 0),
  };
}
