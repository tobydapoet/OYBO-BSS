import type { SummaryProduct } from "./Product.type";

export type CollectionItem = {
  title: string;
  handle: string;
};

export type SplitCollectionNode = {
  label: string;
  handle: string;
};

export type SplitCollectionsResult = {
  primary: SplitCollectionNode[];
  secondary: SplitCollectionNode[];
};

export type CollectionRes = {
  id: string;
  handle: string;
  title: string;
  image: {
    url: string;
    altText?: string | null;
  } | null;

  products: {
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
    edges: SummaryProduct[];
  };
};
