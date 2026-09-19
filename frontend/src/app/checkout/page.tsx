"use client";

import Link from "next/link";
import { Check, PartyPopper, Loader2, AlertCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { OrderItemsList } from "@/components/checkout/OrderItemsList";
import { CartLineSkeleton, OrderSummarySkeleton } from "@/components/cart/CartSkeleton";
import { formatAed } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/constants";
import { cn } from "@/lib/utils";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { useCheckout } from "@/lib/checkout/use-checkout";
import { paymentMethods, processingStages, steps, whatsNextSteps } from "@/lib/checkout/constants";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    isHydrated,
    step,
    setStep,
    stepIndex,
    paymentMethod,
    setPaymentMethod,
    shipping,
    updateShipping,
    orderNumber,
    orderSnapshot,
    processingStage,
    orderError,
    dismissError,
    placeOrder,
  } = useCheckout();

  if (step === "confirmed") {
    return (
      <>
        <main id="main-content" tabIndex={-1} className="checkout-page flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {orderSnapshot ? (
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
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

                <div className="mt-4 w-full rounded-xl border border-border bg-white p-5 text-left sm:p-6">
                  <h2 className="font-display text-base font-bold text-foreground">Order summary</h2>
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

                <div className="grid w-full grid-cols-3 gap-2 rounded-xl border border-border bg-white p-4 sm:gap-4 sm:p-5">
                  {whatsNextSteps.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-caption font-medium text-foreground ">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/products"
                    className="rounded-lg bg-primary px-5 py-2.5 text-body-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Continue shopping
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
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                    className="rounded-lg bg-primary px-5 py-2.5 text-body-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Continue shopping
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
        <WhatsAppButton />
      </>
    );
  }

  if (step === "processing") {
    return (
      <>
        <main id="main-content" tabIndex={-1} className="checkout-page flex-1">
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
                  <p role="alert" className="text-sm text-muted-foreground">{orderError}</p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Button size="touch" onClick={placeOrder}>
                      Try again
                    </Button>
                    <Button
                      size="touch"
                      variant="outline"
                      onClick={dismissError}
                    >
                      Back to review
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

                  <div className="mt-4 flex w-full flex-col gap-4 rounded-xl border border-border bg-white p-5 text-left sm:p-6">
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
                                ? "bg-primary text-white"
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
        <WhatsAppButton />
      </>
    );
  }

  if (!isHydrated) {
    return (
      <>
        <main id="main-content" tabIndex={-1} className="checkout-page flex-1">
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
        <WhatsAppButton />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <main id="main-content" tabIndex={-1} className="checkout-page flex-1">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
            <p className="font-display text-xl font-bold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add something to your cart before checking out.</p>
            <Link
              href="/products"
              className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-body-sm font-semibold text-white hover:bg-primary/90"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <main id="main-content" tabIndex={-1} className="checkout-page flex-1">
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
                        ? "bg-primary text-white"
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
            <Accordion className="rounded-xl border border-border bg-white px-4">
              <AccordionItem value="order-summary">
                <AccordionTrigger className="py-3.5 text-sm font-semibold text-foreground hover:no-underline">
                  <span className="flex flex-wrap items-baseline gap-x-1.5">
                    <span>Order summary</span>
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
            <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
              {step === "shipping" && (
                <ShippingStep
                  shipping={shipping}
                  updateShipping={updateShipping}
                  onSubmit={() => setStep("payment")}
                />
              )}

              {step === "payment" && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onBack={() => setStep("shipping")}
                  onContinue={() => setStep("review")}
                />
              )}

              {step === "review" && (
                <ReviewStep
                  shipping={shipping}
                  paymentMethod={paymentMethod}
                  itemCount={items.length}
                  onBack={() => setStep("payment")}
                  onPlaceOrder={placeOrder}
                />
              )}
            </div>

            <div className="hidden rounded-xl border border-border bg-white p-5 lg:block lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-base font-bold text-foreground">Order summary</h2>
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
      <WhatsAppButton />
    </>
  );
}

