export type CartType = {
  id: string;
  checkoutUrl: string;

  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            title: string;
            handle: string;
            images: {
              edges: {
                node: {
                  altText: string;
                  url: string;
                };
              }[];
            };
          };
          title: string;
        };
      };
    }[];
  };
  totalQuantity: number;
};
