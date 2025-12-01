/**
 * Native Fetch API Client
 *
 * Replaces axios with native fetch for better performance, smaller bundle size,
 * and modern web standards. Provides consistent error handling and response normalization.
 */

import type { ErrorResponse } from '@workspace/core/api';
import { ERROR_CODES, ERROR_MESSAGES } from '@workspace/core/api';

// TypeScript now knows API_URL exists and is a string
const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL is not defined in process.env');
}

// Request configuration interface
export interface FetchRequestConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
  // Allow override of base URL for specific requests
  baseURL?: string;
}

// Normalized response interface (always consistent structure)
export interface FetchResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

// Custom error class for API errors
export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
    public isRetryable: boolean = false,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
function createTimeout(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new FetchError('Request timeout', 408, undefined, true)), timeout);
  });
}

/**
 * Builds URL with query parameters
 * Handles endpoints with or without leading slashes correctly
 */
function buildUrl(
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

/**
 * Normalizes fetch response to consistent structure
 * Parses JSON response body into a consistent format
 */
async function normalizeResponse<T>(response: Response): Promise<FetchResponse<T>> {
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

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: FetchError): boolean {
  return (
    error.status === 0 || // Network error
    error.status === 408 || // Timeout
    error.status === 429 || // Rate limiting
    error.status >= 500 || // Server errors
    error.isRetryable
  );
}

/**
 * Core request method with timeout and error handling
 */
async function request<T>(endpoint: string, config: FetchRequestConfig = {}): Promise<FetchResponse<T>> {
  const {
    baseURL = API_URL,
    timeout = 30000, // 30 seconds default
    params,
    headers = {},
    ...fetchConfig
  } = config;

  const url = buildUrl(baseURL, endpoint, params);

  // Merge headers - but don't set Content-Type for FormData (browser will set it with boundary)
  const isFormData = fetchConfig.body instanceof FormData;
  const defaultHeaders: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };

  const finalHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    // Race between fetch and timeout
    const fetchPromise = fetch(url, {
      ...fetchConfig,
      headers: finalHeaders,
      credentials: 'include', // Always include cookies for auth
      signal: controller.signal,
    });

    const timeoutPromise = timeout > 0 ? createTimeout(timeout) : null;

    const response = timeoutPromise ? await Promise.race([fetchPromise, timeoutPromise]) : await fetchPromise;

    // Clear timeout if request completed
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Normalize response (always returns consistent structure)
    const normalized = await normalizeResponse<T>(response);

    // If response is not ok, throw error
    if (!response.ok) {
      // Extract error message from normalized data
      const errorData = normalized.data as any;
      const errorMessage =
        errorData?.message ||
        errorData?.error?.message ||
        ERROR_MESSAGES[response.status] ||
        `HTTP ${response.status}: ${response.statusText}`;

      throw new FetchError(
        errorMessage,
        response.status,
        errorData,
        isRetryableError(new FetchError('', response.status)),
      );
    }

    return normalized;
  } catch (error) {
    // Clear timeout on error
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FetchError('Request timeout', 408, undefined, true);
    }

    // Re-throw FetchError as-is
    if (error instanceof FetchError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new FetchError('Network error: Failed to fetch', 0, undefined, true);
    }

    // Unknown error
    throw new FetchError(error instanceof Error ? error.message : String(error), 0, undefined, false);
  }
}

/**
 * API Client
 * All methods return the data directly from the server response
 * Server returns data directly (not wrapped in ApiResponse<T>)
 */
export const api = {
  /**
   * GET request
   * Returns: T (the data directly from server)
   */
  async get<T>(endpoint: string, config?: FetchRequestConfig): Promise<T> {
    const response = await request<T>(endpoint, { ...config, method: 'GET' });
    return response.data;
  },

  /**
   * POST request
   * Returns: T (the data directly from server)
   */
  async post<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;

    const response = await request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });

    return response.data;
  },

  /**
   * PATCH request
   * Returns: T (the data directly from server)
   */
  async patch<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;

    const response = await request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body,
    });

    return response.data;
  },

  /**
   * PUT request
   * Returns: T (the data directly from server)
   */
  async put<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;

    const response = await request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    });

    return response.data;
  },

  /**
   * DELETE request
   * Returns: T (the data directly from server)
   */
  async delete<T>(endpoint: string, config?: FetchRequestConfig): Promise<T> {
    const response = await request<T>(endpoint, { ...config, method: 'DELETE' });
    return response.data;
  },
};
