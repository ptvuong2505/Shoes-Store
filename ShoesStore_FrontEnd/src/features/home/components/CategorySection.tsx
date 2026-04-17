import CategoryItem from "@/features/home/components/CategoryItem";

const CategorySection = () => {
  const categories = [
    {
      link: "#",
      urlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCl1bcoQrLNgLv8-gvdQGCxovmADVWBfZAEMOiLgnB-vAF7sOYNM8JRAiAmOx-mLu0tN9j43Ht5vkAIgRfdzYv6gDCx7GYAjbY9KBGZjiXcI96kEpvSnW_WGW_kr6jlb8NTeyDQDPH7-LiP7FNb6yzJoLCjZ0kw0rgnrHdFzjdKpa5stS8qtIapH8e45IqExg0Mzp6hmARaNE9BdNXdmXMHPlgG5Z2CN0MuSX42JfBRlmP6AVmarZn_IVK2vcApvy_8LIQlMMLXtFY",
      title: "Men",
    },
    {
      link: "#",
      urlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJqWr86MfpHOZfO_TLi2u8-a11siUgBgC2nV2o5D9iBmhMVEhcQLWhNaOK8Mz2P81M1IrH9Gv30K7SZhz34Wrlf99KdToXYCL0kwWlOkLaULTGqKUI53x4l6sQG7vaq4w1t0F2B8SarJJIQIbw6iDQ_wCMT5bqoKqjQ3T82vaJcloiB9A9SGhSPo8wwL6-NLd-6BtBk6bo9g3rcQw6SgQFoVI1JTvlRlm_WglMCXowl1b-R8nWfYx03FzfGTlBL_qWutZ21k-WMwg",
      title: "Women",
    },
    {
      link: "#",
      urlImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC68u0VL9oZNkeyMfe0IWetBLcHAiATam1HNWuPftAizUuvpctnN2rG5cMmkxrFqbYSwcxdfY-57jiCMIgsLkimjiWykLLI3wLj7Exi239X1arJEmNCH9AMC9RrUEm7p3V9u6v1qoiBzs4da9Yqpt_5N4iMyvpdhIXXB2SsqCTSn0_MKr-LWbjREwxNQ9_YbnNrkLnfz9dRTkxG5FSY4CA1dZ4luMiYX9UtXYXjcD4LVW8C193l9CM03S9nXqjJL4RJXBthCg9qeGY",
      title: "Kids",
    },
  ];
  return (
    <section className="py-20 px-4 lg:px-10 bg-background dark:bg-foreground">
      <div className="flex items-end max-w-7xl mx-auto justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-primary dark:text-primary-foreground">
            Explore Categories
          </h2>
          <div className="h-1 w-20 bg-primary"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryItem
                key={index}
                link={category.link}
                urlImage={category.urlImage}
                title={category.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
