/**
 * Brand and category inference shared by the one-time seed script
 * (`src/scripts/seed-catalogue.ts`) and the product importer, so a product imported today
 * lands in the same taxonomy as one seeded by hand.
 *
 * Inference is name-based because that is the only signal the scraper reliably returns —
 * the source pages have no structured brand or category field. It is deliberately
 * conservative: an unrecognised product yields `null` rather than a guess, and the caller
 * leaves it untagged for a human to classify in the dashboard. That keeps a wrong filter
 * result (a product appearing under the wrong brand) strictly less likely than a missing
 * one.
 */

export interface TaxonomyTerm {
    code: string;
    name: string;
}

export interface CategoryDefinition extends TaxonomyTerm {
    slug: string;
    description: string;
}

/**
 * Category slugs match the storefront's existing category routes so that
 * /category/<slug> resolves against a real Vendure collection.
 */
export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
    {
        code: 'laptops',
        name: 'Laptops',
        slug: 'laptops',
        description: 'Notebooks, ultrabooks, gaming laptops and mobile workstations.',
    },
    {
        code: 'desktops',
        name: 'Desktops',
        slug: 'desktops',
        description: 'Desktop towers, all-in-ones and custom-built systems.',
    },
    {
        code: 'monitors',
        name: 'Monitors',
        slug: 'monitors',
        description: 'Displays for work, creative and gaming setups.',
    },
    {
        code: 'components',
        name: 'Components',
        slug: 'components',
        description: 'Processors, graphics cards, memory and internal hardware.',
    },
    {
        code: 'storage',
        name: 'Storage',
        slug: 'storage',
        description: 'Internal drives, external drives and portable storage.',
    },
    {
        code: 'networking',
        name: 'Networking',
        slug: 'networking',
        description: 'Routers, switches, access points and network hardware.',
    },
    {
        code: 'printers',
        name: 'Printers',
        slug: 'printers',
        description: 'Printers, scanners and all-in-one office machines.',
    },
    {
        code: 'accessories',
        name: 'Accessories',
        slug: 'accessories',
        description: 'Keyboards, mice, docks, cables and peripherals.',
    },
];

/**
 * Brand display names keyed by the lower-cased token searched for in a product name.
 * Order matters only for multi-word aliases, which are checked before single words.
 */
const BRAND_PATTERNS: Array<{ match: RegExp; term: TaxonomyTerm }> = [
    { match: /\bhyperstrike\b/i, term: { code: 'hyperstrike', name: 'HyperStrike' } },
    { match: /\bthinkpad\b|\blenovo\b/i, term: { code: 'lenovo', name: 'Lenovo' } },
    { match: /\basus\b|\brog\b|\btuf\b/i, term: { code: 'asus', name: 'ASUS' } },
    { match: /\bacer\b|\bpredator\b/i, term: { code: 'acer', name: 'Acer' } },
    // `HP` is matched case-sensitively with a word boundary: a case-insensitive /\bhp\b/
    // would also fire on stray lower-case "hp" inside model strings.
    { match: /\bHP\b|\bzbook\b|\bomen\b|\bvictus\b/, term: { code: 'hp', name: 'HP' } },
    { match: /\bdell\b|\balienware\b/i, term: { code: 'dell', name: 'Dell' } },
    { match: /\bmsi\b/i, term: { code: 'msi', name: 'MSI' } },
    { match: /\bapple\b|\bmacbook\b|\bimac\b/i, term: { code: 'apple', name: 'Apple' } },
    { match: /\bsamsung\b/i, term: { code: 'samsung', name: 'Samsung' } },
    { match: /\bgigabyte\b|\baorus\b/i, term: { code: 'gigabyte', name: 'Gigabyte' } },
    { match: /\brazer\b/i, term: { code: 'razer', name: 'Razer' } },
    { match: /\bmicrosoft\b|\bsurface\b/i, term: { code: 'microsoft', name: 'Microsoft' } },
    { match: /\blg\b/i, term: { code: 'lg', name: 'LG' } },
    { match: /\bintel\b/i, term: { code: 'intel', name: 'Intel' } },
    { match: /\bamd\b/i, term: { code: 'amd', name: 'AMD' } },
];

/**
 * Category patterns, checked in order — the first match wins, so the more specific
 * product types are listed before the broad catch-alls.
 */
const CATEGORY_PATTERNS: Array<{ match: RegExp; code: string }> = [
    { match: /\blaptop\b|\bnotebook\b|\bultrabook\b|\bmacbook\b|\bthinkpad\b|\bmobile workstation\b/i, code: 'laptops' },
    { match: /\bdesktop\b|\bgaming pc\b|\ball-in-one\b|\ball in one\b|\btower\b|\bimac\b|\bworkstation\b/i, code: 'desktops' },
    { match: /\bmonitor\b|\bdisplay panel\b|\bcurved screen\b/i, code: 'monitors' },
    { match: /\bgraphics card\b|\bprocessor\b|\bcpu\b|\bgpu\b|\bmotherboard\b|\bram module\b|\bpsu\b|\bpower supply\b/i, code: 'components' },
    { match: /\bssd\b|\bhdd\b|\bhard drive\b|\bnvme\b|\bflash drive\b|\bexternal drive\b/i, code: 'storage' },
    { match: /\brouter\b|\bswitch\b|\baccess point\b|\bmodem\b|\bnetwork adapter\b/i, code: 'networking' },
    { match: /\bprinter\b|\bscanner\b|\btoner\b|\bcartridge\b/i, code: 'printers' },
    { match: /\bkeyboard\b|\bmouse\b|\bheadset\b|\bdock\b|\bcable\b|\badapter\b|\bwebcam\b/i, code: 'accessories' },
];

/** Returns the inferred brand, or null when the product name matches no known brand. */
export function inferBrand(productName: string): TaxonomyTerm | null {
    for (const { match, term } of BRAND_PATTERNS) {
        if (match.test(productName)) {
            return term;
        }
    }
    return null;
}

/** Returns the inferred category, or null when the product name matches no known category. */
export function inferCategory(productName: string): TaxonomyTerm | null {
    for (const { match, code } of CATEGORY_PATTERNS) {
        if (match.test(productName)) {
            const definition = CATEGORY_DEFINITIONS.find(d => d.code === code);
            if (definition) {
                return { code: definition.code, name: definition.name };
            }
        }
    }
    return null;
}
