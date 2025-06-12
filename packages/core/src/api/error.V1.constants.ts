// Map Axios error codes to HTTP status codes
export const AXIOS_ERROR_CODE_MAP = {
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

export type AxiosErrorCode = keyof typeof AXIOS_ERROR_CODE_MAP;

// Application-specific error codes
export const AxiosErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type AxiosErrorCodeType = (typeof AxiosErrorCodes)[keyof typeof AxiosErrorCodes];
