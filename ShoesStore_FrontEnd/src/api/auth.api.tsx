import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/types/auth.types";
import axiosClient from "./axiosClient";

export const authApi = {
  login: (data: LoginPayload): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", data),
  logout: (): Promise<void> => axiosClient.post("/auth/logout"),
  register: (data: RegisterPayload): Promise<void> =>
    axiosClient.post("/auth/register", data),
  sendOtp: (email: string): Promise<void> =>
    axiosClient.post("/auth/forgot-password", { email }),
  verifyOtp: (email: string, otp: string): Promise<void> =>
    axiosClient.post("/auth/verify-otp", { email, otp }),
};
