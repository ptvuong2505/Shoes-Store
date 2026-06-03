type Props = {
  UrlImage: string;
  Brand: string;
  Name: string;
  Price: number;
};

const TrendingProductCard = ({ UrlImage, Brand, Name, Price }: Props) => {
  return (
    <div className="min-w-75 group flex flex-col bg-[#f8f6f6] dark:bg-foreground rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-4/5 overflow-hidden">
        <img
          src={UrlImage}
          alt="Product Image"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-bold text-primary dark:text-primary-foreground uppercase tracking-widest">
          {Brand}
        </p>
        <h3 className="text-lg text-black dark:text-primary-foreground font-bold mt-1">
          {Name}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-black text-black dark:text-primary-foreground">
            ${Price.toFixed(2)}
          </p>
          <button className="bg-[#1b110d] dark:bg-white dark:text-black text-white p-2 rounded-lg">
            <span className="material-symbols-outlined text-base">
              add_shopping_cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductCard;
