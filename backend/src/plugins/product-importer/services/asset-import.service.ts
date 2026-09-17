import { Injectable } from '@nestjs/common';
import { Asset, AssetService, isGraphQlErrorResult, Logger, RequestContext } from '@vendure/core';
import { lookup as mimeLookup, extension as mimeExtension } from 'mime-types';
import { PassThrough, Readable } from 'node:stream';

import { loggerCtx } from '../constants';

const IMPORT_USER_AGENT =
    'Mozilla/5.0 (compatible; CorewaiStoreProductImporter/1.0; +https://corewai.store)';
const MAX_IMAGE_BYTES = 15_000_000;
const FETCH_TIMEOUT_MS = 20_000;
const MAX_IMAGES = 12;

/**
 * Downloads remote images (found by ProductScraperService) and persists them
 * as real Vendure Assets, so they can be attached to a Product like any
 * manually-uploaded image.
 */
@Injectable()
export class AssetImportService {
    constructor(private assetService: AssetService) {}

    async importFromUrls(ctx: RequestContext, urls: string[]): Promise<Asset[]> {
        const uniqueUrls = Array.from(new Set(urls)).slice(0, MAX_IMAGES);
        const assets: Asset[] = [];
        for (const url of uniqueUrls) {
            try {
                const asset = await this.importOne(ctx, url);
                if (asset) assets.push(asset);
            } catch (e) {
                Logger.warn(
                    `Failed to import image from ${url}: ${e instanceof Error ? e.message : String(e)}`,
                    loggerCtx,
                );
            }
        }
        return assets;
    }

    private async importOne(ctx: RequestContext, rawUrl: string): Promise<Asset | undefined> {
        const url = new URL(rawUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return undefined;
        }

        const res = await fetch(url.toString(), {
            headers: { 'User-Agent': IMPORT_USER_AGENT },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok || !res.body) {
            throw new Error(`request failed with status ${res.status}`);
        }
        const declaredLength = Number(res.headers.get('content-length') ?? 0);
        if (declaredLength > MAX_IMAGE_BYTES) {
            throw new Error('image exceeds the maximum allowed size');
        }

        const contentType =
            res.headers.get('content-type') ?? (mimeLookup(url.pathname) || 'application/octet-stream');
        const filename = this.buildFilename(url, contentType);
        const nodeStream = this.limitStreamSize(Readable.fromWeb(res.body as any), MAX_IMAGE_BYTES);

        const result = await this.assetService.createFromFileStream(nodeStream, filename, ctx);
        if (isGraphQlErrorResult(result)) {
            throw new Error(result.message);
        }
        return result;
    }

    private buildFilename(url: URL, contentType: string): string {
        const rawBase = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? 'image');
        const base = rawBase.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
        if (/\.[a-z0-9]{2,5}$/i.test(base)) {
            return base;
        }
        const ext = mimeExtension(contentType) || 'jpg';
        return `${base}.${ext}`;
    }

    private limitStreamSize(source: Readable, maxBytes: number): Readable {
        let total = 0;
        const pass = new PassThrough();
        source.on('data', (chunk: Buffer) => {
            total += chunk.length;
            if (total > maxBytes) {
                source.destroy(new Error('image exceeds the maximum allowed size'));
                pass.destroy(new Error('image exceeds the maximum allowed size'));
                return;
            }
            pass.write(chunk);
        });
        source.on('end', () => pass.end());
        source.on('error', err => pass.destroy(err));
        return pass;
    }
}
