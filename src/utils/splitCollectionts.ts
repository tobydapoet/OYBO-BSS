import type {
  SplitCollectionNode,
  SplitCollectionsResult,
} from "../types/Collection.type";

export const splitCollectionsByPrefix = (
  collections: { title: string; handle: string }[],
  prefix: string
): SplitCollectionsResult => {
  const secondary: SplitCollectionNode[] = [];
  const primary: SplitCollectionNode[] = [];

  const PREFIX = prefix.toUpperCase();
  let hasShopAll = false;
  let shopAllHandle = "";

  collections.forEach((c) => {
    if (!c.title || !c.handle) return;

    const originalTitle = c.title.trim();
    const title = originalTitle.toUpperCase();

    if (title === PREFIX) {
      hasShopAll = true;
      shopAllHandle = c.handle;
      return;
    }

    if (!title.startsWith(PREFIX)) return;

    let trimmed = originalTitle.replace(new RegExp(`^${PREFIX}\\s+`, "i"), "");

    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount <= 2) {
      secondary.push({
        label: trimmed,
        handle: c.handle,
      });
    } else {
      trimmed = trimmed.replace(/^SOCKS\s+/i, "");

      primary.push({
        label: trimmed,
        handle: c.handle,
      });
    }
  });

  const socksIndex = secondary.findIndex(
    (item) => item.label.toLowerCase() === "socks"
  );

  if (socksIndex > -1) {
    const [socksItem] = secondary.splice(socksIndex, 1);
    secondary.unshift(socksItem);
  }

  if (hasShopAll) {
    primary.unshift({
      label: "SHOP ALL",
      handle: shopAllHandle,
    });
  }

  return {
    primary,
    secondary,
  };
};
