export interface ApiErrorBody {
  code: string;
  details?: Record<string, string[]> | null;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error: ApiErrorBody | null;
}

export interface AccessTokenResponse {
  accessToken: string;
}
