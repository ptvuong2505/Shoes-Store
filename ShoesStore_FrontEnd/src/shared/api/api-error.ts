import axios from "axios";
import type { ApiResponse } from "@/shared/api/api.types";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, string[]> | null;

  constructor(
    message: string,
    status: number,
    code = "UNKNOWN_ERROR",
    details?: Record<string, string[]> | null,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const toApiClientError = (error: unknown): ApiClientError => {
  if (error instanceof ApiClientError) return error;

  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const response = error.response;
    return new ApiClientError(
      response?.data?.message ?? "Unable to complete the request.",
      response?.status ?? 0,
      response?.data?.error?.code,
      response?.data?.error?.details,
    );
  }

  return new ApiClientError(
    error instanceof Error ? error.message : "Unable to complete the request.",
    0,
  );
};
