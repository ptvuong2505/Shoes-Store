import axiosClient from "./axiosClient";
import type { PagedOrderResponse } from "@/types/order.types";

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
