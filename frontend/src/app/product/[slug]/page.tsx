import { whatsappUrl } from "@/lib/store-contact";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, Lock, RotateCcw, Star, ChevronLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
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
  { icon: ShieldCheck, label: "100% Genuine, official warranty", shortLabel: "Official warranty" },
  { icon: Truck, label: "Fast delivery across the UAE", shortLabel: "UAE delivery" },
  { icon: Lock, label: "Secure payments — Cards, Tabby & Tamara", shortLabel: "Secure payments" },
  { icon: RotateCcw, label: "Easy 15-day returns", shortLabel: "Easy returns" },
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
      <main id="main-content" tabIndex={-1} className="product-page min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-1 md:px-6 md:py-4 lg:px-8">
          <Link href={product.categorySlug ? `/category/${product.categorySlug}` : "/products"} className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-md text-xs font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden">
            <ChevronLeft className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">{product.category || "All products"}</span>
          </Link>
          <div className="hidden md:block">
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
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-12 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 lg:gap-10">
            <Gallery key={product.id} images={product.images && product.images.length > 0 ? product.images : [product.image]} alt={product.name} />

            <div className="flex min-w-0 flex-col gap-3">
              {product.brand && (
                <p className="text-xs font-semibold text-primary">{product.brand}</p>
              )}
              <h1 className="break-words font-display text-lg font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
                {product.name}
              </h1>

              {typeof product.rating === "number" && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber text-amber" />
                  <span className="font-semibold text-foreground">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex flex-wrap items-baseline gap-2 border-t border-border pt-3">
                <span className="font-display text-xl font-semibold tracking-tight text-foreground tabular-nums md:text-2xl">
                  {formatAed(product.price)}
                </span>
                {discount && product.compareAtPrice && (
                  <span className="text-xs text-muted-foreground line-through tabular-nums md:text-sm">
                    {formatAed(product.compareAtPrice)}
                  </span>
                )}
                {discount && (
                  <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-bold text-ink">
                    -{discount}%
                  </span>
                )}
              </div>

              <p className="text-xs font-medium">
                {product.inStock === false || product.badge === "out-of-stock" ? (
                  <span className="text-destructive">Out of stock</span>
                ) : (
                  <span className="text-primary">In stock — ready to ship</span>
                )}
              </p>

              <AddToCartPanel key={product.id} product={product} />

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-primary/5 p-3 md:p-4">
                {trustItems.map(({ icon: Icon, label, shortLabel }) => (
                  <div key={label} className="flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                    <span className="md:hidden">{shortLabel}</span><span className="hidden md:inline">{label}</span>
                  </div>
                ))}
              </div>
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs font-medium text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden">
                <MessageCircle className="size-4" aria-hidden="true" />Need help choosing? Chat with us
              </a>}
            </div>
          </div>

          <div className="mt-5 md:mt-10">
            <ProductTabs
              key={product.id}
              description={
                product.description ? (
                  <div
                    className="max-w-3xl break-words text-sm leading-relaxed text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:h-auto [&_img]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/<a\b[^>]*\bhref=(['"])#\1[^>]*>([\s\S]*?)<\/a>/gi, "$2") }}
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
            <div className="mt-6 md:mt-12">
              <h2 className="mb-3 font-display text-base font-semibold tracking-tight text-foreground md:text-lg">
                You may also like
              </h2>
              <ProductRail products={related} />
            </div>
          )}
        </div>
      </main>
      <SiteFooter mobile="hidden" />
      <WhatsAppButton />
    </>
  );
}
