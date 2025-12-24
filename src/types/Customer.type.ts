export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerUserError {
  code?: string;
  field?: string[];
  message: string;
}

export interface CustomerAccessTokenCreateResponse {
  data: {
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  };
  errors?: Array<{ message: string }>;
}

export interface CustomerCreateResponse {
  data: {
    customerCreate: {
      customer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      } | null;
      customerUserErrors: Array<{
        code?: string;
        field?: string[];
        message: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}
