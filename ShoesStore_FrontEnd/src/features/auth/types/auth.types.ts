import type { User } from "@/entities/user/model/user.types";

export interface LoginPayload {
  email: string;
  password: string;
  isRemember: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  userId: string;
  fullName: string;
  email: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
