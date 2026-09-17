export interface ScrapedProductPreview {
    sourceUrl: string;
    title: string | null;
    description: string | null;
    price: number | null;
    currencyCode: string | null;
    images: string[];
}
