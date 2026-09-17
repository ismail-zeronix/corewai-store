import type { Product } from "@/lib/placeholder-data";
import { shopApiFetch } from "./shop-client";

const PRODUCT_FIELDS = `
  id
  name
  slug
  description
  createdAt
  featuredAsset { preview }
  assets { preview }
  facetValues { name facet { name } }
  collections { id name slug }
  variants { id price priceWithTax currencyCode stockLevel sku }
`;

const PRODUCTS_QUERY = `
  query GetProducts($take: Int) {
    products(options: { take: $take }) {
      totalItems
      items {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

const PRODUCT_BY_SLUG_QUERY = `
  query GetProduct($slug: String) {
    product(slug: $slug) {
      ${PRODUCT_FIELDS}
    }
  }
`;

interface VendureAsset {
  preview: string;
}

interface VendureFacetValue {
  name: string;
  facet: { name: string };
}

interface VendureCollection {
  id: string;
  name: string;
  slug: string;
}

interface VendureVariant {
  id: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  sku: string;
}

interface VendureProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  featuredAsset: VendureAsset | null;
  assets: VendureAsset[];
  facetValues: VendureFacetValue[];
  collections: VendureCollection[];
  variants: VendureVariant[];
}

interface ProductsQueryResult {
  products: {
    totalItems: number;
    items: VendureProduct[];
  };
}

interface ProductQueryResult {
  product: VendureProduct | null;
}

const HTML_ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&quot;|&amp;|&#39;|&apos;|&lt;|&gt;/g, (match) => HTML_ENTITIES[match]);
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3C/svg%3E";

const GALLERY_LIMIT = 6;

function mapVendureProduct(product: VendureProduct): Product {
  const variant = product.variants[0];
  const brandFacet = product.facetValues.find((fv) => fv.facet.name === "Brand");
  const outOfStock = variant?.stockLevel === "OUT_OF_STOCK";

  const previews = [product.featuredAsset?.preview, ...product.assets.map((asset) => asset.preview)].filter(
    (preview): preview is string => Boolean(preview),
  );
  const images = Array.from(new Set(previews)).slice(0, GALLERY_LIMIT);

  return {
    id: product.id,
    slug: product.slug,
    variantId: variant?.id,
    createdAt: product.createdAt,
    name: decodeHtmlEntities(product.name),
    brand: brandFacet?.name ?? "",
    category: product.collections[0]?.name ?? "",
    categorySlug: product.collections[0]?.slug,
    price: variant ? variant.priceWithTax / 100 : 0,
    sku: variant?.sku,
    description: decodeHtmlEntities(product.description ?? ""),
    inStock: !outOfStock,
    badge: outOfStock ? "out-of-stock" : undefined,
    image: images[0] ?? FALLBACK_IMAGE,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
  };
}

export function filterProducts(products: Product[], query: string): Product[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return products.filter(
    (p) => p.name.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle),
  );
}

export async function getProducts(take = 20): Promise<Product[]> {
  try {
    const data = await shopApiFetch<ProductsQueryResult>(PRODUCTS_QUERY, { take });
    return data.products.items.map(mapVendureProduct);
  } catch (error) {
    console.error("Failed to fetch products from Vendure Shop API:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await shopApiFetch<ProductQueryResult>(PRODUCT_BY_SLUG_QUERY, { slug });
    return data.product ? mapVendureProduct(data.product) : null;
  } catch (error) {
    console.error(`Failed to fetch product "${slug}" from Vendure Shop API:`, error);
    return null;
  }
}
