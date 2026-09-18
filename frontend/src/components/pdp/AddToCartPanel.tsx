"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { formatAed } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/placeholder-data";

interface AddToCartPanelProps {
  product: Product;
}

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outOfStock = product.inStock === false || product.badge === "out-of-stock";

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(product, quantity);
    router.push("/checkout");
  }

  const buttonLabel = outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart";
  const buttonIcon = added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingCart className="size-4" aria-hidden="true" />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-3">
        <div className="flex items-center gap-3">
          <span id="product-quantity-label" className="text-xs font-medium text-muted-foreground">Quantity</span>
          <div role="group" aria-labelledby="product-quantity-label" className="flex items-center rounded-lg border border-border bg-cloud">
            <button type="button" aria-label="Decrease quantity" disabled={outOfStock || quantity === 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-mist/50 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 motion-safe:active:scale-95">
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <output aria-live="polite" className="min-w-6 px-1 text-center text-sm font-semibold tabular-nums">{quantity}</output>
            <button type="button" aria-label="Increase quantity" disabled={outOfStock}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-mist/50 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 motion-safe:active:scale-95">
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <button type="button" onClick={handleBuyNow} disabled={outOfStock}
          className="flex min-h-11 items-center gap-1 rounded-lg px-1 text-xs font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 md:hidden">
          Buy now<ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="hidden gap-3 md:grid md:grid-cols-2">
        <Button size="touch" disabled={outOfStock} onClick={handleAddToCart} className={cn(added && "bg-primary/10 text-primary hover:bg-primary/15")}>
          {buttonIcon}{buttonLabel}
        </Button>
        <Button size="touch" variant="outline" disabled={outOfStock} onClick={handleBuyNow} className="border-primary/30 bg-white text-primary hover:bg-primary/5">Buy now</Button>
      </div>

      <div role="region" aria-label="Purchase this product" className="mobile-purchase-bar fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white md:hidden">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4">
          <div className="min-w-0 flex-[2]">
            <p className="text-xs text-muted-foreground">{quantity > 1 ? `Total · ${quantity} items` : "Price"}</p>
            <p className="break-words font-display text-base font-semibold leading-tight tracking-tight text-ink tabular-nums">{formatAed(product.price * quantity)}</p>
          </div>
          <Button size="touch" disabled={outOfStock} onClick={handleAddToCart} className={cn("min-w-0 flex-[3]", added && "bg-primary/10 text-primary hover:bg-primary/15")}>
            {!outOfStock && buttonIcon}{buttonLabel}
          </Button>
        </div>
      </div>
      <span role="status" className="sr-only">{added ? `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart` : ""}</span>
    </div>
  );
}
