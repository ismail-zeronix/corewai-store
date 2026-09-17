import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';
import { Allow, Asset, Ctx, RequestContext, Transaction } from '@vendure/core';

import { AssetImportService } from '../services/asset-import.service';
import { ProductScraperService } from '../services/product-scraper.service';
import { ScrapedProductPreview } from '../types';

@Resolver()
export class ProductImporterResolver {
    constructor(
        private productScraperService: ProductScraperService,
        private assetImportService: AssetImportService,
    ) {}

    @Mutation()
    @Allow(Permission.CreateProduct, Permission.CreateCatalog)
    async importProductFromUrl(
        @Ctx() ctx: RequestContext,
        @Args() args: { url: string },
    ): Promise<ScrapedProductPreview> {
        return this.productScraperService.scrapeProductUrl(args.url);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.CreateAsset)
    async createAssetsFromSourceUrls(
        @Ctx() ctx: RequestContext,
        @Args() args: { urls: string[] },
    ): Promise<Asset[]> {
        return this.assetImportService.importFromUrls(ctx, args.urls);
    }
}
