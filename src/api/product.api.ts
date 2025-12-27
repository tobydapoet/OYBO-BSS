import axios from "axios";
import type { ProductType } from "../types/Product.type";

export const getProductByHandle = async (
  handle: string
): Promise<ProductType> => {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml

        collections(first: 10) {
            edges {
                node {
                    id
                    title
                    handle
                }
            }
        }

        options {
          id
          name
          values
        }

        images(first: 10) {
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
  `;

  const res = await axios.post(
    `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
    {
      query,
      variables: { handle },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": import.meta.env
          .VITE_STOREFRONT_TOKEN,
      },
    }
  );

  return res.data.data.product;
};

export const searchProducts = async (keyword: string, first = 6) => {
  const query = `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
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
  `;

  const res = await axios.post(
    `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
    {
      query,
      variables: {
        query: keyword,
        first,
      },
    },
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": import.meta.env
          .VITE_STOREFRONT_TOKEN,
      },
    }
  );

  return res.data.data.products.edges.map((e: any) => e.node);
};
