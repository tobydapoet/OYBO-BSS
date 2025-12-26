import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectionByLabel } from "../api/collection.api";
import type { CollectionRes } from "../types/Collection.type";
import ProductCard from "../components/ProductCard";
import { formatMoney } from "../utils/formatMoney";
import { Heart, Plus } from "lucide-react";
// import type { ProductType } from "../types/Product.type";
import MiniView from "../components/MiniView";
import MiniCart from "../components/MiniCart";
import { useCart } from "../contexts/CartContext";

function CollectionPage() {
  const { label } = useParams();
  const [collection, setCollection] = useState<CollectionRes>();
  const navigate = useNavigate();
  const [openMiniView, setOpenMiniView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const [isOpenMiniCart, setIsOpenMiniCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCollections = async () => {
      if (!label) return;
      const res = await getCollectionByLabel(label);
      setCollection(res);
    };
    fetchCollections();
  }, [label]);

  if (!collection) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  console.log("OPEN: ", openMiniView);

  return (
    <div className="px-2">
      <img
        src={collection?.image?.url}
        className="w-full h-134 object-cover"
        alt={collection?.title}
      />

      <div className="text-xl font-medium py-10 text-center md:text-left">
        {collection?.title}
      </div>

      <div className="space-y-1 px-0 md:px-2 lg:px-4">
        {Array.from({
          length: Math.ceil(collection?.products.edges.length / 9),
        }).map((_, patternIndex) => {
          const startIndex = patternIndex * 9;

          return (
            <div key={patternIndex} className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                {collection.products.edges
                  .slice(startIndex, startIndex + 4)
                  .map((product, idx) => (
                    <ProductCard key={`row1-${idx}`} product={product} />
                  ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <div
                  className="lg:col-span-2 relative overflow-hidden group cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/products/${
                        collection.products.edges[startIndex + 4].node.handle
                      }`
                    )
                  }
                >
                  {collection.products.edges[startIndex + 4] && (
                    <>
                      <div className="relative w-full h-64 md:h-80 lg:h-96 xl:h-217">
                        <img
                          src={
                            collection.products.edges[startIndex + 4].node
                              .images.edges[2]?.node.url
                          }
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                          alt={
                            collection.products.edges[startIndex + 4].node.title
                          }
                        />
                        <img
                          src={
                            collection.products.edges[startIndex + 4].node
                              .images.edges[1]?.node.url
                          }
                          className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 object-cover"
                          alt={
                            collection.products.edges[startIndex + 4].node.title
                          }
                        />
                      </div>

                      <div className="md:mt-3 flex justify-between">
                        <div>
                          <div className="font-thin text-sm font-serif line-clamp-1">
                            {
                              collection.products.edges[startIndex + 4].node
                                .title
                            }
                          </div>
                          <div className="font-thin text-sm font-serif">
                            {formatMoney(
                              collection.products.edges[startIndex + 4].node
                                .variants.edges[0].node.price.amount
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 items-start mt-1 mr-2">
                          <Heart strokeWidth={1.5} size={18} />
                          <Plus
                            strokeWidth={1.5}
                            size={18}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMiniView(true);
                              setSelectedProduct(
                                collection.products.edges[startIndex + 4].node
                                  .handle
                              );
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  {collection.products.edges
                    .slice(startIndex + 5, startIndex + 9)
                    .map((product, idx) => (
                      <ProductCard
                        key={`row2-${idx}`}
                        product={product}
                        onPlus={() => {
                          setSelectedProduct(product.node.handle);
                          setOpenMiniView(true);
                          setTimeout(() => setOpenMiniView(true), 300);
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="block lg:hidden mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collection.products.edges.map((product, idx) => (
            <div key={`mobile-${idx}`} className="cursor-pointer">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <MiniView
        onClose={() => setOpenMiniView(false)}
        isOpen={openMiniView}
        productHandle={selectedProduct!}
        onAddToCart={() => setIsOpenMiniCart(true)}
      />
      <MiniCart
        onClose={() => setIsOpenMiniCart(false)}
        isOpen={isOpenMiniCart}
      />
    </div>
  );
}

export default CollectionPage;
