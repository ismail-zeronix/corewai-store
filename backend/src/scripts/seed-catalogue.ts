/**
 * One-time catalogue-structure seeding against a running Vendure server's Admin API —
 * not a schema migration.
 *
 * The storefront's discovery UI (brand filters, category navigation, faceted PLP search)
 * is driven entirely by Vendure facets and collections, but the catalogue was imported
 * with neither: every product had zero facetValues and zero collections, so the PLP brand
 * filter rendered empty and every /category/<slug> page returned nothing.
 *
 * This script creates:
 *   - a "Brand" facet (code `brand`) — the storefront's mapVendureProduct() looks the
 *     brand up by facet NAME "Brand", so that name is load-bearing.
 *   - a "Category" facet (code `category`) — backs the collection filters below.
 *   - one Collection per category, filtered by its Category facet value.
 *
 * It then assigns the brand + category facet values to existing products by matching
 * their names. Every step is idempotent: re-running only fills in what is missing.
 *
 * Products imported AFTER this script are handled automatically by the product-importer
 * plugin's CatalogueTaxonomyService, which applies the same brand/category inference.
 *
 * Usage: npx ts-node src/scripts/seed-catalogue.ts
 * Reads ADMIN_API_URL / SUPERADMIN_USERNAME / SUPERADMIN_PASSWORD from the environment,
 * falling back to the local dev defaults.
 */
import 'dotenv/config';
import { inferBrand, inferCategory, CATEGORY_DEFINITIONS } from '../plugins/product-importer/catalogue-taxonomy';

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

interface Facet {
    id: string;
    code: string;
    name: string;
    values: Array<{ id: string; code: string; name: string }>;
}

const FACET_FIELDS = `id code name values { id code name }`;

async function ensureFacet(client: AdminApiClient, code: string, name: string): Promise<Facet> {
    const existing = await client.request<{ facets: { items: Facet[] } }>(
        `{ facets(options: { take: 100 }) { items { ${FACET_FIELDS} } } }`,
    );
    const found = existing.facets.items.find(f => f.code === code);
    if (found) {
        return found;
    }
    const result = await client.request<{ createFacet: Facet }>(
        `mutation CreateFacet($input: CreateFacetInput!) {
            createFacet(input: $input) { ${FACET_FIELDS} }
        }`,
        {
            input: {
                code,
                // Public facets are readable through the Shop API, which the storefront needs
                // in order to render brand/category filters.
                isPrivate: false,
                translations: [{ languageCode: 'en', name }],
            },
        },
    );
    return result.createFacet;
}

/** Adds any missing values to a facet and returns the facet's full, current value list. */
async function ensureFacetValues(
    client: AdminApiClient,
    facet: Facet,
    values: Array<{ code: string; name: string }>,
): Promise<Map<string, string>> {
    const byCode = new Map(facet.values.map(v => [v.code, v.id]));
    const missing = values.filter(v => !byCode.has(v.code));

    if (missing.length > 0) {
        const result = await client.request<{ createFacetValues: Array<{ id: string; code: string }> }>(
            `mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
                createFacetValues(input: $input) { id code }
            }`,
            {
                input: missing.map(v => ({
                    facetId: facet.id,
                    code: v.code,
                    translations: [{ languageCode: 'en', name: v.name }],
                })),
            },
        );
        for (const created of result.createFacetValues) {
            byCode.set(created.code, created.id);
        }
    }

    return byCode;
}

async function ensureCollection(
    client: AdminApiClient,
    definition: { slug: string; name: string; description: string },
    facetValueId: string,
): Promise<{ id: string; slug: string }> {
    const existing = await client.request<{ collections: { items: Array<{ id: string; slug: string }> } }>(
        `{ collections(options: { take: 200 }) { items { id slug } } }`,
    );
    const found = existing.collections.items.find(c => c.slug === definition.slug);
    if (found) {
        return found;
    }
    const result = await client.request<{ createCollection: { id: string; slug: string } }>(
        `mutation CreateCollection($input: CreateCollectionInput!) {
            createCollection(input: $input) { id slug }
        }`,
        {
            input: {
                // ConfigurableOperation arguments are always JSON-encoded strings, even the
                // non-string ones — an ID list goes over the wire as '["3"]', not as an array.
                filters: [
                    {
                        code: 'facet-value-filter',
                        arguments: [
                            { name: 'facetValueIds', value: JSON.stringify([facetValueId]) },
                            { name: 'containsAny', value: 'false' },
                            { name: 'combineWithAnd', value: 'true' },
                        ],
                    },
                ],
                translations: [
                    {
                        languageCode: 'en',
                        name: definition.name,
                        slug: definition.slug,
                        description: definition.description,
                    },
                ],
            },
        },
    );
    return result.createCollection;
}

