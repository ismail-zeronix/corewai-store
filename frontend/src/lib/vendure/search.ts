import type { Product } from "@/lib/placeholder-data";
import { shopApiFetch } from "./shop-client";

/**
 * Catalogue search and faceted browsing, backed by Vendure's DefaultSearchPlugin index.
 *
 * This replaces `filterProducts()`, which fetched up to 100 full product records
 * (descriptions, every asset, every variant) and then ran a substring `includes()` over
 * them in JS. That was correct at five products and wrong at five hundred: no relevance
 * ranking, no pagination, and — because every product's brand was an empty string before
 * the catalogue was seeded — it effectively matched on name only.
 *
 * The index returns exactly the fields a product card needs, filters and paginates in the
 * database, and reports facet counts for the current result set.
 */

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3C/svg%3E";

const SEARCH_QUERY = `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        productId
        slug
        productName
        description
        sku
        currencyCode
        productAsset { preview }
        priceWithTax { ... on SinglePrice { value } ... on PriceRange { min max } }
        inStock
        facetValueIds
        collectionIds
      }
      facetValues {
        count
        facetValue {
          id
          name
          facet { id name code }
        }
      }
    }
  }
`;

interface SearchPrice {
  value?: number;
  min?: number;
  max?: number;
}

interface SearchResultItem {
  productId: string;
  slug: string;
  productName: string;
  description: string;
  sku: string;
  currencyCode: string;
  productAsset: { preview: string } | null;
  priceWithTax: SearchPrice;
  inStock: boolean;
  facetValueIds: string[];
  collectionIds: string[];
}

interface SearchFacetValue {
  count: number;
  facetValue: {
    id: string;
    name: string;
    facet: { id: string; name: string; code: string };
  };
}

interface SearchResult {
  search: {
    totalItems: number;
    items: SearchResultItem[];
    facetValues: SearchFacetValue[];
  };
}

/** A facet with its selectable values, ready to render as a filter group. */
export interface FacetGroup {
  code: string;
  name: string;
  values: Array<{ id: string; name: string; count: number }>;
}

