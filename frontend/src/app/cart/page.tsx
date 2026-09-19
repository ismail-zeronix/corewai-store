"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Button } from "@/components/ui/button";
import { CartLineSkeleton, OrderSummarySkeleton } from "@/components/cart/CartSkeleton";
import { formatAed } from "@/lib/format";
import { useCart } from "@/lib/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/constants";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, isHydrated } = useCart();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="cart-page flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              Shopping Cart
            </h1>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Shopping
            </Link>
          </div>

          {!isHydrated ? (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
              <div className="flex flex-col gap-3">
                <CartLineSkeleton />
                <CartLineSkeleton />
                <CartLineSkeleton />
              </div>
              <OrderSummarySkeleton />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-white px-6 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Looks like you haven&apos;t added anything yet. Start exploring our catalogue.
              </p>
              <Link
                href="/products"
                className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
              <div className="flex flex-col gap-3">
                {remainingForFreeShipping > 0 ? (
                  <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                    Add {formatAed(remainingForFreeShipping)} more to get FREE shipping
                  </div>
                ) : (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-body-sm font-medium text-primary">
                    You&apos;ve unlocked FREE shipping on this order
                  </div>
                )}

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-border bg-white p-3 md:gap-4 md:p-4"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cloud sm:h-24 sm:w-24"
                    >
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="96px" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        {item.brand && <p className="text-xs font-medium text-primary">{item.brand}</p>}
                        <Link
                          href={`/product/${item.slug}`}
                          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-11 w-11 items-center justify-center text-foreground hover:bg-cloud disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-11 w-11 items-center justify-center text-foreground hover:bg-cloud disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm font-bold text-foreground tabular-nums">
                            {formatAed(item.price * item.quantity)}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name} from cart`}
                            onClick={() => removeItem(item.id)}
                            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-fit rounded-xl border border-border bg-white p-5 lg:sticky lg:top-24 lg:self-start">
                <h2 className="font-display text-base font-bold text-foreground">Order Summary</h2>
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-foreground">{formatAed(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{remainingForFreeShipping > 0 ? "Calculated at checkout" : "Free"}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-semibold text-foreground">Estimated total</span>
                  <span className="font-display text-lg font-semibold text-foreground tabular-nums">
                    {formatAed(subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Estimated delivery: same-day in Dubai, next-day across the other Emirates
                </p>

                <Button
                  size="touch"
                  className="mt-5 w-full gap-1.5"
                  render={
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Secure checkout — Cards, Tabby & Tamara
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
