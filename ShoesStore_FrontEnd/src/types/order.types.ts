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

// Checkout types

export interface OrderItemCheckout {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  size: number;
  subTotal: number;
}

export interface AddressCheckout {
  id: string;
  userId: string;
  receiverName: string;
  phone: string;
  city: string;
  isPrimary: boolean;
  addressLine: string;
}

export interface OrderCheckout {
  orderId: string;
  status: string;
  totalAmount: number;
  address?: AddressCheckout;
  items: OrderItemCheckout[];
}
