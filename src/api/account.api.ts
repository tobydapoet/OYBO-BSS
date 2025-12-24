import axios from "axios";
import type {
  CustomerAccessTokenCreateResponse,
  CustomerCreateResponse,
} from "../types/Customer.type";
import type { CustomerRegisterType } from "../types/Customer.schema";

export const Login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
      {
        query: `
          mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              customerUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        variables: {
          input: { email, password },
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

    const data: CustomerAccessTokenCreateResponse = response.data;

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors[0].message || "An error occurred!");
    }

    const { customerAccessToken, customerUserErrors } =
      data.data.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      const error = customerUserErrors[0];
      const errorMessage =
        error.code === "UNIDENTIFIED_CUSTOMER"
          ? "Email or password is incorrect!"
          : error.message;
      throw new Error(errorMessage);
    }

    const token = customerAccessToken?.accessToken;

    if (!token) {
      throw new Error("Unable to retrieve token. Please try again!");
    }

    return { token, email };
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        throw new Error(
          err.response.data?.errors?.[0]?.message ||
            `HTTP error! status: ${err.response.status}`
        );
      } else if (err.request) {
        throw new Error(
          "Unable to connect to server. Please check your network connection!"
        );
      } else {
        throw new Error("An error occurred while setting up the request.");
      }
    } else if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("An error occurred, please try again!");
    }
  }
};

export const Register = async (inputData: CustomerRegisterType) => {
  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SHOP_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": import.meta.env
            .VITE_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: `
              mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                  customer {
                    id
                    email
                    firstName
                    lastName
                  }
                  customerUserErrors {
                    code
                    field
                    message
                  }
                }
              }
            `,
          variables: {
            input: {
              firstName: inputData.firstName,
              lastName: inputData.lastName,
              email: inputData.email,
              password: inputData.password,
              acceptsMarketing: false,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CustomerCreateResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors[0].message || "An error occurred!");
    }

    const { customer, customerUserErrors } = data.data.customerCreate;

    if (customerUserErrors.length > 0) {
      const error = customerUserErrors[0];
      let errorMessage = error.message;

      if (error.code === "TAKEN") {
        errorMessage = "This email is already in use!";
      } else if (error.code === "INVALID") {
        errorMessage = "Invalid email!";
      }

      throw new Error(errorMessage);
    }

    return customer;
  } catch (err) {
    console.error("Register error:", err);
    if (err instanceof Error) {
      throw new Error(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to server. Please check your network connection!"
          : "An error occurred, please try again!"
      );
    } else {
      throw new Error("An error occurred, please try again!");
    }
  }
};
