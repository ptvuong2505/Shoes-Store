import type {
  FilterOptions,
  PagedResult,
  Product,
  ProductDetail,
  ProductFilter,
} from "@/types/product.type";
import axiosClient from "./axiosClient";

export const productApi = {
  getTrendingProducts: async () => {},

  getAllProducts: async (
    filter?: ProductFilter,
  ): Promise<PagedResult<Product>> => {
    const params = new URLSearchParams();

    if (filter?.search) params.append("Search", filter.search);
    if (filter?.page) params.append("Page", String(filter.page));
    if (filter?.pageSize) params.append("PageSize", String(filter.pageSize));

    filter?.genders?.forEach((g) => params.append("Genders", g));
    filter?.brands?.forEach((b) => params.append("Brands", b));
    filter?.sizes?.forEach((s) => params.append("Sizes", String(s)));

    return axiosClient.get(`/products?${params.toString()}`);
  },
  getFilterOptions: async (): Promise<FilterOptions> => {
    return axiosClient.get("/products/filters");
  },
  getProductDetailById: async (id: string): Promise<ProductDetail> => {
    return axiosClient.get(`/products/${id}`);
  },
};
