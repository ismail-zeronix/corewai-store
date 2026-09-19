import { shopApiFetch } from "./shop-client";

/**
 * Real category navigation, sourced from Vendure collections.
 *
 * This replaces the hardcoded 17-entry list in `lib/placeholder-data.ts`, which
 * advertised invented counts ("Accessories 520+ items") and linked to category pages
 * that returned nothing. Categories now appear only once a collection exists and has
 * products behind it.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  /** Real product count. Zero-product collections are filtered out before this is used. */
  productCount: number;
  /** Collection asset if one is set in the admin; callers fall back to an icon. */
  image?: string;
}

interface VendureCollection {
  id: string;
  name: string;
  slug: string;
  featuredAsset: { preview: string } | null;
  productVariants: { totalItems: number };
}

const COLLECTIONS_QUERY = `
  query GetCollections {
    collections(options: { take: 100 }) {
      items {
        id
        name
        slug
        featuredAsset { preview }
        productVariants { totalItems }
      }
    }
  }
`;

/**
 * Returns categories that actually have products, largest first.
 *
 * Returns an empty array when the Shop API is unreachable so that callers render their
 * empty state rather than throwing — a category rail is never important enough to fail
 * a page render.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await shopApiFetch<{ collections: { items: VendureCollection[] } }>(
      COLLECTIONS_QUERY,
    );
    return data.collections.items
      .filter((collection) => collection.productVariants.totalItems > 0)
      .map((collection) => ({
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        productCount: collection.productVariants.totalItems,
        image: collection.featuredAsset?.preview,
      }))
      .sort((a, b) => b.productCount - a.productCount);
  } catch (error) {
    console.error("Failed to fetch collections from Vendure Shop API:", error);
    return [];
  }
}
