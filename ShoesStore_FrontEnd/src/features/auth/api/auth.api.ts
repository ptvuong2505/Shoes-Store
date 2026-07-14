import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  VerifyOtpResponse,
} from "@/features/auth/types/auth.types";
import axiosClient, { refreshAccessToken } from "@/shared/api/axiosClient";

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosClient.post<LoginResponse>("/auth/login", payload),
  logout: () => axiosClient.post<void>("/auth/logout"),
  register: (payload: RegisterPayload) =>
    axiosClient.post<RegisterResponse>("/auth/register", payload),
  sendOtp: (email: string) =>
    axiosClient.post<{ email: string }>("/auth/send-otp", { email }),
  verifyOtp: (email: string, otp: string) =>
    axiosClient.post<VerifyOtpResponse>("/auth/verify-otp", { email, otp }),
  resetPassword: (payload: ResetPasswordPayload) =>
    axiosClient.post<void>("/auth/reset-password", payload),
  refreshSession: refreshAccessToken,
};
