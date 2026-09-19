import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
    EventBus,
    FacetService,
    FacetValueService,
    Logger,
    Product,
    ProductEvent,
    ProductService,
    RequestContext,
    TransactionalConnection,
    LanguageCode,
} from '@vendure/core';
import { filter } from 'rxjs/operators';

import { loggerCtx } from '../constants';
import { inferBrand, inferCategory, TaxonomyTerm } from '../catalogue-taxonomy';

/**
 * Keeps newly created products tagged with Brand and Category facet values.
 *
 * The storefront's discovery UI (brand filters, category collections, faceted PLP search)
 * is entirely facet-driven, so an untagged product is invisible to every filter and
 * belongs to no category. The product-importer plugin only scrapes previews and imports
 * assets — the product itself is created through the standard dashboard/Admin API — so
 * hooking ProductEvent rather than the importer catches every creation path.
 *
 * Deliberately conservative:
 *  - only acts on 'created' events, never 'updated', so it cannot fight an admin who
 *    removes a facet value by hand;
 *  - only ADDS facet values, preserving anything already assigned;
 *  - skips silently when the product name matches no known brand/category, leaving it for
 *    a human to classify rather than guessing wrong.
 */
@Injectable()
export class CatalogueTaxonomyService implements OnApplicationBootstrap {
    constructor(
        private eventBus: EventBus,
        private facetService: FacetService,
        private facetValueService: FacetValueService,
        private productService: ProductService,
        private connection: TransactionalConnection,
    ) {}

    onApplicationBootstrap(): void {
        this.eventBus
            .ofType(ProductEvent)
            .pipe(filter(event => event.type === 'created'))
            .subscribe(event => {
                // Fire-and-forget: a taxonomy failure must never roll back or block the
                // product creation that triggered it.
                this.applyTaxonomy(event.ctx, event.entity).catch(err => {
                    Logger.error(
                        `Failed to apply catalogue taxonomy to product ${event.entity.id}: ${
                            err instanceof Error ? err.message : String(err)
                        }`,
                        loggerCtx,
                    );
                });
            });
    }

    async applyTaxonomy(ctx: RequestContext, product: Product): Promise<void> {
        const name = product.name ?? '';
        const brand = inferBrand(name);
        const category = inferCategory(name);

        if (!brand && !category) {
            Logger.info(
                `No brand or category inferred for product ${product.id} ("${name.slice(0, 60)}") — left untagged`,
                loggerCtx,
            );
            return;
        }

        const facetValueIds: string[] = [];
        if (brand) {
            facetValueIds.push(await this.ensureFacetValue(ctx, 'brand', 'Brand', brand));
        }
        if (category) {
            facetValueIds.push(await this.ensureFacetValue(ctx, 'category', 'Category', category));
        }

        // Re-read the product's current facet values rather than trusting the event's
        // entity, whose `facetValues` relation may not be loaded.
        const existing = await this.connection.getRepository(ctx, Product).findOne({
            where: { id: product.id },
            relations: ['facetValues'],
        });
        const current = (existing?.facetValues ?? []).map(fv => String(fv.id));
        const merged = Array.from(new Set([...current, ...facetValueIds]));

        if (merged.length === current.length) {
            return;
        }

        await this.productService.update(ctx, { id: product.id, facetValueIds: merged });
        Logger.info(
            `Tagged product ${product.id} with ${brand?.name ?? '—'} / ${category?.name ?? '—'}`,
            loggerCtx,
        );
    }

    /** Finds the facet value by code, creating the facet and/or the value if absent. */
    private async ensureFacetValue(
        ctx: RequestContext,
        facetCode: string,
        facetName: string,
        term: TaxonomyTerm,
    ): Promise<string> {
        let facet = await this.facetService.findByCode(ctx, facetCode, LanguageCode.en);
        if (!facet) {
            facet = await this.facetService.create(ctx, {
                code: facetCode,
                // Must stay public: the Shop API only exposes public facets, and the
                // storefront reads them to build its filter UI.
                isPrivate: false,
                translations: [{ languageCode: LanguageCode.en, name: facetName }],
            });
        }

        const existingValue = (facet.values ?? []).find(v => v.code === term.code);
        if (existingValue) {
            return String(existingValue.id);
        }

        const created = await this.facetValueService.create(ctx, facet, {
            code: term.code,
            translations: [{ languageCode: LanguageCode.en, name: term.name }],
        });
        return String(created.id);
    }
}
