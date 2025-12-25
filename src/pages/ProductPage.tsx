import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByHandle, searchProducts } from "../api/product.api";
import type { ProductType, VariantType } from "../types/Product.type";
import CompactProductGallery from "../components/ProductImageGallery";
import { Heart } from "lucide-react";
import { getCollectionByLabel } from "../api/collection.api";
import type { CollectionRes } from "../types/Collection.type";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { formatMoney } from "../utils/formatMoney";

function ProductPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType>();
  const [selectedVariant, setSelectedVariant] = useState<VariantType>();
  const [optionProduct, setOptionProduct] = useState<ProductType[]>([]);
  const [currentCollection, setCurrentCollection] = useState<CollectionRes>();
  const { addToCart, messageAddError } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      const res = await getProductByHandle(handle);
      const keyword = handle.split("-")[0];
      const sameProduct = await searchProducts(keyword);
      const collection = await getCollectionByLabel(
        res.collections.edges[0].node.handle
      );
      if (collection) {
        setCurrentCollection(collection);
      }

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
  }, [handle]);

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
    const newUrl = `/products/${handle}?variant=${variantId}`;

    navigate(newUrl, { replace: true });
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

  if (!product || !selectedVariant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-15 2xl:gap-30 2xl:items-center">
        <div>
          <CompactProductGallery product={product} />
        </div>
        <div className="w-100 ml-5">
          <div>
            <div className="inline-block text-black uppercase font-normal text-[72px] tracking-[7.92px] rotate-[-7.18deg] mt-2.6 -mb-10.25 font-coral">
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

            <div className="text-5xl font-bold whitespace-nowrap">
              {product?.title}
            </div>
          </div>

          <div className="text-base mt-8">
            {formatMoney(
              selectedVariant?.price?.amount ||
                product.variants.edges[0]?.node.price.amount
            )}
          </div>

          <div>
            <div className="font-serif font-thin mt-4">
              COLOR:{" "}
              {(() => {
                const word = product.title.split(" ").pop() || "";
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })()}
            </div>
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
          </div>

          <div className="mt-8">
            {product.options.map((option, index) => {
              return (
                <div key={index} className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value, idx) => {
                      const variantForSize = getVariantBySize(value);
                      const isSelected = isSizeSelected(value);

                      return (
                        <button
                          type="button"
                          className={`rounded-lg transition-colors cursor-pointer ${
                            isSelected
                              ? "underline"
                              : variantForSize
                                ? "hover:underline"
                                : "underline"
                          }`}
                          key={idx}
                          onClick={() =>
                            variantForSize && handleSizeSelect(variantForSize)
                          }
                          disabled={!variantForSize}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="mt-8">
              {messageAddError && (
                <div className="text-sm mb-1">{messageAddError?.message}</div>
              )}
              <div className="flex gap-2 items-center">
                <button
                  className="lg:w-full px-2 lg:px-0 bg-black h-10 text-white cursor-pointer"
                  onClick={async () => await addToCart(selectedVariant?.id, 1)}
                >
                  ADD TO CART
                </button>
                <Heart strokeWidth={1.5} size={20} />
              </div>
            </div>
          </div>
          <div
            className="mt-25 w-80"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-1 px-4 mt-20">
        {currentCollection?.products.edges
          ?.slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 8)
          .map((item, index) => (
            <ProductCard product={item} key={index} />
          ))}
      </div>
    </div>
  );
}

export default ProductPage;
