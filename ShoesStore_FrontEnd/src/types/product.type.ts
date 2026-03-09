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
