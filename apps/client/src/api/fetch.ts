/**
 * Native Fetch API Client
 *
 * Replaces axios with native fetch for better performance, smaller bundle size,
 * and modern web standards. Provides consistent error handling and response normalization.
 */

import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
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
 */
function buildUrl(baseURL: string, endpoint: string, params?: Record<string, string | number | boolean | null | undefined>): string {
  const url = new URL(endpoint, baseURL);

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
 * This is the KEY to avoiding res.json vs res.json?.json issues
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
async function request<T>(
  endpoint: string,
  config: FetchRequestConfig = {},
): Promise<FetchResponse<T>> {
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

    const response = timeoutPromise
      ? await Promise.race([fetchPromise, timeoutPromise])
      : await fetchPromise;

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
    throw new FetchError(
      error instanceof Error ? error.message : String(error),
      0,
      undefined,
      false,
    );
  }
}

/**
 * API Client with normalized response handling
 * All methods return the data directly (not wrapped in response.data)
 * This normalizes the API to avoid res.json vs res.json?.json issues
 */
export const api = {
  /**
   * GET request
   * Returns: T (the data directly, not wrapped in ApiResponse)
   */
  async get<T>(endpoint: string, config?: FetchRequestConfig): Promise<T> {
    const response = await request<ApiResponse<T>>(endpoint, { ...config, method: 'GET' });

    // Normalize: If server returns ApiResponse<T>, extract data
    // If server returns T directly, use it as-is
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }

    // Server returned T directly
    return response.data as T;
  },

  /**
   * POST request
   * Returns: T (the data directly, not wrapped in ApiResponse)
   */
  async post<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);

    const response = await request<ApiResponse<T>>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });

    // Normalize: If server returns ApiResponse<T>, extract data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }

    // Server returned T directly
    return response.data as T;
  },

  /**
   * PATCH request
   * Returns: T (the data directly, not wrapped in ApiResponse)
   */
  async patch<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);

    const response = await request<ApiResponse<T>>(endpoint, {
      ...config,
      method: 'PATCH',
      body,
    });

    // Normalize: If server returns ApiResponse<T>, extract data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }

    // Server returned T directly
    return response.data as T;
  },

  /**
   * PUT request
   * Returns: T (the data directly, not wrapped in ApiResponse)
   */
  async put<T>(endpoint: string, data?: any, config?: FetchRequestConfig): Promise<T> {
    // Handle FormData - don't stringify it, pass as-is
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);

    const response = await request<ApiResponse<T>>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    });

    // Normalize: If server returns ApiResponse<T>, extract data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }

    // Server returned T directly
    return response.data as T;
  },

  /**
   * DELETE request
   * Returns: T (the data directly, not wrapped in ApiResponse)
   */
  async delete<T>(endpoint: string, config?: FetchRequestConfig): Promise<T> {
    const response = await request<ApiResponse<T>>(endpoint, { ...config, method: 'DELETE' });

    // Normalize: If server returns ApiResponse<T>, extract data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<T>).data;
    }

    // Server returned T directly
    return response.data as T;
  },
};

