/**
 * Fetch-based error transformation utilities
 * Replaces axios-specific error handling with fetch-compatible versions
 *
 * This is a library-agnostic error transformer that works with any error
 * that has a `status` property and optional `data` property.
 */

import type { ApplicationError, ErrorResponse } from './error.types';
import { ERROR_CODES, ERROR_MESSAGES } from './error.constants';
import { errorResponseSchema } from './error.schema';

/**
 * Error interface compatible with fetch errors
 * Any error with these properties will work with these utilities
 */
interface FetchCompatibleError extends Error {
  status: number;
  data?: any;
  isRetryable?: boolean;
}

/**
 * Determines if an error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error && 'status' in error) {
    const status = (error as any).status;
    return (
      status === 0 || // Network error
      status === ERROR_CODES.REQUEST_TIMEOUT ||
      status === ERROR_CODES.TOO_MANY_REQUESTS ||
      status === ERROR_CODES.INTERNAL_SERVER_ERROR ||
      status === ERROR_CODES.BAD_GATEWAY ||
      status === ERROR_CODES.SERVICE_UNAVAILABLE ||
      status === ERROR_CODES.GATEWAY_TIMEOUT ||
      status >= 500
    );
  }
  return false;
};

/**
 * Transforms fetch errors to ApplicationError format
 * Compatible with FetchError, standard Error objects, and any error with status/data
 */
export const transformFetchError = (error: unknown): ApplicationError => {
  // Handle FetchError-compatible errors (from our fetch client or any error with status)
  if (error instanceof Error && 'status' in error) {
    const fetchError = error as FetchCompatibleError;
    const status = fetchError.status;
    const data = fetchError.data;

    // Try to parse as ZodErrorResponse
    if (data) {
      try {
        const validatedError = errorResponseSchema.parse(data);
        if (validatedError.error?.issues) {
          return {
            code: 'VALIDATION_ERROR',
            message: validatedError.error.message || 'Validation error',
            issues: validatedError.error.issues,
          };
        }
      } catch {
        // If not a valid ZodErrorResponse, continue with standard error handling
      }
    }

    // Handle rate limiting
    if (status === ERROR_CODES.TOO_MANY_REQUESTS) {
      const retryAfter = (data as any)?.retryAfter || 60;
      return {
        code: 'RATE_LIMIT_ERROR',
        message: ERROR_MESSAGES[ERROR_CODES.TOO_MANY_REQUESTS],
        retryAfter,
        isRetryable: true,
      };
    }

    // Handle timeout
    if (status === 408 || status === ERROR_CODES.REQUEST_TIMEOUT) {
      return {
        code: 'TIMEOUT_ERROR',
        message: ERROR_MESSAGES[ERROR_CODES.REQUEST_TIMEOUT],
        isRetryable: true,
      };
    }

    // Handle HTTP errors with specific status codes
    if (status >= 400 && status < 600) {
      // Type-safe access: check if status exists in ERROR_MESSAGES, otherwise use fallback
      const errorMessage = (status in ERROR_MESSAGES ? ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] : null) || fetchError.message || 'HTTP error';
      return {
        code: 'HTTP_ERROR',
        message: errorMessage,
        status,
        isRetryable: isRetryableError(fetchError),
      };
    }

    // Handle network errors (status 0)
    const networkErrorMessage = (status in ERROR_MESSAGES ? ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] : null) || fetchError.message || 'Network error';
    return {
      code: 'NETWORK_ERROR',
      message: networkErrorMessage,
      status,
      isRetryable: true,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Check if it's a timeout error
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: ERROR_MESSAGES[ERROR_CODES.REQUEST_TIMEOUT],
        isRetryable: true,
      };
    }

    // Check if it's a network error
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        isRetryable: true,
      };
    }

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

/**
 * Legacy alias for backward compatibility during migration
 * @deprecated Use transformFetchError instead
 */
export const transformAxiosError = transformFetchError;

