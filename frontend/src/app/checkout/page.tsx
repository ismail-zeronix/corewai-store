"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CreditCard,
  Truck,
  Wallet,
  Banknote,
  ArrowLeft,
  ArrowRight,
  PartyPopper,
  PackageCheck,
  Home,
  ClipboardCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { OrderItemsList } from "@/components/checkout/OrderItemsList";
import { CartLineSkeleton, OrderSummarySkeleton } from "@/components/cart/CartSkeleton";
import { formatAed } from "@/lib/format";
import { useCart, type CartItem } from "@/lib/cart/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/constants";
import { cn } from "@/lib/utils";
import type { CheckoutRequestBody, CheckoutResponseBody } from "@/lib/checkout/types";

type Step = "shipping" | "payment" | "review" | "processing" | "confirmed";

const steps: { key: Step; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "tabby", label: "Tabby", description: "Split into 4 interest-free payments", icon: Wallet },
  { id: "tamara", label: "Tamara", description: "Pay later, no extra fees", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
] as const;

const whatsNextSteps = [
  { icon: PackageCheck, label: "Order confirmed" },
  { icon: Truck, label: "Out for delivery" },
  { icon: Home, label: "Delivered" },
] as const;

const processingStages = [
  { label: "Validating your order…", icon: ClipboardCheck },
  { label: "Processing payment…", icon: CreditCard },
  { label: "Confirming with our warehouse…", icon: Truck },
] as const;

const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

const minDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  emirate: string;
  notes: string;
}

