"use server";

import { searchProducts } from "./search";
import type { Product } from "@/lib/placeholder-data";

const PREVIEW_LIMIT = 6;

/**
 * Type-ahead results for the header search dialog.
 *
 * Uses the same search index as the results page, so the preview and the page it leads
 * to rank identically. Previously this fetched 60 full product records on every
 * keystroke-debounce and substring-matched them in memory.
 */
export async function searchProductsPreview(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { products } = await searchProducts({ term: trimmed, take: PREVIEW_LIMIT });
  return products;
}
