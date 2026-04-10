export interface ProductFilter {
  search?: string;
  genders?: string[];
  brands?: string[];
  sizes?: number[];
  page?: number;
  pageSize?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  mainImageUrl: string;
  brand: string;
  gender: string;
  averageRating: number;
  totalRatings: number;
}

export interface ProductDetail extends Product {
  imageUrls: string[];
  sizes: { size: number; stock: number }[];
  ratings: number[];
  reviews: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterOptions {
  brands: string[];
  genders: string[];
  sizes: number[];
}

export interface AdminProductSummary {
  totalProducts: number;
  outOfStockProducts: number;
  topSellingProductName: string;
  topSellingUnits: number;
  averageMarginPercent: number;
}

export interface AdminProductItem {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  mainImageUrl?: string;
  totalStock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock" | string;
}

export interface AdminProductsResponse {
  summary: AdminProductSummary;
  data: PagedResult<AdminProductItem>;
}

export interface AdminUpsertProductPayload {
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  totalStock: number;
  size: number;
  mainImageUrl?: string;
  description?: string;
  gender?: string;
}
