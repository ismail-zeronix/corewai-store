import { NextRequest, NextResponse } from "next/server";
import { SHOP_API_URL } from "@/lib/vendure/shop-client";
import type {
  CheckoutRequestBody,
  CheckoutResponseBody,
  PaymentMethodCode,
} from "@/lib/checkout/types";

const PAYMENT_METHOD_CODES: PaymentMethodCode[] = ["COD", "CARD", "TABBY", "TAMARA"];

interface ErrorResult {
  errorCode: string;
  message: string;
}

interface OrderIdResult {
  id: string;
}

interface OrderCodeResult {
  id: string;
  code: string;
}

interface OrderStateResult {
  id: string;
  state: string;
}

interface OrderPaymentResult {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
}

interface EligibleShippingMethod {
  id: string;
  name: string;
  priceWithTax: number;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

function isErrorResult(value: unknown): value is ErrorResult {
  return typeof value === "object" && value !== null && "errorCode" in value;
}

function unwrap<T>(result: T | ErrorResult): T {
  if (isErrorResult(result)) throw new Error(result.message);
  return result;
}

const ADD_ITEM_MUTATION = `
  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      ... on Order { id code }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_CUSTOMER_MUTATION = `
  mutation SetCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_SHIPPING_ADDRESS_MUTATION = `
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_BILLING_ADDRESS_MUTATION = `
  mutation SetOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_CUSTOM_FIELDS_MUTATION = `
  mutation SetOrderCustomFields($input: UpdateOrderInput!) {
    setOrderCustomFields(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const ELIGIBLE_SHIPPING_METHODS_QUERY = `
  query EligibleShippingMethods {
    eligibleShippingMethods { id name priceWithTax }
  }
`;

const SET_SHIPPING_METHOD_MUTATION = `
  mutation SetOrderShippingMethod($ids: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $ids) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const TRANSITION_TO_STATE_MUTATION = `
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order { id state }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const ADD_PAYMENT_MUTATION = `
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order { id code state totalWithTax }
      ... on ErrorResult { errorCode message }
    }
  }
`;

export async function POST(request: NextRequest) {
  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<CheckoutResponseBody>(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { items, shipping, paymentMethodCode } = body;

  if (!PAYMENT_METHOD_CODES.includes(paymentMethodCode)) {
    return NextResponse.json<CheckoutResponseBody>(
      { success: false, error: "Unsupported payment method" },
      { status: 400 },
    );
  }

  if (!items || items.length === 0) {
    return NextResponse.json<CheckoutResponseBody>(
      { success: false, error: "Your cart is empty" },
      { status: 400 },
    );
  }

  if (items.some((item) => !item.variantId)) {
    return NextResponse.json<CheckoutResponseBody>(
      {
        success: false,
        error: "Some items in your cart are out of date. Please refresh your cart and try again.",
      },
      { status: 400 },
    );
  }

  // Vendure tracks the anonymous order via a session cookie; every call below is a
  // separate fetch, so the cookie has to be captured off each response and replayed
  // on the next request to keep them all operating on the same order.
  let cookie: string | undefined;

  async function shopFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(SHOP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify({ query, variables }),
    });
    const setCookie =
      res.headers.getSetCookie?.() ?? (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")!] : []);
    if (setCookie.length > 0) {
      cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
    }
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data as T;
  }

  try {
    for (const item of items) {
      const result = await shopFetch<{ addItemToOrder: OrderCodeResult | ErrorResult }>(ADD_ITEM_MUTATION, {
        variantId: item.variantId,
        quantity: item.quantity,
      });
      unwrap(result.addItemToOrder);
    }

    const nameParts = shipping.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

    const customerResult = await shopFetch<{ setCustomerForOrder: OrderIdResult | ErrorResult }>(
      SET_CUSTOMER_MUTATION,
      {
        input: {
          firstName,
          lastName,
          emailAddress: shipping.email,
          phoneNumber: shipping.phone,
        },
      },
    );
    unwrap(customerResult.setCustomerForOrder);

    const addressInput = {
      streetLine1: shipping.address,
      // The seeded country record uses the literal code "UAE", not ISO "AE".
      countryCode: "UAE",
      province: shipping.emirate,
      phoneNumber: shipping.phone,
      fullName: shipping.fullName,
    };

    const shippingAddressResult = await shopFetch<{ setOrderShippingAddress: OrderIdResult | ErrorResult }>(
      SET_SHIPPING_ADDRESS_MUTATION,
      { input: addressInput },
    );
    unwrap(shippingAddressResult.setOrderShippingAddress);

    const billingAddressResult = await shopFetch<{ setOrderBillingAddress: OrderIdResult | ErrorResult }>(
      SET_BILLING_ADDRESS_MUTATION,
      { input: addressInput },
    );
    unwrap(billingAddressResult.setOrderBillingAddress);

    if (shipping.notes.trim()) {
      const customFieldsResult = await shopFetch<{ setOrderCustomFields: OrderIdResult | ErrorResult }>(
        SET_CUSTOM_FIELDS_MUTATION,
        { input: { customFields: { customerNotes: shipping.notes } } },
      );
      unwrap(customFieldsResult.setOrderCustomFields);
    }

    const shippingMethodsResult = await shopFetch<{ eligibleShippingMethods: EligibleShippingMethod[] }>(
      ELIGIBLE_SHIPPING_METHODS_QUERY,
    );
    const eligibleMethods = shippingMethodsResult.eligibleShippingMethods;
    if (eligibleMethods.length === 0) throw new Error("No delivery methods available");

    const setShippingMethodResult = await shopFetch<{ setOrderShippingMethod: OrderIdResult | ErrorResult }>(
      SET_SHIPPING_METHOD_MUTATION,
      { ids: [eligibleMethods[0].id] },
    );
    unwrap(setShippingMethodResult.setOrderShippingMethod);

    const transitionResult = await shopFetch<{ transitionOrderToState: OrderStateResult | ErrorResult }>(
      TRANSITION_TO_STATE_MUTATION,
      { state: "ArrangingPayment" },
    );
    unwrap(transitionResult.transitionOrderToState);

    const paymentResult = await shopFetch<{ addPaymentToOrder: OrderPaymentResult | ErrorResult }>(
      ADD_PAYMENT_MUTATION,
      { input: { method: paymentMethodCode, metadata: {} } },
    );
    const order = unwrap(paymentResult.addPaymentToOrder);

    if (order.state !== "PaymentSettled") {
      throw new Error(`Order could not be completed (status: ${order.state})`);
    }

    return NextResponse.json<CheckoutResponseBody>({ success: true, orderCode: order.code });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json<CheckoutResponseBody>({ success: false, error: message }, { status: 500 });
  }
}
