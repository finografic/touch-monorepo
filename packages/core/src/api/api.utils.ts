// @ts-nocheck
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ApplicationError, ErrorResponse } from './error.types';
import { ERROR_CODES, ERROR_MESSAGES } from './error.constants';

import { errorResponseSchema } from './error.schema';

import type { ZodErrorResponse } from './error.schema';

// ======================================================================== //

// Custom HTTP Exception class for better error handling
export class HttpException extends Error {
  constructor(
    message: string,
    public cause: {
      response?: {
        data?: unknown;
        status?: number;
        headers?: Record<string, string>;
      };
    },
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

// ======================================================================== //

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      status === ERROR_CODES.REQUEST_TIMEOUT ||
      status === ERROR_CODES.TOO_MANY_REQUESTS ||
      status === ERROR_CODES.INTERNAL_SERVER_ERROR ||
      status === ERROR_CODES.BAD_GATEWAY ||
      status === ERROR_CODES.SERVICE_UNAVAILABLE ||
      status === ERROR_CODES.GATEWAY_TIMEOUT
    );
  }
  return false;
};

export const transformAxiosError = (error: unknown): ApplicationError => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Try to parse as ZodErrorResponse
      try {
        const validatedError = errorResponseSchema.parse(data);
        if (validatedError.error.issues) {
          return {
            code: 'VALIDATION_ERROR',
            message: validatedError.error.message,
            issues: validatedError.error.issues,
          };
        }
      } catch {
        // If not a valid ZodErrorResponse, continue with standard error handling
      }

      // Handle rate limiting
      if (status === ERROR_CODES.TOO_MANY_REQUESTS) {
        const retryAfter = Number(error.response.headers['retry-after']) || 60;
        return {
          code: 'RATE_LIMIT_ERROR',
          message: ERROR_MESSAGES[ERROR_CODES.TOO_MANY_REQUESTS],
          retryAfter,
          isRetryable: true,
        };
      }

      // Handle HTTP errors with specific status codes
      if (status >= 400 && status < 600) {
        return {
          code: 'HTTP_ERROR',
          message: ERROR_MESSAGES[status] || error.message,
          status,
          isRetryable: isRetryableError(error),
        };
      }

      // Handle network errors
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES[status] || error.message,
        status,
        isRetryable: isRetryableError(error),
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        code: 'TIMEOUT_ERROR',
        message: ERROR_MESSAGES[ERROR_CODES.REQUEST_TIMEOUT],
        isRetryable: true,
      };
    }

    // Handle request errors (no response received)
    return {
      code: 'NETWORK_ERROR',
      message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      isRetryable: true,
    };
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message,
      isRetryable: false,
    };
  }

  // Handle unknown errors
  return {
    code: 'NETWORK_ERROR',
    message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
    isRetryable: false,
  };
};

// ======================================================================== //
