import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import type { ProductType } from "../types/Product.type";
import { searchProducts } from "../api/product.api";
import { formatMoney } from "../utils/formatMoney";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
  onClose: () => void;
  isOpen?: boolean;
};

function SearchBar({ onClose, isOpen }: SearchBarProps) {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [productList, setProductList] = useState<ProductType[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setProductList([]);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await searchProducts(debouncedKeyword);
        setProductList(res || []);
        if (res.length === 0) {
          setError(
            `No results found for “${keyword}”. Check the spelling or use a different word or phrase.`
          );
        }
      } catch (err) {
        setError(
          `No results found for “${keyword}”. Check the spelling or use a different word or phrase.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [debouncedKeyword]);

  console.log(productList);

  return (
    <>
      <div
        className={`fixed inset-0 z-100 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-90" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          onClose();
        }}
      />

      <form
        className={`fixed right-0 top-0 bottom-0 z-120 bg-white focus:ring-1 w-full max-w-sm transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onSubmit={() => navigate(`/search?q=${keyword}`)}
      >
        <div
          className="flex items-center mt-4 py-1 mx-4 px-1
            border-b
            transition-all
            focus-within:outline-2
            focus-within:outline-black"
        >
          <div className="flex items-center space-x-4">
            <button className="rounded-full cursor-pointer" aria-label="Search">
              <Search className="w-6" strokeWidth={1.5} />
            </button>
          </div>
          <input
            className="w-full mx-3 outline-0"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={onClose}
            className="rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X
              className="w-6 h-6 cursor-pointer"
              color="#000000"
              strokeWidth={1.5}
            />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-black/60" />
            </div>
          )}

          {!loading && error && keyword && (
            <p className="text-base text-center px-1 mt-5">{error}</p>
          )}

          {!loading && productList && productList.length > 0 && (
            <ul className="grid grid-cols-3 gap-4 px-2">
              {productList.map((product) => (
                <a
                  key={product.id}
                  className="flex flex-col cursor-pointer"
                  href={`/products/${product.handle}`}
                >
                  <div className="relative group overflow-hidden">
                    <img
                      src={product.images.edges[2]?.node?.url}
                      alt={product.title}
                      className="w-full aspect-3/4 object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={product.images.edges[1]?.node?.url}
                      alt={product.title}
                      className="absolute inset-0 w-full aspect-3/4 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>

                  <p className="text-sm font-medium mt-2 line-clamp-2">
                    {product.title}
                  </p>

                  <p>
                    {formatMoney(product.variants.edges[0].node.price.amount)}
                  </p>
                </a>
              ))}
            </ul>
          )}
        </div>
      </form>
    </>
  );
}

export default SearchBar;
