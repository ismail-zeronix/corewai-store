import { LanguageCode, ShippingCalculator } from '@vendure/core';

// Mirrors the storefront's FREE_SHIPPING_THRESHOLD (frontend/src/lib/cart/constants.ts).
// Vendure stores money as integer minor units, so AED 300 is 30_000 and AED 15 is 1_500.
const FREE_SHIPPING_THRESHOLD = 30_000;
const FLAT_RATE = 1_500;
const VAT_RATE_PERCENT = 5; // matches the "VAT" TaxRate configured on UAE ZONE

export const freeOverThresholdShippingCalculator = new ShippingCalculator({
    code: 'free-over-threshold-shipping-calculator',
    description: [
        { languageCode: LanguageCode.en, value: 'Free over AED 300, otherwise a flat AED 15 fee' },
    ],
    args: {},
    calculate: (ctx, order) => {
        const price = order.subTotalWithTax >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
        return {
            price,
            taxRate: VAT_RATE_PERCENT,
            priceIncludesTax: ctx.channel.pricesIncludeTax,
        };
    },
});
