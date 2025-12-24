export interface SummaryProduct {
  node: {
    id: string;
    title: string;
    handle: string;
    images: {
      edges: {
        node: {
          url: string;
        };
      }[];
    };

    variants: {
      edges: {
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          selectedOptions: {
            name: string;
            value: string;
          };
        };
      }[];
    };
  };
}

export type VariantType = {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  };
};

export type ProductType = {
  descriptionHtml: string;
  id: string;
  title: string;
  handle: string;

  collections: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }[];
  };

  options: {
    id: string;
    name: string;
    values: string[];
  }[];

  images: {
    edges: {
      node: {
        url: string;
      };
    }[];
  };

  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        };
      };
    }[];
  };
};
