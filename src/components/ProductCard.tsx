import { Heart, Plus } from "lucide-react";
import { formatMoney } from "../utils/formatMoney";
import type { SummaryProduct } from "../types/Product.type";

type ProductCardProps = {
  onPlus?: () => void;
  product: SummaryProduct;
};

const ProductCard = ({ product, onPlus }: ProductCardProps) => {
  return (
    <a
      className="relative w-full overflow-hidden group cursor-pointer"
      href={`/products/${product.node.handle}`}
    >
      <img
        src={product.node.images.edges[2]?.node.url}
        className="w-full h-100 object-cover transition-opacity duration-300 group-hover:opacity-0"
        alt={product.node.title}
      />
      <img
        src={product.node.images.edges[1]?.node.url}
        className="absolute inset-0 w-full h-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 object-cover"
        alt={product.node.title}
      />
      <div className="mt-2 flex justify-between">
        <div>
          <div className="font-thin text-sm font-serif">
            {product.node.title}
          </div>
          <div className="font-thin text-sm font-serif">
            {formatMoney(product.node.variants.edges[0].node.price.amount)}
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
              onPlus?.();
            }}
          />
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
