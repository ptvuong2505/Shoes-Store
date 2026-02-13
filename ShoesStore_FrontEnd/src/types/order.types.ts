// types/order.ts
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  gender: string;
  thumbnailUrl?: string;
  size: string;
}

export interface Order {
  id: string;
  orderDate: string;
  status: "Delivered" | "Shipping" | "Cancelled" | string;
  totalAmount: number;
}

export interface PagedOrderResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Order[];
}

export interface OrderDetail extends Order {
  shippingAddress?: string;
  items: OrderItem[];
}
