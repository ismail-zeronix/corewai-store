"use client";

import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/checkout/Field";
import { emirates, type ShippingForm } from "@/lib/checkout/constants";

interface ShippingStepProps {
  shipping: ShippingForm;
  updateShipping: <K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) => void;
  onSubmit: () => void;
}

export function ShippingStep({ shipping, updateShipping, onSubmit }: ShippingStepProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <h2 className="font-display text-title font-semibold text-foreground">Shipping details</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Input
            required
            autoComplete="name"
            pattern=".*\S.*"
            value={shipping.fullName}
            onChange={(e) => updateShipping("fullName", e.target.value)}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Phone number">
          <Input
            required
            type="tel"
            autoComplete="tel"
            value={shipping.phone}
            onChange={(e) => updateShipping("phone", e.target.value)}
            placeholder="+971 5X XXX XXXX"
          />
        </Field>
        <Field label="Email" className="sm:col-span-2">
          <Input
            required
            type="email"
            autoComplete="email"
            value={shipping.email}
            onChange={(e) => updateShipping("email", e.target.value)}
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Delivery address" className="sm:col-span-2">
          <Input
            required
            autoComplete="street-address"
            value={shipping.address}
            onChange={(e) => updateShipping("address", e.target.value)}
            placeholder="Street, building, apartment"
          />
        </Field>
        <Field label="Emirate">
          <select
            autoComplete="address-level1"
            value={shipping.emirate}
            onChange={(e) => updateShipping("emirate", e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-body-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {emirates.map((emirate) => (
              <option key={emirate} value={emirate}>
                {emirate}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Delivery notes (optional)">
          <Input
            value={shipping.notes}
            onChange={(e) => updateShipping("notes", e.target.value)}
            placeholder="e.g. Leave with security desk"
          />
        </Field>
      </div>
      <Button size="touch" className="mt-1 w-full gap-1.5 sm:w-fit sm:self-end" type="submit">
        Continue to payment
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
