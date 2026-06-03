import type {
  AdminProductItem,
  AdminProductsResponse,
  AdminUpsertProductPayload,
  FilterOptions,
  PagedResult,
  Product,
  ProductDetail,
  ProductFilter,
} from "@/features/product/types/product.types";
import axiosClient from "@/shared/api/axiosClient";

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
  getAdminProducts: async (
    page = 1,
    pageSize = 10,
    search = "",
  ): Promise<AdminProductsResponse> => {
    const params = new URLSearchParams();
    params.append("Page", String(page));
    params.append("PageSize", String(pageSize));
    if (search.trim()) params.append("Search", search.trim());

    return axiosClient.get(`/products/admin?${params.toString()}`);
  },
  createAdminProduct: async (
    payload: AdminUpsertProductPayload,
  ): Promise<AdminProductItem> => {
    return axiosClient.post("/products/admin", payload);
  },
  updateAdminProduct: async (
    id: string,
    payload: AdminUpsertProductPayload,
  ): Promise<AdminProductItem> => {
    return axiosClient.put(`/products/admin/${id}`, payload);
  },
  deleteAdminProduct: async (id: string): Promise<void> => {
    return axiosClient.delete(`/products/admin/${id}`);
  },
};
