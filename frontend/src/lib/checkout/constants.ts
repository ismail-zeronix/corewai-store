import {
  Banknote,
  ClipboardCheck,
  CreditCard,
  Home,
  PackageCheck,
  Truck,
  Wallet,
} from "lucide-react";

export type Step = "shipping" | "payment" | "review" | "processing" | "confirmed";

/** Only the three steps a shopper navigates; processing and confirmed are terminal. */
export const steps: { key: Step; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

export const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "tabby", label: "Tabby", description: "Split into 4 interest-free payments", icon: Wallet },
  { id: "tamara", label: "Tamara", description: "Pay later, no extra fees", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: Banknote },
] as const;

export type PaymentMethodId = (typeof paymentMethods)[number]["id"];

export const whatsNextSteps = [
  { icon: PackageCheck, label: "Order confirmed" },
  { icon: Truck, label: "Out for delivery" },
  { icon: Home, label: "Delivered" },
] as const;

export const processingStages = [
  { label: "Validating your order…", icon: ClipboardCheck },
  { label: "Processing payment…", icon: CreditCard },
  { label: "Confirming with our warehouse…", icon: Truck },
] as const;

export const emirates = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

export interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  emirate: string;
  notes: string;
}
