import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductType, VariantType } from "../types/Product.type";
import { useCart } from "../contexts/CartContext";
import { getProductByHandle, searchProducts } from "../api/product.api";
import { useNavigate } from "react-router-dom";

type MiniViewProps = {
  onClose: () => void;
  isOpen?: boolean;
  productHandle: string;
  onAddToCart: () => void;
};

function MiniView({
  onClose,
  isOpen = true,
  productHandle,
  onAddToCart,
}: MiniViewProps) {
  const [product, setProduct] = useState<ProductType>();
  const [selectedVariant, setSelectedVariant] = useState<VariantType>();
  const [optionProduct, setOptionProduct] = useState<ProductType[]>([]);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart, messageAddError, setMessageAddError } = useCart();

  const isSizeSelected = (size: string): boolean => {
    if (!selectedVariant?.selectedOptions) return false;

    const selectedOptions = selectedVariant.selectedOptions;

    if (Array.isArray(selectedOptions)) {
      return selectedOptions.some(
        (opt) => opt.name === "Accessory size" && opt.value === size
      );
    } else if (selectedOptions && typeof selectedOptions === "object") {
      return (
        selectedOptions.name === "Accessory size" &&
        selectedOptions.value === size
      );
    }

    return false;
  };

  const getVariantBySize = (size: string): VariantType | undefined => {
    if (!product?.variants?.edges) return undefined;

    return product.variants.edges.find((edge) => {
      const selectedOptions = edge.node.selectedOptions;

      if (Array.isArray(selectedOptions)) {
        return selectedOptions.some(
          (opt) => opt.name === "Accessory size" && opt.value === size
        );
      } else if (selectedOptions && typeof selectedOptions === "object") {
        return (
          selectedOptions.name === "Accessory size" &&
          selectedOptions.value === size
        );
      }

      return false;
    })?.node;
  };

  const getVariantIdNumber = (gid: string): string => {
    const id = gid.split("/").pop();
    if (!id) throw new Error("Invalid Shopify GID");
    return id;
  };

  const handleSizeSelect = (variant: VariantType) => {
    setSelectedVariant(variant);
    updateUrlWithVariant(getVariantIdNumber(variant.id));
  };

  const updateUrlWithVariant = (variantId: string) => {
    const newUrl = `/products/${productHandle}?variant=${variantId}`;

    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productHandle) return;
      const res = await getProductByHandle(productHandle);
      const keyword = productHandle.split("-")[0];
      const sameProduct = await searchProducts(keyword);
      // const collection = await getCollectionByLabel(
      //   res.collections.edges[0].node.handle
      // );
      // if (collection) {
      //   setCurrentCollection(collection);
      // }

      const twoWordProducts = sameProduct.filter(
        (p: any) => p.handle.split("-").length === 2
      );

      if (twoWordProducts.length > 0) {
        setOptionProduct(twoWordProducts);
      }
      setProduct(res);

      const urlParams = new URLSearchParams(window.location.search);
      const variantIdFromUrl = urlParams.get("variant");

      if (variantIdFromUrl && res?.variants?.edges) {
        const variantFromUrl = res.variants.edges.find(
          (edge) => edge.node.id === variantIdFromUrl
        )?.node;

        if (variantFromUrl) {
          setSelectedVariant(variantFromUrl);
        } else if (res?.variants?.edges?.[0]?.node) {
          setSelectedVariant(res.variants.edges[0].node);
        }
      } else if (res?.variants?.edges?.[0]?.node) {
        setSelectedVariant(res.variants.edges[0].node);
      }
    };

    fetchProduct();
  }, [productHandle]);

  return (
    <>
      <div
        className={`fixed inset-0 z-100 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-90" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          onClose();
          setMessageAddError("");
          setQuantity(1);
        }}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-120 bg-white w-full max-w-sm transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex w-full justify-between p-3 shrink-0">
          <svg
            className="w-5 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() =>
              updateUrlWithVariant(getVariantIdNumber(selectedVariant?.id!))
            }
          >
            <path
              d="M10.2333 10.2333L2 2.00002"
              stroke="black"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
            <path
              d="M7.13455 2.00002H2V7.13457"
              stroke="black"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
            <path
              d="M13.7994 13.7993L22 22"
              stroke="black"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
            <path
              d="M16.8654 21.9999H21.9999V16.8653"
              stroke="black"
              stroke-width="1.5"
              stroke-linejoin="round"
            ></path>
          </svg>
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                setMessageAddError("");
                setQuantity(1);
              }}
              className="rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X
                className="w-6 h-6 ml-3 cursor-pointer"
                color="#000000"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
        {product && (
          <div className="flex-1 overflow-y-auto px-4">
            <img src={product?.images.edges[0].node.url} />
            <div className="inline-block text-black uppercase text-base mt-3 ">
              {(() => {
                const edges = product?.collections.edges ?? [];

                const matchedTitle = edges
                  .map((e) => e.node.title)
                  .find((t) => /on sale|the archive/i.test(t));

                if (/on sale/i.test(matchedTitle ?? "")) return "ON SALE";
                if (/the archive/i.test(matchedTitle ?? ""))
                  return "THE ARCHIVE";

                return "";
              })()}
            </div>
            <div className="text-5xl font-bold">{product?.title}</div>

            <div>
              {product && (
                <div className="font-serif font-thin mt-4">
                  COLOR:{" "}
                  {(() => {
                    const word = product.title.split(" ").pop() || "";
                    return (
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    );
                  })()}
                </div>
              )}

              <div className="flex gap-2">
                {optionProduct &&
                  optionProduct.map((item, index) => (
                    <a
                      href={`/products/${item.handle}`}
                      key={index}
                      className="w-15 h-15 p-1 mt-2 bg-white border border-gray-300 cursor-pointer
               transition-all duration-300
               hover:shadow-lg"
                    >
                      <div className="w-full h-full border border-gray-200 overflow-hidden">
                        <img
                          src={item.images.edges[2]?.node.url}
                          className="w-full h-full object-cover 
                   transition-transform duration-300
                   hover:scale-105"
                        />
                      </div>
                    </a>
                  ))}
              </div>

              <div className="mt-3">
                {messageAddError && (
                  <div className="text-sm mb-1">{messageAddError?.message}</div>
                )}
                <div className="flex gap-2 items-center">
                  <button
                    className="px-2 text-sm bg-black p-1 text-white cursor-pointer"
                    onClick={async () => {
                      const res = await addToCart(
                        selectedVariant?.id ||
                          product.variants.edges[0].node.id,
                        quantity
                      );
                      if (res === true) {
                        setTimeout(() => onAddToCart(), 1000);
                      }
                    }}
                  >
                    Add to cart
                  </button>
                </div>

                <div className="flex border justify-between w-40 items-center px-1 py-1 mt-10 mb-5">
                  <Minus
                    strokeWidth={2}
                    className="cursor-pointer"
                    size={15}
                    onClick={() => setQuantity((prev) => prev - 1)}
                  />
                  <input
                    className="w-20 outline-0 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Plus
                    className="cursor-pointer"
                    strokeWidth={2}
                    size={15}
                    onClick={() => setQuantity((prev) => prev + 1)}
                  />
                </div>

                <div>
                  {product.options.map((option) => {
                    const selectedValue =
                      option.values.find((v) => isSizeSelected(v)) ?? "";

                    return (
                      <div key={option.name} className="space-y-3 w-40">
                        <select
                          className="w-full border px-3 py-1 font-serif cursor-pointer"
                          value={selectedValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            const variantForSize = getVariantBySize(value);
                            if (variantForSize) {
                              handleSizeSelect(variantForSize);
                            }
                          }}
                        >
                          {option.values.map((value) => {
                            const variantForSize = getVariantBySize(value);

                            return (
                              <option
                                key={value}
                                value={value}
                                disabled={!variantForSize}
                              >
                                {value}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="mt-10 mb-10 w-80"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MiniView;
