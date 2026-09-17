import { Injectable } from '@nestjs/common';
import { UserInputError } from '@vendure/core';
import * as cheerio from 'cheerio';

import { ScrapedProductPreview } from '../types';

// A self-identifying UA gets blanket-403'd by bot-detection (e.g. Akamai) on
// several major retail sites even though their robots.txt permits these product
// paths. A standard desktop-browser UA plus matching Accept-Language gets through.
const SCRAPER_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const MAX_HTML_BYTES = 5_000_000;
const MAX_IMAGES = 12;
const FETCH_TIMEOUT_MS = 15_000;
const EXCLUDED_IMAGE_PATTERN = /(logo|sprite|favicon|placeholder|spinner|loading|blank\.gif)/i;
const GALLERY_KEYWORDS = ['gallery', 'product-image', 'product-photo', 'product-media', 'carousel', 'swiper', 'slider', 'thumb'];

/**
 * Best-effort generic product scraper. Prefers schema.org JSON-LD Product data
 * (the most reliable, standards-based source) and falls back to Open Graph
 * meta tags and heuristic gallery detection for sites that don't publish it.
 */
@Injectable()
export class ProductScraperService {
    async scrapeProductUrl(rawUrl: string): Promise<ScrapedProductPreview> {
        const url = this.parseAndValidateUrl(rawUrl);
        const html = await this.fetchHtml(url);
        const $ = cheerio.load(html);

        const jsonLdProduct = this.extractJsonLdProduct($);
        const { price, currencyCode } = this.extractOffer(jsonLdProduct);

        const imageSources = [
            ...this.extractJsonLdImages(jsonLdProduct),
            ...this.extractMetaImages($),
            ...this.extractGalleryImages($),
        ].filter(src => !EXCLUDED_IMAGE_PATTERN.test(src));

        return {
            sourceUrl: url.toString(),
            title: this.extractTitle($, jsonLdProduct),
            description: this.extractDescription($, jsonLdProduct),
            price,
            currencyCode,
            images: this.resolveAndDedupe(imageSources, url.toString()),
        };
    }

    private parseAndValidateUrl(rawUrl: string): URL {
        let url: URL;
        try {
            url = new URL(rawUrl);
        } catch {
            throw new UserInputError('Please provide a valid URL, including https://');
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new UserInputError('Only http(s) URLs are supported');
        }
        if (this.isBlockedHost(url.hostname)) {
            throw new UserInputError('This host cannot be imported from');
        }
        return url;
    }

    private isBlockedHost(hostname: string): boolean {
        const lower = hostname.toLowerCase();
        if (lower === 'localhost' || lower === '0.0.0.0' || lower === '::1' || lower.endsWith('.local')) {
            return true;
        }
        const ipv4 = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
        if (ipv4) {
            const a = Number(ipv4[1]);
            const b = Number(ipv4[2]);
            if (a === 127 || a === 10 || a === 0) return true;
            if (a === 172 && b >= 16 && b <= 31) return true;
            if (a === 192 && b === 168) return true;
            if (a === 169 && b === 254) return true;
        }
        return false;
    }

    private async fetchHtml(url: URL): Promise<string> {
        let res: Response;
        try {
            res = await fetch(url.toString(), {
                headers: {
                    'User-Agent': SCRAPER_USER_AGENT,
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                redirect: 'follow',
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
        } catch (e) {
            throw new UserInputError(
                `Could not reach that URL: ${e instanceof Error ? e.message : 'unknown error'}`,
            );
        }
        if (!res.ok || !res.body) {
            throw new UserInputError(`The page responded with status ${res.status}`);
        }
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType && !contentType.includes('html')) {
            throw new UserInputError('That URL does not appear to point to an HTML page');
        }

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            received += value.byteLength;
            if (received > MAX_HTML_BYTES) {
                await reader.cancel();
                break;
            }
            chunks.push(value);
        }
        return Buffer.concat(chunks).toString('utf-8');
    }

    private extractJsonLdProduct($: cheerio.CheerioAPI): Record<string, any> | undefined {
        const scripts = $('script[type="application/ld+json"]').toArray();
        for (const el of scripts) {
            const raw = $(el).contents().text();
            if (!raw?.trim()) continue;
            let parsed: any;
            try {
                parsed = JSON.parse(raw);
            } catch {
                continue;
            }
            const candidates: any[] = Array.isArray(parsed) ? parsed : (parsed?.['@graph'] ?? [parsed]);
            for (const candidate of candidates) {
                const type = candidate?.['@type'];
                const types = Array.isArray(type) ? type : [type];
                if (types.includes('Product')) {
                    return candidate;
                }
            }
        }
        return undefined;
    }

    private extractOffer(product: Record<string, any> | undefined): {
        price: number | null;
        currencyCode: string | null;
    } {
        const offers = product?.offers;
        const offer = Array.isArray(offers) ? offers[0] : offers;
        const price = offer?.price ?? offer?.priceSpecification?.price ?? null;
        const currencyCode = offer?.priceCurrency ?? offer?.priceSpecification?.priceCurrency ?? null;
        return {
            price: price != null && !Number.isNaN(Number(price)) ? Number(price) : null,
            currencyCode: currencyCode ?? null,
        };
    }

    private extractJsonLdImages(product: Record<string, any> | undefined): string[] {
        const image = product?.image;
        if (!image) return [];
        const arr = Array.isArray(image) ? image : [image];
        return arr
            .map(img => (typeof img === 'string' ? img : img?.url))
            .filter((v: unknown): v is string => typeof v === 'string' && v.length > 0);
    }

    private extractMetaImages($: cheerio.CheerioAPI): string[] {
        const urls: string[] = [];
        $('meta[property="og:image"], meta[property="og:image:secure_url"], meta[name="twitter:image"]').each(
            (_, el) => {
                const content = $(el).attr('content');
                if (content) urls.push(content);
            },
        );
        return urls;
    }

    private extractGalleryImages($: cheerio.CheerioAPI): string[] {
        const urls: string[] = [];
        $('img').each((_, el) => {
            const $el = $(el);
            const ownClass = $el.attr('class') ?? '';
            const ancestorClasses = $el
                .parents('[class]')
                .toArray()
                .map(p => $(p).attr('class') ?? '')
                .join(' ');
            const haystack = `${ownClass} ${ancestorClasses}`.toLowerCase();
            if (!GALLERY_KEYWORDS.some(keyword => haystack.includes(keyword))) return;

            const src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-lazy-src');
            const srcset = $el.attr('srcset') || $el.attr('data-srcset');
            const candidate = src || (srcset ? srcset.split(',')[0]?.trim().split(' ')[0] : undefined);
            if (candidate) urls.push(candidate);
        });
        return urls;
    }

    private resolveAndDedupe(rawUrls: string[], baseUrl: string): string[] {
        const seen = new Set<string>();
        const result: string[] = [];
        for (const raw of rawUrls) {
            if (!raw) continue;
            let absolute: string;
            try {
                absolute = new URL(raw, baseUrl).toString();
            } catch {
                continue;
            }
            if (seen.has(absolute)) continue;
            seen.add(absolute);
            result.push(absolute);
            if (result.length >= MAX_IMAGES) break;
        }
        return result;
    }

    private extractTitle($: cheerio.CheerioAPI, jsonLd: Record<string, any> | undefined): string | null {
        return (
            jsonLd?.name ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').first().text().trim() ||
            null
        );
    }

    private extractDescription($: cheerio.CheerioAPI, jsonLd: Record<string, any> | undefined): string | null {
        return (
            jsonLd?.description ||
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            null
        );
    }
}
