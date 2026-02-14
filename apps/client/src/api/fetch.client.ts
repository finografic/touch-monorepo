/**
 * Native Fetch API Client
 *
 * Replaces axios with native fetch for better performance, smaller bundle size,
 * and modern web standards. Provides consistent error handling and response normalization.
 */

import {
  buildUrl,
  ERROR_MESSAGES,
  FetchError,
  type FetchRequestConfig,
  type FetchResponse,
  isRetryableError,
  normalizeResponse,
} from '@workspace/core/api';

/**
 * Runtime API URL detection.
 * In production, derives the API host from window.location.hostname so the
 * client works on any network without baking an IP at build time.
 * In development, Vite proxy handles /api so we use the baked-in value.
 */
const isProduction = process.env.NODE_ENV === 'production';
const API_PORT = process.env.API_PORT ?? 4040;
const API_BASE_PATH = process.env.API_BASE_PATH ?? '/api';

export const getApiBaseUrl = (): string => {
  if (isProduction && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }
  return process.env.API_BASE_URL!;
};

export const getApiUrl = (): string => {
  return `${getApiBaseUrl()}${API_BASE_PATH}`;
};

const API_URL = getApiUrl();

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
function createTimeout(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new FetchError('Request timeout', 408, undefined, true)), timeout);
  });
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
