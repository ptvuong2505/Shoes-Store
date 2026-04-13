import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/types/auth.types";
import axiosClient from "./axiosClient";

export const authApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", data),
  logout: async () => axiosClient.post("/auth/logout"),
  register: async (data: RegisterPayload) =>
    axiosClient.post("/auth/register", data),
  sendOtp: async (email: string) =>
    axiosClient.post("/auth/forgot-password", { email }),
  verifyOtp: async (email: string, otp: string) =>
    axiosClient.post("/auth/verify-otp", { email, otp }),
};
