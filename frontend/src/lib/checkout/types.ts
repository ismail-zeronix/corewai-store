export type PaymentMethodCode = "COD" | "CARD" | "TABBY" | "TAMARA";

export interface CheckoutItemInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutShippingInput {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  emirate: string;
  notes: string;
}

export interface CheckoutRequestBody {
  items: CheckoutItemInput[];
  shipping: CheckoutShippingInput;
  paymentMethodCode: PaymentMethodCode;
}

export type CheckoutResponseBody =
  | { success: true; orderCode: string }
  | { success: false; error: string };
