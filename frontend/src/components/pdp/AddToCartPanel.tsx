"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "@/components/pdp/VariantSelector";
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

  const optionGroups = useMemo(() => product.optionGroups ?? [], [product.optionGroups]);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  // Default to the first in-stock variant so the page opens on something buyable.
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial = variants.find((v) => v.inStock) ?? variants[0];
    if (!initial) return {};
    const map: Record<string, string> = {};
    for (const group of optionGroups) {
      const match = group.options.find((option) => initial.optionIds.includes(option.id));
      if (match) map[group.id] = match.id;
    }
    return map;
  });

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return undefined;
    if (optionGroups.length === 0) return variants[0];
    const wanted = Object.values(selected);
    return (
      variants.find(
        (variant) =>
          wanted.length === variant.optionIds.length &&
          wanted.every((id) => variant.optionIds.includes(id)),
      ) ?? variants[0]
    );
  }, [variants, optionGroups, selected]);

  // Price and stock follow the selection rather than the product's first variant.
  const price = selectedVariant?.price ?? product.price;
  const outOfStock =
    product.badge === "out-of-stock" ||
    (selectedVariant ? !selectedVariant.inStock : product.inStock === false);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  function handleSelect(groupId: string, optionId: string) {
    setSelected((current) => ({ ...current, [groupId]: optionId }));
  }

  function itemForCart(): Product {
    // Carry the chosen variant's id, sku and price into the cart line.
    if (!selectedVariant) return product;
    return {
      ...product,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku ?? product.sku,
      price: selectedVariant.price,
    };
  }

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(itemForCart(), quantity);
    setAdded(true);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(itemForCart(), quantity);
    router.push("/checkout");
  }

  const buttonLabel = outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart";
  const buttonIcon = added ? (
    <Check className="size-4" aria-hidden="true" />
  ) : (
    <ShoppingCart className="size-4" aria-hidden="true" />
  );

  const discount =
    product.compareAtPrice && product.compareAtPrice > price
      ? Math.round(100 - (price / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Price and stock live here, not on the server-rendered page. Rendered there they
          were read from variants[0], so selecting a different configuration left the
          displayed price behind while the cart received the selected variant's price. */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-h2 font-semibold tracking-tight text-foreground tabular-nums">
            {formatAed(price)}
          </span>
          {discount && product.compareAtPrice && (
            <span className="text-body-sm text-muted-foreground line-through tabular-nums">
              {formatAed(product.compareAtPrice)}
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-lime/25 px-2.5 py-1 text-caption font-semibold leading-none text-ink">
              −{discount}%
            </span>
          )}
        </div>
        <p aria-live="polite" className="mt-2 text-body-sm font-medium">
          {outOfStock ? (
            <span className="text-destructive">Out of stock</span>
          ) : (
            <span className="text-primary">In stock — ready to ship</span>
          )}
        </p>
      </div>

      <VariantSelector
        optionGroups={optionGroups}
        variants={variants}
        selected={selected}
        onSelect={handleSelect}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-3">
        <div className="flex items-center gap-3">
          <span id="product-quantity-label" className="text-body-sm font-medium text-muted-foreground">
            Quantity
          </span>
          <div
            role="group"
            aria-labelledby="product-quantity-label"
            className="flex items-center rounded-lg border border-border bg-cloud"
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={outOfStock || quantity === 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-mist/50 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 motion-safe:active:scale-95"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <output aria-live="polite" className="min-w-6 px-1 text-center text-body-sm font-semibold tabular-nums">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={outOfStock}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-mist/50 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 motion-safe:active:scale-95"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex min-h-11 items-center gap-1 rounded-lg px-1 text-body-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 md:hidden"
        >
          Buy now
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* One clear primary. These were two equally weighted buttons side by side, so
          neither led. Add to cart is the action the page is for; Buy now is the shortcut. */}
      <div className="hidden gap-3 md:flex">
        <Button
          size="touch"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className={cn("flex-[2]", added && "bg-primary/10 text-primary hover:bg-primary/15")}
        >
          {buttonIcon}
          {buttonLabel}
        </Button>
        <Button
          size="touch"
          variant="outline"
          disabled={outOfStock}
          onClick={handleBuyNow}
          className="flex-1 border-border bg-white text-foreground hover:bg-cloud"
        >
          Buy now
        </Button>
      </div>

      <div
        role="region"
        aria-label="Purchase this product"
        className="mobile-purchase-bar fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white md:hidden"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4">
          <div className="min-w-0 flex-[2]">
            <p className="text-caption text-muted-foreground">
              {quantity > 1 ? `Total · ${quantity} items` : "Price"}
            </p>
            <p className="break-words font-display text-body font-semibold leading-tight tracking-tight text-ink tabular-nums">
              {formatAed(price * quantity)}
            </p>
          </div>
          <Button
            size="touch"
            disabled={outOfStock}
            onClick={handleAddToCart}
            className={cn("min-w-0 flex-[3]", added && "bg-primary/10 text-primary hover:bg-primary/15")}
          >
            {!outOfStock && buttonIcon}
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
