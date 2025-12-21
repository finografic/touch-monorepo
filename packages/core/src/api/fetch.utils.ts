/**
 * Fetch-based error transformation and utility functions
 *
 * This is a library-agnostic module that provides:
 * - Error transformation utilities
 * - URL building utilities
 * - Response normalization utilities
 */

import type { ApplicationError, ErrorResponse } from './error.types';
import type { FetchResponse } from './fetch.types';
import { FetchError } from './fetch.types';
import { ERROR_CODES, ERROR_MESSAGES } from './error.constants';
import { errorResponseSchema } from './error.schema';

// ============================================================================
// URL UTILITIES
// ============================================================================

/**
 * Builds URL with query parameters
 * Handles endpoints with or without leading slashes correctly
 *
 * @example
 * buildUrl('http://localhost:4040/api', 'users', { page: 1 })
 * // => 'http://localhost:4040/api/users?page=1'
 */
export function buildUrl(
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): string {
  // Parse baseURL to get origin and pathname
  const baseUrlObj = new URL(baseURL);

  // Remove leading slash from endpoint if present (to make it relative)
  // This ensures the baseURL's path (e.g., /api) is preserved
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Build the full pathname by combining baseURL pathname with endpoint
  const basePath = baseUrlObj.pathname.endsWith('/')
    ? baseUrlObj.pathname.slice(0, -1) // Remove trailing slash
    : baseUrlObj.pathname;
  const fullPathname = `${basePath}/${normalizedEndpoint}`;

  // Create new URL with the combined pathname
  const url = new URL(fullPathname, baseUrlObj.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// ============================================================================
// RESPONSE NORMALIZATION
// ============================================================================

/**
 * Normalizes fetch response to consistent structure
 * Parses JSON response body into a consistent format
 *
 * @throws {FetchError} If response cannot be parsed as JSON
 */
export async function normalizeResponse<T>(response: Response): Promise<FetchResponse<T>> {
  // Always parse JSON - if response is not JSON, this will throw
  // which is fine because we want consistent error handling
  let data: T;

  try {
    const text = await response.text();
    // If empty response, return empty object
    if (!text.trim()) {
      data = {} as T;
    } else {
      data = JSON.parse(text) as T;
    }
  } catch (parseError) {
    // If JSON parsing fails, wrap the error
    throw new FetchError(
      `Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      response.status,
      undefined,
      false,
    );
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    ok: response.ok,
  };
}

// ============================================================================
// ERROR UTILITIES
// ============================================================================

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
 * Determines if an error is retryable based on status code
 * Consolidated from multiple implementations
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Error && 'status' in error) {
    const status = (error as any).status;
    return (
      status === 0 || // Network error
      status === 408 || // Timeout
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

