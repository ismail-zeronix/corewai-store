"use client";

import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentMethods, type PaymentMethodId, type ShippingForm } from "@/lib/checkout/constants";

interface ReviewStepProps {
  shipping: ShippingForm;
  paymentMethod: PaymentMethodId;
  itemCount: number;
  onBack: () => void;
  onPlaceOrder: () => void;
}

/** Small labelled block. Replaces the tracked-out all-caps captions used before. */
function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-caption font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function ReviewStep({
  shipping,
  paymentMethod,
  itemCount,
  onBack,
  onPlaceOrder,
}: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-title font-semibold text-foreground">Review your order</h2>

      <Detail label="Shipping to">
        <p className="text-body-sm text-foreground">
          {shipping.fullName} · {shipping.phone}
        </p>
        <p className="text-body-sm text-muted-foreground">
          {shipping.address}, {shipping.emirate}
        </p>
      </Detail>

      <Detail label="Payment method">
        <p className="text-body-sm text-foreground">
          {paymentMethods.find((m) => m.id === paymentMethod)?.label}
        </p>
      </Detail>

      <p className="text-caption text-muted-foreground lg:hidden">
        Review your {itemCount} {itemCount === 1 ? "item" : "items"} in the order summary above.
      </p>

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Button size="touch" variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button size="touch" className="gap-1.5" onClick={onPlaceOrder}>
          Place order
          <Truck className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
