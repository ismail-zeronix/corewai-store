"use server";

import { getProducts, filterProducts } from "./products";
import type { Product } from "@/lib/placeholder-data";

const PREVIEW_LIMIT = 6;

export async function searchProductsPreview(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const products = await getProducts(60);
  return filterProducts(products, trimmed).slice(0, PREVIEW_LIMIT);
}
