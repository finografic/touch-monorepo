export interface ErrorResponse {
  message: string;
  code?: string | number;
  status?: number;
  details?: unknown;
}

export interface ErrorResponse_DEV {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ValidationError {
  code: 'VALIDATION_ERROR';
  message: string;
  issues: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface NetworkError {
  code: 'NETWORK_ERROR';
  message: string;
  status?: number;
  isRetryable: boolean;
}

export interface RateLimitError {
  code: 'RATE_LIMIT_ERROR';
  message: string;
  retryAfter: number;
  isRetryable: true;
}

export interface HttpError {
  code: 'HTTP_ERROR';
  message: string;
  status: number;
  isRetryable: boolean;
}

export interface TimeoutError {
  code: 'TIMEOUT_ERROR';
  message: string;
  isRetryable: true;
}

export type ApplicationError = ValidationError | NetworkError | RateLimitError | HttpError | TimeoutError;
