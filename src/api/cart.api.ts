import axios from "axios";
import type { CartType } from "../types/Cart.type";

const SHOP = import.meta.env.VITE_SHOP_DOMAIN;
const TOKEN = import.meta.env.VITE_STOREFRONT_TOKEN;

export const createCart = async (): Promise<string> => {
  const query = `
    mutation {
      cartCreate {
        cart { id checkoutUrl }
      }
    }
  `;

  const res = await axios.post(
    `https://${SHOP}/api/2024-01/graphql.json`,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
    }
  );

  return res.data.data.cartCreate.cart.id;
};

export const checkVariantAvailable = async (variantGid: string) => {
  const query = `
    query($id: ID!) {
      node(id: $id) {
        ... on ProductVariant {
          id
          title
          availableForSale
          quantityAvailable
          product { title }
        }
      }
    }
  `;

  const variables = { id: variantGid };

  const res = await axios.post(
    `https://${SHOP}/api/2024-01/graphql.json`,
    { query, variables },
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.data.node;
};

export const addToCart = async (
  cartId: string,
  variantGid: string,
  quantity = 1
) => {
  const variant = await checkVariantAvailable(variantGid);
  if (!variant.availableForSale || variant.quantityAvailable < quantity) {
    throw new Error(
      `Only ${variant.quantityAvailable} items were added to your cart due to availability.`
    );
  }

  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id totalQuantity }
        userErrors { message }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ merchandiseId: variantGid, quantity }],
  };

  const res = await axios.post(
    `https://${SHOP}/api/2024-01/graphql.json`,
    { query, variables },
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  if (res.data.data.cartLinesAdd.userErrors.length) {
    throw new Error(
      res.data.data.cartLinesAdd.userErrors
        .map((e: any) => e.message)
        .join(", ")
    );
  }

  return res.data.data.cartLinesAdd.cart;
};

export const getCart = async (cartId: string): Promise<CartType> => {
  const query = `
    query cart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    images(first: 1) {
                    edges {
                        node {
                        url
                        altText
                      }
                    }
                  }
                }
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { id: cartId };

  const res = await axios.post(
    `https://${SHOP}/api/2024-01/graphql.json`,
    {
      query,
      variables,
    },
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.data.cart;
};

export const updateCartLine = async (
  cartId: string,
  lineId: string,
  variantGid: string,
  quantity: number
) => {
  const variant = await checkVariantAvailable(variantGid);
  if (!variant.availableForSale || variant.quantityAvailable < quantity) {
    throw new Error(
      `Only ${variant.quantityAvailable} items were added to your cart due to availability.`
    );
  }

  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
          lines(first: 20) {
            edges { node { id quantity } }
          }
        }
        userErrors { message }
      }
    }
  `;

  const variables = { cartId, lines: [{ id: lineId, quantity }] };

  const res = await axios.post(
    `https://${SHOP}/api/2024-01/graphql.json`,
    { query, variables },
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  const errors = res.data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (errors.length > 0) {
    throw new Error(errors.map((e: any) => e.message).join(", "));
  }

  return res.data.data.cartLinesUpdate.cart;
};
