export const SHOP_API_URL = process.env.VENDURE_SHOP_API_URL ?? "http://localhost:3001/shop-api";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function shopApiFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(SHOP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Vendure Shop API request failed with status ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  if (!json.data) {
    throw new Error("Vendure Shop API returned no data");
  }

  return json.data;
}
