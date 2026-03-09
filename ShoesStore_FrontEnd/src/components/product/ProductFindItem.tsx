import type { Product } from "@/types/product.type";

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
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/60 to-transparent">
          <button className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm">
            Quick Add
          </button>
        </div>
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
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          {product.discountPrice && (
            <p className="text-sm font-mono text-[#9a5f4c] line-through">
              {product.discountPrice.toLocaleString("vi-VN")}₫
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
