import axios from "axios";
import type { CollectionRes } from "../types/Collection.type";

export const getCollectionsByKeyword = async (keyword: string) => {
  const query = `
    {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            image {
              url
            }
          }
        }
      }
    }
  `;

  const res = await axios.post(
    `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": import.meta.env
          .VITE_STOREFRONT_TOKEN,
      },
    }
  );

  const regex = new RegExp(`(^|[^A-Z])${keyword}([^A-Z]|$)`, "i");

  return res.data.data.collections.edges
    .map((e: any) => e.node)
    .filter((c: any) => regex.test(c.title));
};

export const getCollectionByLabel = async (
  label: string
): Promise<CollectionRes> => {
  const query = `
    query getCollectionByHandle(
      $handle: String!
      $first: Int!
      $after: String
    ) {
      collection(handle: $handle) {
        id
        title
        handle
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              images(first: 50) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }

              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              } 
            }
          }
        }
      }
    }
  `;

  const res = await axios.post(
    `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
    {
      query,
      variables: {
        handle: label,
        first: 50,
        after: null,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": import.meta.env
          .VITE_STOREFRONT_TOKEN,
      },
    }
  );
  return res.data.data.collection;
};
