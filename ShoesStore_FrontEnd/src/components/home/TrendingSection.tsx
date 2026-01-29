import ProductItem from "../product/ProductItem";

const TrendingSection = () => {
  const trendingProducts = [
    {
      UrlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1bcoQrLNgLv8-gvdQGCxovmADVWBfZAEMOiLgnB-vAF7sOYNM8JRAiAmOx-mLu0tN9j43Ht5vkAIgRfdzYv6gDCx7GYAjbY9KBGZjiXcI96kEpvSnW_WGW_kr6jlb8NTeyDQDPH7-LiP7FNb6yzJoLCjZ0kw0rgnrHdFzjdKpa5stS8qtIapH8e45IqExg0Mzp6hmARaNE9BdNXdmXMHPlgG5Z2CN0MuSX42JfBRlmP6AVmarZn_IVK2vcApvy_8LIQlMMLXtFY",
      Brand: "BrandA",
      Name: "Shoe A",
      Price: 120,
    },
    {
      UrlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJqWr86MfpHOZfO_TLi2u8-a11siUgBgC2nV2o5D9iBmhMVEhcQLWhNaOK8Mz2P81M1IrH9Gv30K7SZhz34Wrlf99KdToXYCL0kwWlOkLaULTGqKUI53x4l6sQG7vaq4w1t0F2B8SarJJIQIbw6iDQ_wCMT5bqoKqjQ3T82vaJcloiB9A9SGhSPo8wwL6-NLd-6BtBk6bo9g3rcQw6SgQFoVI1JTvlRlm_WglMCXowl1b-R8nWfYx03FzfGTlBL_qWutZ21k-WMwg",
      Brand: "BrandB",
      Name: "Shoe B",
      Price: 150,
    },
    {
      UrlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC68u0VL9oZNkeyMfe0IWetBLcHAiATam1HNWuPftAizUuvpctnN2rG5cMmkxrFqbYSwcxdfY-57jiCMIgsLkimjiWykLLI3wLj7Exi239X1arJEmNCH9AMC9RrUEm7p3V9u6v1qoiBzs4da9Yqpt_5N4iMyvpdhIXXB2SsqCTSn0_MKr-LWbjREwxNQ9_YbnNrkLnfz9dRTkxG5FSY4CA1dZ4luMiYX9UtXYXjcD4LVW8C193l9CM03S9nXqjJL4RJXBthCg9qeGY",
      Brand: "BrandC",
      Name: "Shoe C",
      Price: 130,
    },
    {
      UrlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC68u0VL9oZNkeyMfe0IWetBLcHAiATam1HNWuPftAizUuvpctnN2rG5cMmkxrFqbYSwcxdfY-57jiCMIgsLkimjiWykLLI3wLj7Exi239X1arJEmNCH9AMC9RrUEm7p3V9u6v1qoiBzs4da9Yqpt_5N4iMyvpdhIXXB2SsqCTSn0_MKr-LWbjREwxNQ9_YbnNrkLnfz9dRTkxG5FSY4CA1dZ4luMiYX9UtXYXjcD4LVW8C193l9CM03S9nXqjJL4RJXBthCg9qeGY",
      Brand: "BrandD",
      Name: "Shoe D",
      Price: 140,
    },
  ];
  return (
    <section className="py-20 bg-white dark:bg-primary-foreground/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black tracking-tight text-primary dark:text-primary-foreground">
              Trending Now
            </h2>
            <p className="text-primary dark:text-primary-foreground font-medium">
              Most popular picks this week
            </p>
          </div>
          <div className="flex gap-2">
            <button className="size-12 border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:text-black dark:hover:bg-primary-foreground transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-12 border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white dark:text-black dark:hover:bg-primary-foreground transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8">
          {trendingProducts.map((product, index) => (
            <ProductItem
              key={index}
              UrlImage={product.UrlImage}
              Brand={product.Brand}
              Name={product.Name}
              Price={product.Price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
