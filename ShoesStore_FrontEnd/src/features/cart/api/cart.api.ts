import axiosClient from "@/shared/api/axiosClient";
import type { CartItem } from "@/features/cart/types/cart.types";

interface CartPayload {
  productId: string;
  size: number;
  quantity: number;
}

export const cartApi = {
  addToCart: async (payload: CartPayload) => {
    return axiosClient.post("/carts", payload);
  },
  getMyCart: async (): Promise<CartItem[]> => {
    return axiosClient.get("/carts");
  },
};
