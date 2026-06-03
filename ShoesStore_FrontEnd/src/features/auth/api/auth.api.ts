import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import axiosClient from "@/shared/api/axiosClient";

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export const authApi = {
  login: async (data: LoginPayload): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", data),
  logout: async () => axiosClient.post("/auth/logout"),
  register: async (data: RegisterPayload) =>
    axiosClient.post("/auth/register", data),
  sendOtp: async (email: string) =>
    axiosClient.post("/auth/send-otp", { email }),
  verifyOtp: async (email: string, otp: string) =>
    axiosClient.post("/auth/verify-otp", { email, otp }),
  resetPassword: async (payload: ResetPasswordPayload) =>
    axiosClient.post("/auth/reset-password", payload),
};
