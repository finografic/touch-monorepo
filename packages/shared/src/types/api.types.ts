import type { AxiosResponse } from 'axios';

// Map Axios error codes to HTTP status codes
export const ERROR_CODE_MAP = {
  ERR_FR_TOO_MANY_REDIRECTS: 310,
  ERR_BAD_OPTION_VALUE: 400,
  ERR_BAD_OPTION: 400,
  ERR_NETWORK: 503,
  ERR_DEPRECATED: 410,
  ERR_BAD_RESPONSE: 502,
  ERR_BAD_REQUEST: 400,
  ERR_NOT_SUPPORT: 501,
  ERR_INVALID_URL: 404,
  ERR_CANCELED: 499, // Non-standard status for client cancellation
  ECONNABORTED: 408,
  ETIMEDOUT: 408,
} as const;

export type AxiosErrorCode = keyof typeof ERROR_CODE_MAP;

export interface ErrorResponse {
  message: string;
  status?: number;
  code?: AxiosErrorCode;
}

// Extend AxiosResponse but keep our additional fields
export interface ApiResponse<T> extends Omit<AxiosResponse<T>, 'data'> {
  data: T;
  message?: string;
  timestamp: number;
}

// Remove redundant types since ApiResponse now extends AxiosResponse
export type ApiListResponse<T> = ApiResponse<T[]>;
export type ApiItemResponse<T> = ApiResponse<T>;