interface OrderSnapshot {
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutPage() {
  const { items, subtotal, clear, isHydrated } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["id"]>("card");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    emirate: emirates[0],
    notes: "",
  });

  const stepIndex = steps.findIndex((s) => s.key === step);

  function updateShipping<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setShipping((current) => ({ ...current, [key]: value }));
  }

  async function handlePlaceOrder() {
    setOrderError(null);
    setStep("processing");
    setProcessingStage(0);

    const advanceStage = setInterval(() => {
      setProcessingStage((stage) => Math.min(stage + 1, processingStages.length - 1));
    }, 700);

    try {
      const requestBody: CheckoutRequestBody = {
        items: items.map((item) => ({ variantId: item.variantId ?? "", quantity: item.quantity })),
        shipping,
        paymentMethodCode: paymentMethod.toUpperCase() as CheckoutRequestBody["paymentMethodCode"],
      };

      const fetchPromise = fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }).then(async (res) => ({ ok: res.ok, body: (await res.json()) as CheckoutResponseBody }));

      // Guarantees the stage animation gets to play for at least ~1.8s even on a fast
      // localhost round trip, while never truncating a real call that takes longer —
      // the UI just parks on the final stage until fetchPromise actually resolves.
      const [{ ok, body: result }] = await Promise.all([fetchPromise, minDelay(1800)]);

      if (ok && result.success) {
        // Snapshot before clear() — the cart empties immediately, but the
        // confirmation view still needs to show what was actually ordered.
        setOrderSnapshot({ items, subtotal });
        clear();
        setOrderNumber(result.orderCode);
        setStep("confirmed");
      } else {
        setOrderError(!result.success ? result.error : "Something went wrong placing your order.");
      }
    } catch {
      setOrderError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      clearInterval(advanceStage);
    }
  }

  if (step === "confirmed") {
    return (
      <>
        <SiteHeader />
        <main className="checkout-page flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {orderSnapshot ? (
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink">
                  <PartyPopper className="h-8 w-8" />
                </span>
                <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  Order placed!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Thanks, {shipping.fullName || "there"} — your order{" "}
                  <span className="font-semibold text-foreground">{orderNumber}</span> has been received.
                  A confirmation will be sent to {shipping.email || "your email"} and via WhatsApp.
                </p>

                <div className="mt-4 w-full rounded-2xl border border-border bg-white p-5 text-left sm:p-6">
                  <h2 className="font-display text-base font-bold text-foreground">Order Summary</h2>
                  <OrderItemsList items={orderSnapshot.items} className="mt-4" />

                  <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="tabular-nums text-foreground">{formatAed(orderSnapshot.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{orderSnapshot.subtotal >= FREE_SHIPPING_THRESHOLD ? "Free" : "TBD"}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatAed(orderSnapshot.subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Shipping to
                      </p>
                      <p className="text-sm text-foreground">
                        {shipping.fullName} · {shipping.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shipping.address}, {shipping.emirate}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Payment method
                      </p>
                      <p className="text-sm text-foreground">
                        {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-border bg-white p-4 sm:gap-4 sm:p-5">
                  {whatsNextSteps.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-[11px] font-medium text-foreground sm:text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/products"
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-cloud"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink">
                  <PartyPopper className="h-8 w-8" />
                </span>
                <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  Order placed!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Thanks — your order{" "}
                  {orderNumber && <span className="font-semibold text-foreground">{orderNumber}</span>} has
                  been received.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/products"
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-cloud"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
        <SiteFooter mobile="compact" />
        <WhatsAppButton />
      </>
    );
  }

  if (step === "processing") {
    return (
      <>
        <SiteHeader />
        <main className="checkout-page flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              {orderError ? (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                  </span>
                  <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                    We couldn&apos;t place your order
                  </h1>
                  <p className="text-sm text-muted-foreground">{orderError}</p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Button size="touch" onClick={handlePlaceOrder}>
                      Try Again
                    </Button>
                    <Button
                      size="touch"
                      variant="outline"
                      onClick={() => {
                        setOrderError(null);
                        setStep("review");
                      }}
                    >
                      Back to Review
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </span>
                  <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                    Placing your order…
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    This will just take a moment — please don&apos;t close this window.
                  </p>

                  <div className="mt-4 flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-5 text-left sm:p-6">
                    {processingStages.map((stage, index) => {
                      const isDone = index < processingStage;
                      const isCurrent = index === processingStage;
                      const Icon = stage.icon;
                      return (
                        <div key={stage.label} className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              isDone
                                ? "bg-lime text-ink"
                                : isCurrent
                                  ? "bg-primary text-white"
                                  : "bg-mist text-muted-foreground",
                            )}
                          >
                            {isDone ? (
                              <Check className="h-4 w-4" />
                            ) : isCurrent ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isDone || isCurrent ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <SiteFooter mobile="compact" />
        <WhatsAppButton />
      </>
    );
  }

  if (!isHydrated) {
    return (
      <>
        <SiteHeader />
        <main className="checkout-page flex-1">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
              <div className="flex flex-col gap-3">
                <CartLineSkeleton />
                <CartLineSkeleton />
              </div>
              <OrderSummarySkeleton />
            </div>
          </div>
        </main>
        <SiteFooter mobile="compact" />
        <WhatsAppButton />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="checkout-page flex-1">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
            <p className="font-display text-xl font-bold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add something to your cart before checking out.</p>
            <Link
              href="/products"
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <SiteFooter mobile="compact" />
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="checkout-page flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      index < stepIndex
                        ? "bg-lime text-ink"
                        : index === stepIndex
                          ? "bg-primary text-white"
                          : "bg-mist text-muted-foreground",
                    )}
                  >
                    {index < stepIndex ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      index === stepIndex ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && <div className="h-px w-6 bg-border sm:w-12" />}
              </div>
            ))}
          </div>

          <div className="mb-6 lg:hidden">
            <Accordion className="rounded-2xl border border-border bg-white px-4">
              <AccordionItem value="order-summary">
                <AccordionTrigger className="py-3.5 text-sm font-semibold text-foreground hover:no-underline">
                  <span className="flex flex-wrap items-baseline gap-x-1.5">
                    <span>Order Summary</span>
                    <span className="font-normal text-muted-foreground">
                      · {items.length} {items.length === 1 ? "item" : "items"} · {formatAed(subtotal)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <OrderItemsList items={items} className="pb-3" />
                  <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({items.length} items)</span>
                      <span className="tabular-nums text-foreground">{formatAed(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? "Free" : "TBD"}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatAed(subtotal)}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
              {step === "shipping" && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-display text-lg font-bold text-foreground">Shipping Details</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full Name">
                      <Input
                        required
                        value={shipping.fullName}
                        onChange={(e) => updateShipping("fullName", e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </Field>
                    <Field label="Phone Number">
                      <Input
                        required
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => updateShipping("phone", e.target.value)}
                        placeholder="+971 5X XXX XXXX"
                      />
                    </Field>
                    <Field label="Email" className="sm:col-span-2">
                      <Input
                        required
                        type="email"
                        value={shipping.email}
                        onChange={(e) => updateShipping("email", e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </Field>
                    <Field label="Delivery Address" className="sm:col-span-2">
                      <Input
                        required
                        value={shipping.address}
                        onChange={(e) => updateShipping("address", e.target.value)}
                        placeholder="Street, building, apartment"
                      />
                    </Field>
                    <Field label="Emirate">
                      <select
                        value={shipping.emirate}
                        onChange={(e) => updateShipping("emirate", e.target.value)}
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {emirates.map((emirate) => (
                          <option key={emirate} value={emirate}>
                            {emirate}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Delivery Notes (optional)">
                      <Input
                        value={shipping.notes}
                        onChange={(e) => updateShipping("notes", e.target.value)}
                        placeholder="e.g. Leave with security desk"
                      />
                    </Field>
                  </div>
                  <Button
                    size="touch"
                    className="mt-2 w-full gap-1.5 sm:w-fit sm:self-end"
                    disabled={!shipping.fullName || !shipping.phone || !shipping.email || !shipping.address}
                    onClick={() => setStep("payment")}
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === "payment" && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-display text-lg font-bold text-foreground">Payment Method</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {paymentMethods.map(({ id, label, description, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                          paymentMethod === id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>
                          <span className="block text-sm font-semibold text-foreground">{label}</span>
                          <span className="block text-xs text-muted-foreground">{description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <Button size="touch" variant="outline" onClick={() => setStep("shipping")} className="gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button size="touch" className="gap-1.5" onClick={() => setStep("review")}>
                      Continue to Review
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display text-lg font-bold text-foreground">Review Your Order</h2>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Shipping to
                    </p>
                    <p className="text-sm text-foreground">
                      {shipping.fullName} · {shipping.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shipping.address}, {shipping.emirate}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Payment method
                    </p>
                    <p className="text-sm text-foreground">
                      {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground lg:hidden">
                    Review your {items.length} {items.length === 1 ? "item" : "items"} in the Order Summary above.
                  </p>

                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <Button size="touch" variant="outline" onClick={() => setStep("payment")} className="gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button size="touch" className="gap-1.5" onClick={handlePlaceOrder}>
                      Place Order
                      <Truck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden rounded-2xl border border-border bg-white p-5 lg:block lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-base font-bold text-foreground">Order Summary</h2>
              <OrderItemsList items={items} className="mt-4" />
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="tabular-nums text-foreground">{formatAed(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? "Free" : "TBD"}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display text-lg font-semibold text-foreground tabular-nums">
                  {formatAed(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter mobile="compact" />
      <WhatsAppButton />
    </>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
