import { productApi } from "@/api/product.api";
import { FilterComboBox } from "@/components/filter/FilterComboBox";
import { ProductFindItem } from "@/components/product/ProductFindItem";
import type {
  FilterOptions,
  PagedResult,
  Product,
  ProductFilter,
} from "@/types/product.type";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low", "Name: A-Z"];

const Products = () => {
  const [products, setProducts] = useState<PagedResult<Product>>({
    items: [],
    page: 1,
    pageSize: 6,
    totalItems: 0,
    totalPages: 0,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [] as string[],
    genders: [] as string[],
    sizes: [] as number[],
  });

  const [filters, setFilters] = useState<ProductFilter>({
    search: "",
    genders: [],
    brands: [],
    sizes: [],
    page: 1,
    pageSize: 6,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAllProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    const fetchFilterOptions = async () => {
      try {
        const data = await productApi.getFilterOptions();
        console.log("Fetched filter options:", data);
        setFilterOptions(data);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };
    fetchProducts();
    fetchFilterOptions();
  }, [filters]);

  const toggleGender = useCallback((gender: string) => {
    setFilters((f) => {
      const genders = f.genders?.includes(gender)
        ? f.genders.filter((g) => g !== gender)
        : [...(f.genders || []), gender];
      return { ...f, genders, page: 1 };
    });
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilters((f) => {
      const brands = f.brands?.includes(brand)
        ? f.brands.filter((b) => b !== brand)
        : [...(f.brands || []), brand];
      return { ...f, brands, page: 1 };
    });
  }, []);

  const toggleSize = useCallback((size: number) => {
    setFilters((f) => {
      const sizes = f.sizes?.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...(f.sizes || []), size];
      return { ...f, sizes, page: 1 };
    });
  }, []);

  const handleSort = useCallback((value: string) => {
    setProducts((prev) => {
      const sorted = [...prev.items];
      switch (value) {
        case "Price: Low to High":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "Price: High to Low":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "Name: A-Z":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      return { ...prev, items: sorted };
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters({
      search: "",
      genders: [],
      brands: [],
      sizes: [],
      page: 1,
      pageSize: 6,
    });
  }, []);
  return (
    <div>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-10 py-6">
        {/* Breadcrumbs */}
        {/* <div className="flex flex-wrap items-center gap-2 mb-4">
          <a
            className="text-[#9a5f4c] text-sm font-medium hover:text-primary"
            href="#" 
          >
            Find
          </a>
          <span className="material-symbols-outlined text-sm text-[#9a5f4c]">
            chevron_right
          </span>
          <span className="text-[#1b110d] dark:text-white text-sm font-bold">
            Running Shoes
          </span>
        </div> */}
        <div className="flex gap-10">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6 sticky top-24 self-start ">
            <div className="flex items-center justify-between">
              <h1 className="text-background-dark dark:text-white text-xl font-bold leading-normal">
                Filters
              </h1>
              <button
                onClick={clearAll}
                className="text-primary text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Clear All
              </button>
            </div>
            {/* Filter Sections */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              {/* Gender */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-background-dark dark:text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">
                    person
                  </span>
                  Gender
                </div>
                <div className="flex flex-col px-1">
                  {filterOptions.genders.map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                    >
                      <input
                        className="h-5 w-5 rounded border-[#e7d5cf] border-2 bg-transparent text-primary focus:ring-primary checked:bg-primary active-filter-tick"
                        type="checkbox"
                        checked={filters.genders?.includes(gender) ?? false}
                        onChange={() => toggleGender(gender)}
                      />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Brand */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-background-dark dark:text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">
                    sell
                  </span>
                  Brand
                </div>
                <div className="flex flex-col px-1">
                  {filterOptions.brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                    >
                      <input
                        className="h-5 w-5 rounded border-[#e7d5cf] border-2 bg-transparent text-primary focus:ring-primary checked:bg-primary active-filter-tick"
                        type="checkbox"
                        checked={filters.brands?.includes(brand) ?? false}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="text-sm font-medium">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price Range */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-background-dark dark:text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">
                    payments
                  </span>
                  Price Range
                </div>
              </div>
              {/* Size */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-background-dark dark:text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-lg">
                    straighten
                  </span>
                  Size
                </div>
                <div className="grid grid-cols-3 gap-2 px-1">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={
                        filters.sizes?.includes(size)
                          ? "h-10 border-2 border-primary bg-primary/10 text-primary font-bold rounded-lg text-sm"
                          : "h-10 border-2 border-[#e7d5cf] hover:border-primary/50 text-background-dark dark:text-white font-medium rounded-lg text-sm transition-colors"
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          {/* Product Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Listing Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl">
              <p className="text-[#9a5f4c] text-sm font-medium">
                {products.totalItems} Products found
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#9a5f4c]">
                  Sort by:
                </span>
                <div className="">
                  <FilterComboBox
                    items={SORT_OPTIONS}
                    placeholder="Sort by"
                    onValueChange={handleSort}
                  />
                </div>
              </div>
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.items.map((product) => {
                return (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <ProductFindItem product={product} />
                  </Link>
                );
              })}
            </div>
            {/* Pagination */}
            {products.totalPages > 1 && (
              <div className="mt-10 mb-20 flex items-center justify-center gap-2">
                <button
                  className="flex items-center justify-center rounded-lg size-10 border-2 border-primary/10 text-[#9a5f4c] hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  disabled={products.page <= 1}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page! - 1 }))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>

                {(() => {
                  const pages: (number | "...")[] = [];
                  const current = products.page;
                  const total = products.totalPages;

                  pages.push(1);
                  if (current > 3) pages.push("...");
                  for (
                    let i = Math.max(2, current - 1);
                    i <= Math.min(total - 1, current + 1);
                    i++
                  ) {
                    pages.push(i);
                  }
                  if (current < total - 2) pages.push("...");
                  if (total > 1) pages.push(total);

                  return pages.map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="text-[#9a5f4c] px-1">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() =>
                          setFilters((f) => ({ ...f, page: p as number }))
                        }
                        className={
                          p === current
                            ? "flex items-center justify-center rounded-lg size-10 bg-primary text-white font-bold shadow-md shadow-primary/20"
                            : "flex items-center justify-center rounded-lg size-10 border-2 border-transparent text-background-dark dark:text-white font-bold hover:bg-primary/5 transition-colors"
                        }
                      >
                        {p}
                      </button>
                    ),
                  );
                })()}

                <button
                  className="flex items-center justify-center rounded-lg size-10 border-2 border-primary/10 text-[#9a5f4c] hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  disabled={products.page >= products.totalPages}
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: f.page! + 1 }))
                  }
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