interface AdminProduct {
    id: string;
    name: string;
    facetValues: Array<{ id: string }>;
}

/**
 * Assigns brand + category facet values to products that are missing them. Existing facet
 * values are preserved — this only ever adds, so re-running is safe and manual curation in
 * the admin dashboard is never clobbered.
 */
async function assignProductFacetValues(
    client: AdminApiClient,
    brandValues: Map<string, string>,
    categoryValues: Map<string, string>,
): Promise<void> {
    const { products } = await client.request<{ products: { items: AdminProduct[] } }>(
        `{ products(options: { take: 500 }) { items { id name facetValues { id } } } }`,
    );

    for (const product of products.items) {
        const brand = inferBrand(product.name);
        const category = inferCategory(product.name);
        const wanted = [
            brand ? brandValues.get(brand.code) : undefined,
            category ? categoryValues.get(category.code) : undefined,
        ].filter((id): id is string => Boolean(id));

        if (wanted.length === 0) {
            console.warn(`  ! no brand/category inferred for "${product.name.slice(0, 60)}…" — skipped`);
            continue;
        }

        const current = new Set(product.facetValues.map(v => v.id));
        if (wanted.every(id => current.has(id))) {
            continue;
        }

        const merged = Array.from(new Set([...current, ...wanted]));
        await client.request(
            `mutation UpdateProduct($input: UpdateProductInput!) {
                updateProduct(input: $input) { id }
            }`,
            { input: { id: product.id, facetValueIds: merged } },
        );
        console.log(
            `  assigned ${brand?.name ?? '—'} / ${category?.name ?? '—'} to "${product.name.slice(0, 50)}…"`,
        );
    }
}

async function main(): Promise<void> {
    const client = new AdminApiClient();
    await client.login();

    // The storefront resolves a product's brand by facet NAME — keep these names in sync
    // with mapVendureProduct() in frontend/src/lib/vendure/products.ts.
    const brandFacet = await ensureFacet(client, 'brand', 'Brand');
    const categoryFacet = await ensureFacet(client, 'category', 'Category');
    console.log(`Facets ready: brand=${brandFacet.id} category=${categoryFacet.id}`);

    // Only seed facet values for brands/categories actually present in the catalogue, so
    // the storefront never advertises a filter that matches nothing.
    const { products } = await client.request<{ products: { items: Array<{ name: string }> } }>(
        `{ products(options: { take: 500 }) { items { name } } }`,
    );

    const brands = new Map<string, { code: string; name: string }>();
    const categories = new Map<string, { code: string; name: string }>();
    for (const product of products.items) {
        const brand = inferBrand(product.name);
        if (brand) brands.set(brand.code, brand);
        const category = inferCategory(product.name);
        if (category) categories.set(category.code, category);
    }

    const brandValues = await ensureFacetValues(client, brandFacet, Array.from(brands.values()));
    const categoryValues = await ensureFacetValues(client, categoryFacet, Array.from(categories.values()));
    console.log(`Facet values ready: ${brandValues.size} brand(s), ${categoryValues.size} category(ies)`);

    for (const category of categories.values()) {
        const definition = CATEGORY_DEFINITIONS.find(d => d.code === category.code);
        const facetValueId = categoryValues.get(category.code);
        if (!definition || !facetValueId) continue;
        const collection = await ensureCollection(client, definition, facetValueId);
        console.log(`Collection ready: id=${collection.id} slug=${collection.slug}`);
    }

    console.log('Assigning facet values to products…');
    await assignProductFacetValues(client, brandValues, categoryValues);

    // Collection membership and the search index are both populated by background jobs;
    // without this the Shop API keeps serving the pre-seed (empty) facet list.
    await client.request(`mutation { reindex { id } }`);
    console.log('Search reindex triggered. Allow the worker a few seconds to finish.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
