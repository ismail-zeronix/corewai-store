import gql from 'graphql-tag';

export interface ScrapedProductPreview {
    sourceUrl: string;
    title: string | null;
    description: string | null;
    price: number | null;
    currencyCode: string | null;
    images: string[];
}

export interface ImportProductFromUrlResult {
    importProductFromUrl: ScrapedProductPreview;
}

export interface CreatedAsset {
    id: string;
    preview: string;
    source: string;
}

export interface CreateAssetsFromSourceUrlsResult {
    createAssetsFromSourceUrls: CreatedAsset[];
}

export const IMPORT_PRODUCT_FROM_URL = gql`
    mutation ImportProductFromUrl($url: String!) {
        importProductFromUrl(url: $url) {
            sourceUrl
            title
            description
            price
            currencyCode
            images
        }
    }
`;

export const CREATE_ASSETS_FROM_SOURCE_URLS = gql`
    mutation CreateAssetsFromSourceUrls($urls: [String!]!) {
        createAssetsFromSourceUrls(urls: $urls) {
            id
            preview
            source
        }
    }
`;
