import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    type ScrapedProductPreview {
        sourceUrl: String!
        title: String
        description: String
        price: Float
        currencyCode: String
        images: [String!]!
    }

    extend type Mutation {
        "Fetches a product page and extracts title, description, price and gallery images for review."
        importProductFromUrl(url: String!): ScrapedProductPreview!
        "Downloads the given image URLs and creates them as Assets, returning the created Assets."
        createAssetsFromSourceUrls(urls: [String!]!): [Asset!]!
    }
`;
