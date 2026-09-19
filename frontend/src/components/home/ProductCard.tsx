"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Timer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatAed } from "@/lib/format";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/placeholder-data";

// One solid badge (Best Seller) is the only loud treatment; everything else is a tinted
// label. Hues carry meaning rather than decorating: lime marks a price drop, amber marks
// urgency, neutral marks everything merely descriptive.
const badgeStyles: Record<string, string> = {
  new: "bg-ink/8 text-ink",
  sale: "bg-lime/25 text-ink",
  "low-stock": "bg-amber/20 text-amberink",
  bestseller: "bg-primary text-white",
  trending: "bg-ink/8 text-ink",
  "out-of-stock": "bg-mist text-muted-foreground",
};

function badgeLabel(product: Product) {
  if (!product.badge) return null;
  if (product.badge === "low-stock") return `Only ${product.stockLeft} left`;
  if (product.badge === "sale" && product.compareAtPrice) {
    const percent = Math.round(100 - (product.price / product.compareAtPrice) * 100);
    return `-${percent}%`;
  }
  if (product.badge === "bestseller") return "Best Seller";
  if (product.badge === "new") return "New";
  if (product.badge === "trending") return "Trending";
  if (product.badge === "out-of-stock") return "Out of Stock";
  return null;
}

interface ProductCardProps {
  product: Product;
  countdownLabel?: string;
}

export function ProductCard({ product, countdownLabel }: ProductCardProps) {
  const label = badgeLabel(product);
  const images = product.images && product.images.length > 0 ? product.images.slice(0, 3) : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.inStock === false || product.badge === "out-of-stock";
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Card size="sm" className="h-full min-w-0 gap-2 hover:shadow-elevated sm:gap-3">
      <CardContent className="flex flex-col gap-2 sm:gap-3">
        {/* White, not cloud: supplier product shots are cut out on white, so a tinted
            tile drew a visible grey frame around each one. */}
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-white active:scale-[0.98] transition-transform">
          <Link href={`/product/${product.slug}`} aria-label={product.name} className="block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeImage * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={src} className="relative h-full w-full shrink-0">
                <Image
                  src={src}
                  alt={index === 0 ? product.name : `${product.name} — view ${index + 1}`}
                  fill
                  // Padding on the image (not the container) is what actually insets a
                  // `fill` image: `inset-0` resolves against the parent's padding box, so
                  // padding on the parent would not move it.
                  className="object-contain p-4"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                />
              </div>
            ))}
          </div>
          </Link>

          {label && (
            <span
              className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-caption font-semibold leading-none ${badgeStyles[product.badge!]}`}
            >
              {label}
            </span>
          )}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={index === activeImage}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage(index);
                  }}
                  className="flex size-9 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  {/* Neutral, not brand blue: on a full grid these dots repeated the
                      action colour dozens of times for a secondary affordance. */}
                  <span className={cn("size-1.5 rounded-full transition-colors", index === activeImage ? "bg-ink/70" : "bg-ink/20")} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link href={`/product/${product.slug}`} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {/* Brand keeps its own casing — forcing uppercase would render "Asus" and "Hp". */}
          {product.brand && <p className="text-caption font-medium text-muted-foreground">{product.brand}</p>}
          <h3 className="mt-1 line-clamp-2 font-display text-body-sm font-semibold leading-snug text-foreground sm:text-body">
            {product.name}
          </h3>
          </Link>

          {typeof product.rating === "number" && (
            <div className="mt-2 flex items-center gap-1 text-caption text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" aria-hidden="true" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 tabular-nums">
            <span className="font-display text-body font-semibold text-foreground sm:text-title">
              {formatAed(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-caption text-muted-foreground line-through">
                {formatAed(product.compareAtPrice)}
              </span>
            )}
          </div>

          {countdownLabel && (
            <div className="mt-2 flex items-center gap-1 text-caption font-medium text-destructive">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{countdownLabel}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-(--card-spacing)">
        <Button
          size="sm"
          variant="outline"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className={cn(
            "min-h-11 w-full gap-1.5 border-primary/30 px-2 text-body-sm text-primary hover:bg-primary/5 hover:text-primary",
            // Confirmation reads in the action colour, not lime — lime is reserved for
            // price-drop labelling so it stays meaningful wherever it appears.
            added && "border-primary bg-primary/10 hover:bg-primary/10",
          )}
        >
          {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
          {added ? "Added" : outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
