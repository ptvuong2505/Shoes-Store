import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { ApiClientError, toApiClientError } from "@/shared/api/api-error";
import type {
  AccessTokenResponse,
  ApiResponse,
} from "@/shared/api/api.types";
import { tokenStore } from "@/shared/api/token-store";

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const baseURL = import.meta.env.VITE_API_URL;
const http = axios.create({ baseURL, timeout: 10_000, withCredentials: true });
const refreshHttp = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = refreshHttp
      .post<ApiResponse<AccessTokenResponse>>("/auth/refresh-token")
      .then(({ data: envelope }) => {
        const token = envelope.data?.accessToken;
        if (!envelope.success || !token) {
          throw new ApiClientError(
            envelope.message,
            envelope.statusCode,
            envelope.error?.code,
            envelope.error?.details,
          );
        }
        tokenStore.set(token);
        return token;
      })
      .catch((error: unknown) => {
        tokenStore.clear();
        throw toApiClientError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(toApiClientError(error));
    }

    const request = error.config as RetryableRequest;
    const isAuthRequest = request.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !request._retry && !isAuthRequest) {
      request._retry = true;
      try {
        const token = await refreshAccessToken();
        request.headers.Authorization = `Bearer ${token}`;
        return http(request);
      } catch (refreshError) {
        window.dispatchEvent(new Event("auth:session-expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(toApiClientError(error));
  },
);

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const { data: envelope } = await http.request<ApiResponse<T>>(config);
    if (!envelope.success) {
      throw new ApiClientError(
        envelope.message,
        envelope.statusCode,
        envelope.error?.code,
        envelope.error?.details,
      );
    }
    return envelope.data as T;
  } catch (error) {
    throw toApiClientError(error);
  }
};

const axiosClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "POST", url, data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PUT", url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PATCH", url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url }),
};

export default axiosClient;
