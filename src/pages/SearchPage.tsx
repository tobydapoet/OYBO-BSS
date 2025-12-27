import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProductType } from "../types/Product.type";
import { searchProducts } from "../api/product.api";
import { formatMoney } from "../utils/formatMoney";

function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [keyword, setKeyword] = useState(query);
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    if (!query.trim()) {
      setProductList([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setError("");
        const res = await searchProducts(query, 20);
        setProductList(res || []);
        if (!res || res.length === 0) {
          setError(
            `No results found for “${query}”. Check the spelling or use a different word or phrase.`
          );
        }
      } catch {
        setError(
          `No results found for “${query}”. Check the spelling or use a different word or phrase.`
        );
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4 mx-4 pt-4">
        <div className="font-inter  text-2xl my-5">
          {productList.length > 0 ? `${productList.length} results` : error}
        </div>
        <div className="group focus-within:border focus-within:border-black p-0.75 transition-all">
          <div
            className="
              flex items-center py-2 px-3
              border-b border-black
              group-focus-within:border
              group-focus-within:border-black
            "
          >
            <input
              className="w-full outline-none"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
              <Search className="w-5 h-5 ml-3" />
            </button>
          </div>
        </div>
      </form>

      <div className="px-4 mt-6">
        {productList.length > 0 && (
          <ul className="md:grid md:grid-cols-6 gap-15">
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
                    className="w-full aspect-5/6 object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img
                    src={product.images.edges[1]?.node?.url}
                    alt={product.title}
                    className="absolute inset-0 w-full aspect-5/6 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                <p className="font-medium mt-2 line-clamp-2">{product.title}</p>

                <p>
                  {formatMoney(product.variants.edges[0].node.price.amount)}
                </p>
              </a>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SearchPage;
