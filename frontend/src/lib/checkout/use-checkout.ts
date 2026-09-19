"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart/cart-context";
import type { CheckoutRequestBody, CheckoutResponseBody } from "@/lib/checkout/types";
import {
  processingStages,
  steps,
  type PaymentMethodId,
  type ShippingForm,
  type Step,
} from "@/lib/checkout/constants";

interface OrderSnapshot {
  items: CartItem[];
  subtotal: number;
}

const minDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The checkout state machine, lifted out of the page component.
 *
 * The page was a single 687-line client component holding all of this alongside five
 * full-page render branches — including five separate `<SiteFooter />` calls. Separating
 * the machine from the views lets each step render in isolation and keeps the flow
 * readable in one screen.
 */
export function useCheckout() {
  const { items, subtotal, clear, isHydrated } = useCart();
  const [step, setStep] = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    emirate: "Dubai",
    notes: "",
  });

  const stepIndex = steps.findIndex((s) => s.key === step);

  function updateShipping<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setShipping((current) => ({ ...current, [key]: value }));
  }

  /** Clears a failed attempt and returns to review so the order can be retried. */
  function dismissError() {
    setOrderError(null);
    setStep("review");
  }

  async function placeOrder() {
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
        // Snapshot before clear() — the cart empties immediately, but the confirmation
        // view still needs to show what was actually ordered.
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

  return {
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
  };
}
