import axiosClient from "./axiosClient";
import type { PagedOrderResponse } from "@/types/order.types";

interface CartPayload {
  productId: number;
  size: number;
  quantity: number;
}

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

const addToCart = (payload: CartPayload) => {
  return axiosClient.post("/cart", payload);
};

const buyNow = (payload: CartPayload): Promise<{ id: string }> => {
  return axiosClient.post("/orders/buy-now", payload);
};

export const orderApi = { getMyOrders, getOrderDetail, addToCart, buyNow };
