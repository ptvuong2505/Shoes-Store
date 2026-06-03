const BrandSection = () => {
  const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Asics"];
  return (
    <section className="py-12 bg-white dark:bg-white/5 flex border border-b border-[#ee5b2b]/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-40 hover:grayscale-0 transition-all duration-700 overflow-hidden">
          {brands.map((brand) => {
            return (
              <span key={brand} className="text-2xl font-black uppercase">
                {brand}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
