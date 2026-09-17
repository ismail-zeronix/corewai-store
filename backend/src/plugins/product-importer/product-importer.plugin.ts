import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { adminApiExtensions } from './api/api-extensions';
import { ProductImporterResolver } from './api/product-importer.resolver';
import { AssetImportService } from './services/asset-import.service';
import { ProductScraperService } from './services/product-scraper.service';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductScraperService, AssetImportService],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [ProductImporterResolver],
    },
    dashboard: './dashboard/index.tsx',
    compatibility: '^3.0.0',
})
export class ProductImporterPlugin {}
