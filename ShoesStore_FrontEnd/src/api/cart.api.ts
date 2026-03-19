import axiosClient from "./axiosClient";
import type { CartItem, CartResponse } from "@/types/cart.types";

export const cartApi = {
  getMyCart: async (): Promise<CartResponse | CartItem[]> => {
    return axiosClient.get("/cart");
  },
};
