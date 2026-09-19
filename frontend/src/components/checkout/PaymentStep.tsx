"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paymentMethods, type PaymentMethodId } from "@/lib/checkout/constants";

interface PaymentStepProps {
  paymentMethod: PaymentMethodId;
  setPaymentMethod: (id: PaymentMethodId) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  onBack,
  onContinue,
}: PaymentStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-title font-semibold text-foreground">Payment method</h2>
      <div
        role="radiogroup"
        aria-label="Payment method"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {paymentMethods.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={paymentMethod === id}
            onClick={() => setPaymentMethod(id)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
              paymentMethod === id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/40",
            )}
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-body-sm font-semibold text-foreground">{label}</span>
              <span className="block text-caption text-muted-foreground">{description}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Button size="touch" variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button size="touch" className="gap-1.5" onClick={onContinue}>
          Continue to review
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
