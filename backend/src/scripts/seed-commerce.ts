/**
 * One-time data seeding against a running Vendure server's Admin API — not a schema migration.
 * Creates the "Standard Delivery" ShippingMethod (backing the storefront's free-over-AED-300
 * promise) and placeholder CARD/TABBY/TAMARA PaymentMethods.
 *
 * IMPORTANT: CARD, TABBY and TAMARA all use `dummy-payment-handler` with `automaticSettle: true`,
 * exactly like the existing COD method. There is no real gateway integration behind any of them
 * yet — no Stripe/Tabby/Tamara API keys exist anywhere in this codebase. These are deliberate,
 * temporary placeholders so checkout isn't blocked on gateway integration (a separate task).
 * Swap each for a real PaymentMethodHandler before this store takes payments for real.
 *
 * Usage: npx ts-node src/scripts/seed-commerce.ts
 * Reads ADMIN_API_URL / SUPERADMIN_USERNAME / SUPERADMIN_PASSWORD from the environment,
 * falling back to the local dev defaults.
 */
import 'dotenv/config';

const ADMIN_API_URL = process.env.ADMIN_API_URL ?? 'http://localhost:3001/admin-api';
const USERNAME = process.env.SUPERADMIN_USERNAME ?? 'superadmin';
const PASSWORD = process.env.SUPERADMIN_PASSWORD ?? 'superadmin';

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

class AdminApiClient {
    private cookie: string | undefined;

    async login(): Promise<void> {
        const res = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `mutation Login($u: String!, $p: String!) {
                    login(username: $u, password: $p) {
                        __typename
                        ... on CurrentUser { identifier }
                        ... on ErrorResult { errorCode message }
                    }
                }`,
                variables: { u: USERNAME, p: PASSWORD },
            }),
        });
        // Vendure's cookie session sets two cookies (session + session.sig); both must be sent
        // back together. `getSetCookie()` is required here — `.get('set-cookie')` collapses
        // multiple Set-Cookie headers into one comma-joined string that can't be split safely.
        const setCookies = res.headers.getSetCookie();
        if (setCookies.length === 0) {
            throw new Error('Login did not return a session cookie');
        }
        this.cookie = setCookies.map(c => c.split(';')[0]).join('; ');
        const body = (await res.json()) as GraphQLResponse<{ login: { __typename: string; message?: string } }>;
        if (body.data?.login.__typename !== 'CurrentUser') {
            throw new Error(`Login failed: ${body.data?.login.message ?? JSON.stringify(body.errors)}`);
        }
    }

    async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
        if (!this.cookie) {
            throw new Error('Not logged in');
        }
        const res = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: this.cookie },
            body: JSON.stringify({ query, variables }),
        });
        const body = (await res.json()) as GraphQLResponse<T>;
        if (body.errors?.length) {
            throw new Error(`GraphQL error: ${body.errors.map(e => e.message).join('; ')}`);
        }
        if (!body.data) {
            throw new Error('GraphQL response had no data');
        }
        return body.data;
    }
}

async function ensureShippingMethod(client: AdminApiClient): Promise<{ id: string; name: string }> {
    const existing = await client.request<{ shippingMethods: { items: Array<{ id: string; code: string; name: string }> } }>(
        `{ shippingMethods(options: { take: 100 }) { items { id code name } } }`,
    );
    const found = existing.shippingMethods.items.find(m => m.code === 'standard-delivery');
    if (found) {
        return found;
    }
    const result = await client.request<{ createShippingMethod: { id: string; name: string } }>(
        `mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
            createShippingMethod(input: $input) { id name }
        }`,
        {
            input: {
                code: 'standard-delivery',
                fulfillmentHandler: 'manual-fulfillment',
                checker: { code: 'default-shipping-eligibility-checker', arguments: [{ name: 'orderMinimum', value: '0' }] },
                calculator: { code: 'free-over-threshold-shipping-calculator', arguments: [] },
                translations: [
                    { languageCode: 'en', name: 'Standard Delivery', description: 'Free over AED 300, otherwise a flat AED 15 fee' },
                ],
            },
        },
    );
    return result.createShippingMethod;
}

interface PlaceholderPaymentMethod {
    code: string;
    name: string;
}

const PLACEHOLDER_PAYMENT_METHODS: PlaceholderPaymentMethod[] = [
    { code: 'CARD', name: 'Credit / Debit Card' },
    { code: 'TABBY', name: 'Tabby' },
    { code: 'TAMARA', name: 'Tamara' },
];

async function ensurePaymentMethod(client: AdminApiClient, method: PlaceholderPaymentMethod): Promise<{ id: string; code: string }> {
    const existing = await client.request<{ paymentMethods: { items: Array<{ id: string; code: string }> } }>(
        `{ paymentMethods(options: { take: 100 }) { items { id code } } }`,
    );
    const found = existing.paymentMethods.items.find(m => m.code === method.code);
    if (found) {
        return found;
    }
    const result = await client.request<{ createPaymentMethod: { id: string; code: string } }>(
        `mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
            createPaymentMethod(input: $input) { id code }
        }`,
        {
            input: {
                code: method.code,
                enabled: true,
                handler: { code: 'dummy-payment-handler', arguments: [{ name: 'automaticSettle', value: 'true' }] },
                translations: [{ languageCode: 'en', name: method.name }],
            },
        },
    );
    return result.createPaymentMethod;
}

async function main(): Promise<void> {
    const client = new AdminApiClient();
    await client.login();

    const shippingMethod = await ensureShippingMethod(client);
    console.log(`ShippingMethod ready: id=${shippingMethod.id} name="${shippingMethod.name}"`);

    for (const method of PLACEHOLDER_PAYMENT_METHODS) {
        const created = await ensurePaymentMethod(client, method);
        console.log(`PaymentMethod ready: id=${created.id} code=${created.code}`);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
