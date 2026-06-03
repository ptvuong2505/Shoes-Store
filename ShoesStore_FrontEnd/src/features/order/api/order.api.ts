import axiosClient from "@/shared/api/axiosClient";
import type { OrderCheckout, PagedOrderResponse } from "@/features/order/types/order.types";

interface CartPayload {
  productId: string;
  size: number;
  quantity: number;
}

type CartCheckoutPayload = CartPayload[];
type CartCheckoutResponse = string | { id: string };
type PaymentResponse = { message: string };

export const getMyOrders = async (
  page = 1,
  pageSize = 5,
): Promise<PagedOrderResponse> => {
  return axiosClient.get("/orders/my-orders", {
    params: { page, pageSize },
  });
};

export const getOrderDetail = (id: string) => {
  return axiosClient.get(`/orders/${id}`);
};

const buyNow = (payload: CartPayload): Promise<string> => {
  return axiosClient.post("/orders/buy-now", payload);
};

const checkoutBuyNow = (orderId: string): Promise<OrderCheckout> => {
  return axiosClient.get(`/orders/checkout/${orderId}`);
};

const checkoutCart = (
  payload: CartCheckoutPayload,
): Promise<CartCheckoutResponse> => {
  return axiosClient.post("/orders/checkout", payload);
};

const payment = (
  orderId: string,
  selectedAddressId: string,
): Promise<PaymentResponse> => {
  return axiosClient.post(`/orders/payment/${orderId}`, {
    selectedAddressId,
  });
};

export const orderApi = {
  getMyOrders,
  getOrderDetail,
  buyNow,
  checkoutBuyNow,
  checkoutCart,
  payment,
};
