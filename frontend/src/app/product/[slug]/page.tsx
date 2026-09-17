import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Lock, RotateCcw, Star } from "lucide-react";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { ProductRail } from "@/components/home/ProductRail";
import { formatAed } from "@/lib/format";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Gallery } from "@/components/pdp/Gallery";
import { AddToCartPanel } from "@/components/pdp/AddToCartPanel";
import { ProductTabs } from "@/components/pdp/ProductTabs";
import { Specifications } from "@/components/pdp/Specifications";
import { Reviews } from "@/components/pdp/Reviews";
import { getProductBySlug, getProducts } from "@/lib/vendure/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const trustItems = [
  { icon: ShieldCheck, label: "100% Genuine, official warranty" },
  { icon: Truck, label: "Fast delivery across the UAE" },
  { icon: Lock, label: "Secure payments — Cards, Tabby & Tamara" },
  { icon: RotateCcw, label: "Easy 15-day returns" },
];

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — CoreWAI Supply" };
  return {
    title: `${product.name} — CoreWAI Supply`,
    description: product.description?.slice(0, 160) || `Shop ${product.name} at CoreWAI Supply.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts(12);
  const related = allProducts
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 5);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              ...(product.categorySlug
                ? [{ label: product.category, href: `/category/${product.categorySlug}` }]
                : []),
              { label: product.name },
            ]}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <Gallery images={product.images && product.images.length > 0 ? product.images : [product.image]} alt={product.name} />

            <div className="flex flex-col gap-4">
              {product.brand && (
                <p className="text-sm font-semibold text-primary">{product.brand}</p>
              )}
              <h1 className="font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                {product.name}
              </h1>

              {typeof product.rating === "number" && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber text-amber" />
                  <span className="font-semibold text-foreground">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex flex-wrap items-baseline gap-3 border-t border-border pt-4">
                <span className="font-display text-2xl font-semibold text-foreground tabular-nums">
                  {formatAed(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-muted-foreground line-through tabular-nums">
                    {formatAed(product.compareAtPrice)}
                  </span>
                )}
                {discount && (
                  <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold text-ink">
                    -{discount}%
                  </span>
                )}
              </div>

              <p className="text-sm font-medium">
                {product.inStock === false ? (
                  <span className="text-destructive">Out of stock</span>
                ) : (
                  <span className="text-greenink">In stock — ready to ship</span>
                )}
              </p>

              <AddToCartPanel product={product} />

              <div className="mt-2 grid grid-cols-1 gap-2.5 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ProductTabs
              description={
                product.description ? (
                  <div
                    className="max-w-3xl text-sm leading-relaxed text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No description available for this product yet.
                  </p>
                )
              }
              specifications={<Specifications product={product} />}
              reviews={<Reviews product={product} />}
            />
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                You may also like
              </h2>
              <ProductRail products={related} />
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
