import axiosClient from "./axiosClient";
import type { CartItem } from "@/types/cart.types";

export const cartApi = {
  getMyCart: async (): Promise<CartItem[]> => {
    return axiosClient.get("/carts");
  },
};
