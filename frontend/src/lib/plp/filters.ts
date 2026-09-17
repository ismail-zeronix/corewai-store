import type { Product } from "@/lib/placeholder-data";

export function filterByPrice(products: Product[], min?: number, max?: number): Product[] {
  if (min === undefined && max === undefined) return products;
  return products.filter((product) => {
    if (min !== undefined && product.price < min) return false;
    if (max !== undefined && product.price > max) return false;
    return true;
  });
}

export function filterInStock(products: Product[], onlyInStock: boolean): Product[] {
  if (!onlyInStock) return products;
  return products.filter((product) => product.inStock !== false);
}

export function getPriceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((product) => product.price);
  return {
    min: Math.floor(Math.min(...prices) / 10) * 10,
    max: Math.ceil(Math.max(...prices) / 10) * 10,
  };
}
