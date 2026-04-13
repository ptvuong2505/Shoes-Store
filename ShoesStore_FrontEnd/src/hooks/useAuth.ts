import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { LoginPayload, RegisterPayload } from "@/types/auth.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const login = async (loginPayload: LoginPayload) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const data = await authApi.login(loginPayload);

      localStorage.setItem("accessToken", data.accessToken);

      navigate("/", { replace: true });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();

    useAuthStore.getState().logout();

    useAuthStore.persist.clearStorage();
    navigate("/", { replace: true });
  };

  const register = async (registerPayload: RegisterPayload) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.register(registerPayload);
      setSuccess("Registration successful! Welcome to the community.");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.sendOtp(email);
      navigate("/auth/send-otp", { state: { email }, replace: true });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);
        setError("Sending OTP failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.verifyOtp(email, otp);
      navigate("/auth/verify-otp", { state: { email }, replace: true });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    register,
    sendOtp,
    verifyOtp,
    loading,
    error,
    success,
  };
}