export interface ProductSearchResult {
  products: Product[];
  totalItems: number;
  facets: FacetGroup[];
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface ProductSearchOptions {
  term?: string;
  /** Facet value IDs. Values within one facet are OR-ed; across facets they are AND-ed. */
  facetValueIds?: string[];
  collectionSlug?: string;
  sort?: SortKey;
  skip?: number;
  take?: number;
  inStockOnly?: boolean;
}

/** Vendure returns a single price for one variant and a range when a product has several. */
function lowestPrice(price: SearchPrice): number {
  const minor = price.value ?? price.min ?? 0;
  return minor / 100;
}

function mapSearchItem(item: SearchResultItem): Product {
  return {
    id: item.productId,
    slug: item.slug,
    name: item.productName,
    // The search index has no brand or category field of its own. Both are resolved from
    // facet IDs by the caller, which already holds the facet list from the same response.
    brand: "",
    category: "",
    price: lowestPrice(item.priceWithTax),
    sku: item.sku,
    description: item.description,
    inStock: item.inStock,
    badge: item.inStock ? undefined : "out-of-stock",
    image: item.productAsset?.preview ?? FALLBACK_IMAGE,
    images: item.productAsset ? [item.productAsset.preview] : [FALLBACK_IMAGE],
  };
}

function sortInput(sort: SortKey | undefined) {
  switch (sort) {
    case "price-asc":
      return { price: "ASC" };
    case "price-desc":
      return { price: "DESC" };
    case "name-asc":
      return { name: "ASC" };
    default:
      // Relevance when there is a search term, catalogue order otherwise.
      return undefined;
  }
}

export async function searchProducts(
  options: ProductSearchOptions = {},
): Promise<ProductSearchResult> {
  const {
    term,
    facetValueIds = [],
    collectionSlug,
    sort,
    skip = 0,
    take = 24,
    inStockOnly = false,
  } = options;

  const input: Record<string, unknown> = {
    groupByProduct: true,
    skip,
    take,
  };
  if (term) input.term = term;
  if (collectionSlug) input.collectionSlug = collectionSlug;
  if (inStockOnly) input.inStock = true;
  if (facetValueIds.length > 0) {
    // facetValueFilters AND-s across entries and OR-s within one, which is what a
    // shopper expects: "ASUS or Acer", but "(ASUS or Acer) and Laptops".
    input.facetValueFilters = groupFacetFilters(facetValueIds, await getFacetValueParents());
  }
  const sortBy = sortInput(sort);
  if (sortBy) input.sort = sortBy;

  try {
    const data = await shopApiFetch<SearchResult>(SEARCH_QUERY, { input });
    const { search } = data;

    const facets = buildFacetGroups(search.facetValues);
    const brandFacet = facets.find((f) => f.code === "brand");
    const categoryFacet = facets.find((f) => f.code === "category");

    const products = search.items.map((item) => {
      const product = mapSearchItem(item);
      product.brand =
        brandFacet?.values.find((v) => item.facetValueIds.includes(v.id))?.name ?? "";
      product.category =
        categoryFacet?.values.find((v) => item.facetValueIds.includes(v.id))?.name ?? "";
      return product;
    });

    return { products, totalItems: search.totalItems, facets };
  } catch (error) {
    console.error("Vendure product search failed:", error);
    return { products: [], totalItems: 0, facets: [] };
  }
}

const FACETS_QUERY = `
  query GetFacets {
    facets(options: { take: 100 }) {
      items {
        id
        code
        values { id }
      }
    }
  }
`;

/**
 * Maps every facet value ID to its parent facet code.
 *
 * Needed because grouping the filter correctly is a property of the *request*, while the
 * search response only tells us the parentage afterwards. Cached by `shopApiFetch`'s
 * 60s revalidate, and facets change rarely.
 */
async function getFacetValueParents(): Promise<Map<string, string>> {
  const parents = new Map<string, string>();
  try {
    const data = await shopApiFetch<{
      facets: { items: Array<{ id: string; code: string; values: Array<{ id: string }> }> };
    }>(FACETS_QUERY);
    for (const facet of data.facets.items) {
      for (const value of facet.values) {
        parents.set(value.id, facet.code);
      }
    }
  } catch (error) {
    console.error("Failed to fetch facet index from Vendure Shop API:", error);
  }
  return parents;
}

/**
 * Groups selected values by parent facet: one AND-ed filter per facet, values OR-ed
 * inside it. That gives "(ASUS or Acer) and Laptops" rather than "ASUS or Laptops".
 *
 * Values whose parent is unknown each become their own AND-ed filter, which narrows
 * rather than widens — the safe direction to fail in.
 */
function groupFacetFilters(facetValueIds: string[], parents: Map<string, string>) {
  const byFacet = new Map<string, string[]>();
  const ungrouped: string[] = [];

  for (const id of facetValueIds) {
    const code = parents.get(id);
    if (!code) {
      ungrouped.push(id);
      continue;
    }
    const existing = byFacet.get(code);
    if (existing) existing.push(id);
    else byFacet.set(code, [id]);
  }

  return [
    ...Array.from(byFacet.values()).map((ids) => ({ or: ids })),
    ...ungrouped.map((id) => ({ or: [id] })),
  ];
}

function buildFacetGroups(facetValues: SearchFacetValue[]): FacetGroup[] {
  const groups = new Map<string, FacetGroup>();
  for (const { count, facetValue } of facetValues) {
    const { code, name } = facetValue.facet;
    let group = groups.get(code);
    if (!group) {
      group = { code, name, values: [] };
      groups.set(code, group);
    }
    group.values.push({ id: facetValue.id, name: facetValue.name, count });
  }
  for (const group of groups.values()) {
    group.values.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }
  // Category before Brand, then anything else alphabetically — broad filters first.
  const order = ["category", "brand"];
  return Array.from(groups.values()).sort((a, b) => {
    const ai = order.indexOf(a.code);
    const bi = order.indexOf(b.code);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.name.localeCompare(b.name);
  });
}
