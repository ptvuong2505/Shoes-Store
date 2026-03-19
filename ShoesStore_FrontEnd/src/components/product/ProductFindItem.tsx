import type { Product } from "@/types/product.type";
import { formatVndCurrency } from "@/lib/currency";

interface ProductFindItemProps {
  product: Product;
}

export const ProductFindItem = ({ product }: ProductFindItemProps) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20">
      <div className="relative aspect-4/5 overflow-hidden bg-background-light">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          data-alt="Red Nike running shoe on neutral background"
          src={product.mainImageUrl}
        />
      </div>
      <div className="p-5 flex flex-col gap-1">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">
          {product.brand}
        </p>
        <h3 className="text-background-dark dark:text-white text-lg font-bold">
          {product.name}
        </h3>
        <p className="text-[#9a5f4c] text-sm">Road Running Shoes</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-medium text-primary">
            {formatVndCurrency(product.price)}
          </p>
          {product.discountPrice && (
            <p className="text-sm font-mono text-[#9a5f4c] line-through">
              {formatVndCurrency(product.discountPrice)}
            </p>
          )}
          <div className="flex items-center gap-1 text-yellow-500">
            <span className="material-symbols-outlined text-sm fill-1">
              star
            </span>
            <span className="text-xs font-bold text-[#9a5f4c]">
              {product.averageRating.toFixed(1)}{" "}
              {product.totalRatings > 0
                ? `(${product.totalRatings})`
                : "(No ratings)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
