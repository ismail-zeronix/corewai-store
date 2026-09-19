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

const badgeStyles: Record<string, string> = {
  new: "bg-cyan/15 text-cyanink",
  sale: "bg-lime/20 text-ink",
  "low-stock": "bg-amber/15 text-amberink",
  bestseller: "bg-primary text-white",
  trending: "bg-primary/10 text-primary",
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
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-background active:scale-[0.98] transition-transform">
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
                  className="object-contain"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                />
              </div>
            ))}
          </div>
          </Link>

          {label && (
            <span
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[product.badge!]}`}
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
                  className="flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <span className={cn("h-1.5 rounded-full shadow-sm", index === activeImage ? "w-4 bg-primary" : "w-1.5 bg-ink/30")} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link href={`/product/${product.slug}`} className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {product.brand && <p className="text-xs font-medium text-primary">{product.brand}</p>}
          <h3 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
            {product.name}
          </h3>
          </Link>

          {typeof product.rating === "number" && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}

          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 tabular-nums sm:mt-2">
            <span className="font-display text-sm font-bold text-foreground sm:text-base">
              {formatAed(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatAed(product.compareAtPrice)}
              </span>
            )}
          </div>

          {countdownLabel && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive sm:mt-2">
              <Timer className="h-3 w-3" />
              <span className="font-mono tabular-nums">{countdownLabel}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t-0 bg-transparent px-(--card-spacing) pt-0">
        <Button
          size="sm"
          variant="outline"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className={cn(
            "min-h-11 w-full gap-1 rounded-lg border-primary/30 px-2 text-xs text-primary hover:bg-primary/5 hover:text-primary sm:text-sm",
            added && "bg-lime text-ink hover:bg-lime",
          )}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "Added" : outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
